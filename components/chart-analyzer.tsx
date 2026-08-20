'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import {
  Upload,
  X,
  Scan,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  RefreshCw,
  AlertTriangle,
  ShieldAlert,
  Cpu,
  TrendingUp,
  Waypoints,
  Activity,
  MinusCircle,
  GitBranch,
  Gauge,
  ChevronRight,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import { PairFlags } from '@/components/pair-flags'
import { cn } from '@/lib/utils'
import { useGatedAction } from '@/hooks/use-gated-action'

type AnalyzerMode = 'otc' | 'real'

type AnalysisResult = {
  validation: { isValidChart: boolean; isOtc: boolean; reason: string }
  description: {
    pair: string
    timeframe: string
    trend: string
    marketStructure?: string
    candlesRead?: string
    candlePattern: string
    indicatorsRead?: string
    notes: string
  }
  analysis: {
    strategyVotes?: string
    votesTally?: string
    probabilityScores?: string
    signal: 'UP' | 'DOWN' | 'NO TRADE' | 'N/A'
    option: 'CALL' | 'PUT' | 'NO TRADE' | 'N/A'
    confidence: number
    support: string
    resistance: string
    keyFocus: string
    logic: string
  }
}

type Popup = {
  kind: 'not-otc' | 'is-otc' | 'not-chart'
  title: string
  message: string
}

const ANALYSIS_LINES = [
  'Linking neural core',
  'Reading candle structure',
  'Mapping trend & pressure',
  'Scanning key levels',
  'Locking 1-min bias',
]

const ANALYSIS_CACHE_PREFIX = 'vertex:chart-analysis:v1'

function readImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Unable to read this image.'))
    reader.readAsDataURL(file)
  })
}

async function fingerprintImage(file: File) {
  try {
    const bytes = await file.arrayBuffer()
    const digest = await crypto.subtle.digest('SHA-256', bytes)
    return Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, '0'),
    ).join('')
  } catch {
    return null
  }
}

function isAnalysisResult(value: unknown): value is AnalysisResult {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<AnalysisResult>
  return Boolean(
    candidate.validation &&
      typeof candidate.validation.isValidChart === 'boolean' &&
      typeof candidate.validation.isOtc === 'boolean' &&
      candidate.description &&
      candidate.analysis &&
      typeof candidate.analysis.signal === 'string' &&
      typeof candidate.analysis.confidence === 'number',
  )
}

function getCachedAnalysis(key: string) {
  try {
    const cached = window.localStorage.getItem(key)
    if (!cached) return null
    const parsed: unknown = JSON.parse(cached)
    return isAnalysisResult(parsed) ? parsed : null
  } catch {
    return null
  }
}

function cacheAnalysis(key: string, result: AnalysisResult) {
  try {
    window.localStorage.setItem(key, JSON.stringify(result))
  } catch {
    // Storage can be unavailable or full; analysis should still work normally.
  }
}

export function ChartAnalyzer({ mode }: { mode: AnalyzerMode }) {
  const feature = mode === 'real' ? 'real-chart-analyzer' : 'otc-chart-analyzer'
  const { preflight, handleServerGate } = useGatedAction(feature)
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [fingerprint, setFingerprint] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [popup, setPopup] = useState<Popup | null>(null)

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }
    setError('')
    setResult(null)
    setFingerprint(null)

    try {
      const [image, imageFingerprint] = await Promise.all([
        readImage(file),
        fingerprintImage(file),
      ])
      setPreview(image)
      setFingerprint(imageFingerprint)
    } catch (err) {
      setPreview(null)
      setError(err instanceof Error ? err.message : 'Unable to read this image.')
    }
  }, [])

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function onPaste(e: React.ClipboardEvent) {
    const file = e.clipboardData.files?.[0]
    if (file) handleFile(file)
  }

  function reset() {
    setPreview(null)
    setFingerprint(null)
    setResult(null)
    setError('')
    setPopup(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  async function analyze() {
    if (!preview || loading) return

    // Client preflight (access + remaining credits). Server still enforces.
    const gate = await preflight()
    if (!gate.allowed) return

    setLoading(true)
    setError('')
    setResult(null)
    setPopup(null)
    try {
      const cacheKey = fingerprint
        ? `${ANALYSIS_CACHE_PREFIX}:${mode}:${fingerprint}`
        : null
      let data = cacheKey ? getCachedAnalysis(cacheKey) : null

      if (!data) {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${gate.token}`,
          },
          body: JSON.stringify({ image: preview, mode }),
        })
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          // Access / limit errors open the upgrade modal instead of a raw error.
          if (handleServerGate(res.status, errorData)) {
            return
          }
          throw new Error(errorData.error || 'Analysis failed.')
        }

        const responseData: unknown = await res.json()
        if (!isAnalysisResult(responseData)) {
          throw new Error('The analyzer returned an invalid response.')
        }
        data = responseData
        if (cacheKey) cacheAnalysis(cacheKey, data)
      }

      // Gate 1: must be a real candlestick chart screenshot
      if (!data.validation?.isValidChart) {
        setPopup({
          kind: 'not-chart',
          title: 'Not a valid chart',
          message:
            'This does not look like a trading chart. Please upload a proper candlestick chart screenshot to run the analysis.',
        })
        return
      }

      // Gate 2 (OTC mode only): market must be an OTC pair
      if (mode === 'otc' && !data.validation?.isOtc) {
        setPopup({
          kind: 'not-otc',
          title: 'This is not an OTC market',
          message: `The detected pair "${data.description?.pair || 'Unknown'}" is not an OTC market. Upload a Quotex OTC chart (for example USD/BRL (OTC)) to get a signal.`,
        })
        return
      }

      // Gate 3 (Real mode only): market must NOT be an OTC pair
      if (mode === 'real' && data.validation?.isOtc) {
        setPopup({
          kind: 'is-otc',
          title: 'This is an OTC market',
          message: `The detected pair "${data.description?.pair || 'Unknown'}" is an OTC market. Upload a real market chart (for example EUR/USD or GBP/USD) to get a signal.`,
        })
        return
      }

      setResult(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Result view fully replaces the upload card once ready */}
      {result ? (
        <div className="flex flex-col gap-6">
          <ResultBlock result={result} />
          <Button
            onClick={reset}
            className="btn-luxe h-14 w-full gap-2 rounded-2xl text-base font-bold"
          >
            <RefreshCw className="refresh-spin h-5 w-5" />
            Analyze another chart
          </Button>
        </div>
      ) : (
        <section className="border-luxe surface-luxe card-corner-glow relative overflow-hidden rounded-3xl">
          {/* Terminal-style header, flush with the top of the card */}
          <div className="relative z-10 flex items-center gap-2 border-b border-[oklch(0.7_0.16_135_/_0.55)] px-5 py-3 sm:px-6">
            {mode === 'real' ? (
              <>
                <span
                  className="h-3 w-3 animate-pulse rounded-full bg-gradient-to-br from-up to-accent shadow-[0_0_8px_-1px] shadow-up/60"
                  style={{ animationDuration: '1.8s', animationDelay: '0s' }}
                />
                <span
                  className="h-3 w-3 animate-pulse rounded-full bg-gradient-to-br from-accent to-primary shadow-[0_0_8px_-1px] shadow-accent/60"
                  style={{ animationDuration: '1.8s', animationDelay: '0.3s' }}
                />
                <span
                  className="h-3 w-3 animate-pulse rounded-full bg-gradient-to-br from-primary to-[var(--gold)] shadow-[0_0_8px_-1px] shadow-primary/60"
                  style={{ animationDuration: '1.8s', animationDelay: '0.6s' }}
                />
              </>
            ) : (
              <>
                <span
                  className="h-3 w-3 animate-pulse rounded-full bg-gradient-to-br from-destructive to-[var(--gold)] shadow-[0_0_8px_-1px] shadow-destructive/60"
                  style={{ animationDuration: '1.8s', animationDelay: '0s' }}
                />
                <span
                  className="h-3 w-3 animate-pulse rounded-full bg-gradient-to-br from-[var(--gold)] to-up shadow-[0_0_8px_-1px] shadow-[var(--gold)]/60"
                  style={{ animationDuration: '1.8s', animationDelay: '0.3s' }}
                />
                <span
                  className="h-3 w-3 animate-pulse rounded-full bg-gradient-to-br from-up to-accent shadow-[0_0_8px_-1px] shadow-up/60"
                  style={{ animationDuration: '1.8s', animationDelay: '0.6s' }}
                />
              </>
            )}
            <span className="ml-2 flex min-w-0 items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <Cpu className="h-3.5 w-3.5 shrink-0 text-accent" />
              <span className="truncate whitespace-nowrap">
                vertex@ai — {mode === 'real' ? 'Real Chart Analyzer' : 'Otc Chart Analyzer'}
              </span>
            </span>
          </div>

          <div className="relative z-10 flex flex-col gap-5 p-5 sm:p-6">
            {/* Empty state — upload dropzone */}
            {!preview && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onPaste={onPaste}
                className={cn(
                  'group flex w-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed px-6 py-14 text-center transition-all sm:py-16',
                  dragging
                    ? 'border-accent bg-accent/10'
                    : 'border-border bg-input/20 hover:border-accent/45 hover:bg-input/35',
                )}
              >
                <span className="btn-luxe flex h-16 w-16 items-center justify-center rounded-2xl transition-transform group-hover:scale-105">
                  <Upload className="icon-float h-7 w-7 text-primary-foreground" />
                </span>
                <span className="text-lg font-bold tracking-tight sm:text-xl">
                  Drop your chart to begin
                </span>
                <span className="max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
                  Tap to browse, drag &amp; drop, or paste a screenshot of your
                  candlestick chart.
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                  PNG · JPG · WEBP
                </span>
              </button>
            )}

            {/* Preview + analyzing overlay */}
            {preview && (
              <>
                <div className="border-luxe relative overflow-hidden rounded-2xl bg-input/20">
                  <div className="pointer-events-none absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-lg bg-background/60 px-2.5 py-1 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">
                      Chart Feed
                    </span>
                  </div>
                  <div className="flex max-h-[52vh] w-full items-center justify-center overflow-hidden sm:max-h-[58vh]">
                    <Image
                      src={preview}
                      alt="Uploaded chart preview"
                      width={1280}
                      height={720}
                      unoptimized
                      className="h-auto max-h-[52vh] w-full object-contain sm:max-h-[58vh]"
                    />
                  </div>
                  {loading && <AnalyzingOverlay />}
                </div>

                {!loading && (
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      onClick={analyze}
                      className="btn-luxe h-14 w-full gap-2 rounded-2xl text-base font-bold sm:flex-1"
                    >
                      <Scan className="h-5 w-5" />
                      Analyze Chart
                    </Button>
                    <Button
                      onClick={reset}
                      className="btn-luxe-outline h-14 w-full gap-2 rounded-2xl px-5 text-base font-semibold sm:w-auto sm:flex-none"
                    >
                      <X className="h-4 w-4" />
                      Clear
                    </Button>
                  </div>
                )}
              </>
            )}

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
              >
                {error}
              </p>
            )}
          </div>
        </section>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />

      {popup && <RejectPopup popup={popup} onClose={() => setPopup(null)} />}
    </div>
  )
}

function AnalyzingOverlay() {
  const [line, setLine] = useState(0)

  useEffect(() => {
    setLine(0)
    const total = 9000
    const step = total / (ANALYSIS_LINES.length + 1)
    const timers = ANALYSIS_LINES.map((_, i) =>
      setTimeout(() => setLine(i + 1), step * (i + 1)),
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-background/75 px-6 backdrop-blur-sm">
      {/* quantum radar scope (unique analyzer element) */}
      <div className="scope" aria-hidden="true">
        <div className="scope-rings" />
        <div className="scope-cross" />
        <div className="scope-sweep" />
        <div className="scope-orbit">
          <span className="scope-blip" />
        </div>
        <div className="scope-orbit scope-orbit--slow">
          <span className="scope-blip" />
        </div>
        <div className="scope-core">
          <Scan className="h-4 w-4 text-primary-foreground" />
        </div>
      </div>

      <div className="flex items-center gap-2 font-mono text-xs text-accent sm:text-sm">
        <Cpu className="h-3.5 w-3.5" />
        <span className="animate-pulse">
          {ANALYSIS_LINES[Math.min(line, ANALYSIS_LINES.length - 1)]}…
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {ANALYSIS_LINES.map((_, i) => (
          <span
            key={i}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i < line ? 'w-6 bg-accent' : 'w-1.5 bg-border',
            )}
          />
        ))}
      </div>
    </div>
  )
}

function RejectPopup({
  popup,
  onClose,
}: {
  popup: Popup
  onClose: () => void
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const isOtc = popup.kind === 'not-otc'
  const Icon = isOtc ? ShieldAlert : AlertTriangle

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 animate-in fade-in bg-background/70 backdrop-blur-sm duration-200"
        onClick={onClose}
      />
      <div className="border-luxe surface-luxe card-corner-glow animate-in fade-in zoom-in-95 slide-in-from-bottom-2 relative z-10 w-full max-w-sm overflow-hidden rounded-3xl duration-300">
        <div className="relative z-10 flex flex-col items-center gap-4 p-6 text-center">
          <span
            className={cn(
              'flex h-16 w-16 items-center justify-center rounded-2xl',
              isOtc
                ? 'bg-destructive/15 text-destructive'
                : 'bg-gold/12 text-gold',
            )}
          >
            <Icon className="icon-pulse-soft h-8 w-8" />
          </span>
          <h2
            id="popup-title"
            className="text-balance text-xl font-bold tracking-tight"
          >
            {popup.title}
          </h2>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            {popup.message}
          </p>
          <Button
            onClick={onClose}
            className="btn-luxe mt-1 h-12 w-full rounded-2xl text-base font-semibold"
          >
            Got it
          </Button>
        </div>
      </div>
    </div>
  )
}

function ResultBlock({ result }: { result: AnalysisResult }) {
  const { description, analysis } = result
  const isNoTrade = analysis.signal === 'NO TRADE'
  const isUp = analysis.signal === 'UP'
  const confidence = Math.max(0, Math.min(100, analysis.confidence || 0))

  // Derive base/quote from the detected pair (e.g. "USD/BRL (OTC)") for flags
  const [base, quote] = (description.pair || '')
    .replace(/\(.*?\)/g, '')
    .trim()
    .split('/')
    .map((s) => s?.trim().toUpperCase())
  const hasFlags = Boolean(base && quote)

  const confLabel =
    confidence >= 75 ? 'High conviction' : confidence >= 50 ? 'Moderate' : 'Low conviction'

  // Animate the confidence bar filling in from 0 on mount
  const [barWidth, setBarWidth] = useState(0)
  const [detailsOpen, setDetailsOpen] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setBarWidth(confidence), 120)
    return () => clearTimeout(t)
  }, [confidence])

  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 flex flex-col gap-4 duration-500">
      <div className="border-luxe surface-luxe card-corner-glow relative overflow-hidden rounded-3xl p-4 sm:p-6">
        <div className="relative z-10 flex flex-col gap-5">
          {/* Pair header */}
          <div className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both flex items-center justify-between gap-3 duration-500">
            <div className="flex min-w-0 items-center gap-3">
              {hasFlags ? (
                <PairFlags base={base} quote={quote} size={30} />
              ) : (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent/12">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-lg font-bold tracking-tight">
                  {description.pair || 'Chart'}
                </p>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-accent">
                  <span
                    className={cn(
                      'status-dot',
                      isNoTrade ? 'status-dot--neutral' : isUp ? 'status-dot--up' : 'status-dot--down',
                    )}
                    aria-hidden
                  />
                  {description.timeframe || '1 Min'} · OTC Signal
                </span>
              </div>
            </div>
            <span
              className={cn(
                'flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold ring-1',
                isNoTrade
                  ? 'bg-muted-foreground/10 text-muted-foreground ring-border'
                  : isUp
                    ? 'bg-up/15 text-up ring-up/30'
                    : 'bg-down/15 text-down ring-down/30',
              )}
            >
              {isNoTrade ? (
                <MinusCircle className="h-4 w-4" />
              ) : isUp ? (
                <ChevronsUp className="dir-arrow-up h-4 w-4" />
              ) : (
                <ChevronsDown className="dir-arrow-down h-4 w-4" />
              )}
              {analysis.signal}
            </span>
          </div>

          {/* Directional signal card — aurora beacon (unique animated luxury) */}
          {isNoTrade ? (
            <div className="animate-in fade-in zoom-in-95 fill-mode-both relative overflow-hidden rounded-[26px] border border-border bg-input/30 p-5 delay-100 duration-500 sm:p-6">
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-muted-foreground/10 ring-1 ring-border sm:h-20 sm:w-20">
                  <MinusCircle className="h-8 w-8 text-muted-foreground sm:h-10 sm:w-10" strokeWidth={2.25} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="inline-flex w-fit items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground sm:tracking-[0.34em]">
                    Stand aside
                  </span>
                  <p className="font-mono text-3xl font-extrabold uppercase leading-none tracking-tight text-foreground sm:text-4xl">
                    NO TRADE
                  </p>
                  <p className="text-pretty text-xs leading-relaxed text-muted-foreground">
                    Confidence below 75% — strategies conflict. Wait for a cleaner setup.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                'lux-beacon animate-in fade-in zoom-in-95 fill-mode-both relative overflow-hidden rounded-[26px] p-px delay-100 duration-500',
                isUp ? 'lux-beacon-up text-up' : 'lux-beacon-down text-down',
              )}
            >
              <span className="lux-beacon-beam" aria-hidden />
              <div className="lux-beacon-inner relative flex items-center gap-4 overflow-hidden rounded-[25px] p-5 sm:gap-5 sm:p-6">
                <span className="lux-beacon-scan" aria-hidden />

                {/* circular medallion with single directional arrow */}
                <div className="lux-beacon-medal relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full sm:h-20 sm:w-20">
                  <span className="lux-beacon-core" aria-hidden />
                  <span className="lux-beacon-ring" aria-hidden />
                  <span className="lux-beacon-march relative">
                    {isUp ? (
                      <ArrowUp className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={2.75} />
                    ) : (
                      <ArrowDown className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={2.75} />
                    )}
                  </span>
                </div>

                <div className="relative flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="lux-beacon-kicker inline-flex w-fit items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] sm:tracking-[0.34em]">
                    <span className="lux-beacon-dot" aria-hidden />
                    Place option
                  </span>
                  <p className="lux-beacon-value font-mono text-3xl font-extrabold uppercase leading-none tracking-tight sm:text-4xl">
                    {analysis.option}
                  </p>
                </div>

                {/* vertical marching chevron ticker */}
                <div className="relative hidden h-16 w-6 shrink-0 flex-col items-center justify-center gap-1 overflow-hidden sm:flex">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className="lux-beacon-tick"
                      style={{ animationDelay: `${(isUp ? 4 - i : i) * 0.12}s` }}
                    >
                      {isUp ? (
                        <ChevronsUp className="h-4 w-4" strokeWidth={2.5} />
                      ) : (
                        <ChevronsDown className="h-4 w-4" strokeWidth={2.5} />
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Confidence meter */}
          <div className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both rounded-2xl border border-border/60 bg-input/20 px-4 py-3.5 delay-200 duration-500">
            <div className="mb-2.5 flex items-end justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Confidence
                </span>
                <span
                  className={cn(
                    'text-xs font-semibold',
                    confidence >= 75 ? 'text-up' : confidence >= 50 ? 'text-accent' : 'text-muted-foreground',
                  )}
                >
                  {confLabel}
                </span>
              </div>
              <span className="text-gradient font-mono text-2xl font-bold tabular-nums">
                {confidence}%
              </span>
            </div>
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-input/50">
              <div
                className={cn(
                  'relative h-full rounded-full transition-[width] duration-1000 ease-out',
                  isNoTrade ? 'bg-muted-foreground/60' : isUp ? 'bg-up' : 'bg-down',
                )}
                style={{ width: `${barWidth}%` }}
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-70" />
              </div>
            </div>
          </div>

          {/* Support / Resistance range */}
          <div className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both rounded-2xl border border-border/60 bg-input/20 px-4 py-3.5 delay-300 duration-500">
            <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-wide">
              <span className="flex items-center gap-1 text-down">
                <ArrowDown className="h-3 w-3" /> Support
              </span>
              <span className="flex items-center gap-1 text-up">
                Resistance <ArrowUp className="h-3 w-3" />
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-down">
                {analysis.support || '—'}
              </span>
              <div className="relative h-1.5 flex-1 rounded-full bg-gradient-to-r from-down/60 via-accent/40 to-up/60">
                <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-accent/70" />
                <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
              </div>
              <span className="font-mono text-sm font-bold text-up">
                {analysis.resistance || '—'}
              </span>
            </div>
          </div>

          {/* Read stat tiles */}
          <div className="grid grid-cols-2 gap-2.5">
            <StatTile icon={Waypoints} label="Trend" value={description.trend} delay={350} tone="emerald" />
            <StatTile icon={Scan} label="Pattern" value={description.candlePattern} delay={420} tone="gold" />
          </div>

          {/* Compact entry point for supporting analysis details */}
          {(description.marketStructure ||
            description.indicatorsRead ||
            analysis.probabilityScores) && (
            <button
              type="button"
              onClick={() => setDetailsOpen(true)}
              className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both group relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-2xl border border-primary/35 bg-gradient-to-br from-primary/12 via-primary/8 to-transparent p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all delay-[440ms] duration-300 hover:-translate-y-0.5 hover:border-primary/55 hover:from-primary/12 hover:via-primary/12"
              aria-haspopup="dialog"
            >
              <span className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-primary/12 blur-2xl transition-opacity duration-300 group-hover:opacity-80" />
              <span className="relative flex min-w-0 items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/35 bg-gradient-to-br from-primary/40 via-primary/12 to-primary/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
                  <Gauge className="icon-float h-5 w-5 text-primary" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold">Analysis Details</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    Structure · Indicators · Scores
                  </span>
                </span>
              </span>
              <span className="relative flex shrink-0 items-center gap-1.5 rounded-full border border-primary/35 bg-gradient-to-r from-primary/12 to-primary/12 px-3 py-1.5 text-xs font-semibold text-primary transition-all group-hover:from-primary/35 group-hover:to-primary/12">
                See all
                <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </button>
          )}

        </div>
      </div>

      {detailsOpen && (
        <AnalysisDetailsPopup
          marketStructure={description.marketStructure}
          indicators={description.indicatorsRead}
          scores={analysis.probabilityScores}
          reasoning={analysis.logic}
          onClose={() => setDetailsOpen(false)}
        />
      )}
    </div>
  )
}

function AnalysisDetailsPopup({
  marketStructure,
  indicators,
  scores,
  reasoning,
  onClose,
}: {
  marketStructure?: string
  indicators?: string
  scores?: string
  reasoning?: string
  onClose: () => void
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!mounted) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="analysis-details-title"
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 pt-8 sm:pt-12"
    >
      <button
        type="button"
        className="absolute inset-0 animate-in fade-in bg-background/75 backdrop-blur-sm duration-200"
        onClick={onClose}
        aria-label="Close analysis details"
      />
      <div className="border-luxe surface-luxe card-corner-glow relative z-10 w-full max-w-lg overflow-hidden rounded-3xl">
        <div className="relative z-10 flex max-h-[82vh] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-border/60 px-5 py-4 sm:px-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-accent">
                Full breakdown
              </p>
              <h2 id="analysis-details-title" className="text-lg font-bold tracking-tight">
                Analysis Details
              </h2>
            </div>
            <Button
              type="button"
              onClick={onClose}
              className="btn-luxe-outline h-10 w-10 shrink-0 rounded-xl p-0"
              aria-label="Close analysis details"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto p-4 sm:p-5">
            {marketStructure && (
              <section className="rounded-2xl border border-border/60 bg-input/20 p-4">
                <p className="mb-1.5 flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                  <GitBranch className="h-3 w-3 text-accent" />
                  Market Structure
                </p>
                <p className="text-pretty text-sm leading-relaxed">{marketStructure}</p>
              </section>
            )}
            <IndicatorsCard raw={indicators} />
            <ProbabilityScores raw={scores} />
            {reasoning && (
              <section className="rounded-2xl border border-border/60 bg-input/20 p-4">
                <p className="mb-1.5 flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                  <Cpu className="h-3 w-3 text-accent" />
                  AI Reasoning
                </p>
                <p className="text-pretty text-sm leading-relaxed">{reasoning}</p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function ProbabilityScores({ raw }: { raw?: string }) {
  const text = (raw || '').trim()
  if (!text) return null

  // Parse "Trend: 80%, Structure: 75%, ..., Total: 82%" into pairs.
  const pairs = text
    .split(',')
    .map((s) => s.trim())
    .map((s) => {
      const m = s.match(/^(.+?):\s*(\d{1,3})\s*%?$/)
      if (!m) return null
      return { name: m[1].trim(), value: Math.max(0, Math.min(100, Number(m[2]))) }
    })
    .filter((p): p is { name: string; value: number } => p !== null)

  if (pairs.length === 0) return null

  const rows = pairs.filter((p) => !/^total$/i.test(p.name))

  return (
    <div className="rounded-2xl border border-border/60 bg-input/20 p-4">
      <p className="mb-3 flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
        <Gauge className="h-3 w-3 text-accent" />
        Probability Scores
      </p>
      <div className="flex flex-col gap-2.5">
        {rows.map((p, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-24 shrink-0 truncate text-[11px] text-muted-foreground">
              {p.name}
            </span>
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-input/50">
              <div
                className={cn(
                  'h-full rounded-full',
                  p.value >= 75 ? 'bg-up' : p.value >= 50 ? 'bg-accent' : 'bg-muted-foreground/50',
                )}
                style={{ width: `${p.value}%` }}
              />
            </div>
            <span className="w-9 shrink-0 text-right font-mono text-[11px] font-semibold tabular-nums">
              {p.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function IndicatorsCard({ raw }: { raw?: string }) {
  const text = (raw || '').trim()
  if (!text) return null

  const isNone = /^none\b/i.test(text) || text.toLowerCase() === 'none visible'

  // Split "EMA20: price above -> UP, RSI: 62 -> UP" into individual readings.
  const items = isNone
    ? []
    : text
        .split(/,(?![^()]*\))/) // split on commas not inside parentheses
        .map((s) => s.trim())
        .filter(Boolean)

  function biasOf(s: string): 'up' | 'down' | 'neutral' {
    const tail = s.toUpperCase()
    if (/\b(UP|BULLISH|CALL)\b/.test(tail)) return 'up'
    if (/\b(DOWN|BEARISH|PUT)\b/.test(tail)) return 'down'
    return 'neutral'
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-input/20 p-4">
      <p className="mb-2.5 flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
        <Activity className="h-3 w-3 text-accent" />
        Technical Indicators
      </p>
      {isNone || items.length === 0 ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          No indicators on this chart — signal is based on pure price action.
        </p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {items.map((item, i) => {
            const bias = biasOf(item)
            return (
              <li
                key={i}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-background/30 px-3 py-2"
              >
                <span className="min-w-0 truncate text-xs text-foreground/90">
                  {item.replace(/\s*->\s*(UP|DOWN|NEUTRAL)\b/i, '')}
                </span>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1',
                    bias === 'up'
                      ? 'bg-up/15 text-up ring-up/30'
                      : bias === 'down'
                        ? 'bg-down/15 text-down ring-down/30'
                        : 'bg-input/40 text-muted-foreground ring-border/60',
                  )}
                >
                  {bias === 'neutral' ? 'NEUTRAL' : bias.toUpperCase()}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

const statTileTones = {
  emerald: {
    card: 'border-emerald/25 from-emerald/12 via-emerald/5 hover:border-emerald/45 hover:from-emerald/12 hover:via-emerald/10',
    chip: 'border-emerald/25 from-emerald/30 via-emerald/12 to-emerald/5',
    icon: 'text-emerald',
  },
  gold: {
    card: 'border-gold/25 from-gold/12 via-gold/5 hover:border-gold/45 hover:from-gold/12 hover:via-gold/10',
    chip: 'border-gold/25 from-gold/30 via-gold/12 to-gold/5',
    icon: 'text-gold',
  },
} as const

function StatTile({
  icon: Icon,
  label,
  value,
  delay = 0,
  tone = 'emerald',
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  delay?: number
  tone?: keyof typeof statTileTones
}) {
  const t = statTileTones[tone]
  return (
    <div
      className={`animate-in fade-in slide-in-from-bottom-2 fill-mode-both group flex items-center gap-3 rounded-2xl border bg-gradient-to-br to-transparent px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-500 hover:-translate-y-0.5 ${t.card}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-transform duration-300 group-hover:scale-110 ${t.chip}`}
      >
        <Icon className={`icon-float h-4 w-4 ${t.icon}`} />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-sm font-bold capitalize">{value || '—'}</p>
      </div>
    </div>
  )
}
