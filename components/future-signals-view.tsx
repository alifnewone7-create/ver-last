'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Radio,
  Landmark,
  Check,
  X,
  Radar,
  ChevronsUp,
  ChevronsDown,
  Cpu,
  Clock,
  Timer,
  Layers,
  Search,
  ChevronRight,
  ChevronDown,
  Waypoints,
  Minus,
  Plus,
  Hash,
} from '@/components/icons'
import { TopNav } from '@/components/top-nav'
import { AuthGuard } from '@/components/auth-guard'
import { PairFlags } from '@/components/pair-flags'
import { Button } from '@/components/ui/button'
import { otcMarkets, realMarkets, marketLabel, type Market, type MarketType } from '@/lib/markets'
import { cn } from '@/lib/utils'
import { useGatedAction } from '@/hooks/use-gated-action'

type Signal = {
  market: Market
  entry: Date
  direction: 'UP' | 'DOWN'
}

type Phase = 'idle' | 'scanning' | 'ready'

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function FutureSignalsView() {
  return (
    <AuthGuard>
      {() => (
        <main className="home-bg relative min-h-dvh">
          <TopNav />
          <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
            <SignalStudio />
          </div>
        </main>
      )}
    </AuthGuard>
  )
}

function SignalStudio() {
  const { preflight, handleServerGate } = useGatedAction('future-signals')
  const [activeTab, setActiveTab] = useState<MarketType>('otc')
  const [selected, setSelected] = useState<Record<string, Market>>({})
  const [query, setQuery] = useState('')
  const [count, setCount] = useState(5)
  const [phase, setPhase] = useState<Phase>('idle')
  const [signals, setSignals] = useState<Signal[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // The category currently locked by the selection (only one allowed at a time)
  const lockedType = useMemo<MarketType | null>(() => {
    const first = Object.values(selected)[0]
    return first ? first.type : null
  }, [selected])

  const selectedList = useMemo(() => Object.values(selected), [selected])

  const markets = activeTab === 'otc' ? otcMarkets : realMarkets
  const filtered = useMemo(() => {
    const q = query.trim().toUpperCase()
    if (!q) return markets
    return markets.filter((m) => `${m.base}/${m.quote}`.includes(q))
  }, [markets, query])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  function toggle(m: Market) {
    // Only allow markets from a single category at a time.
    if (lockedType && lockedType !== m.type) return
    setSelected((prev) => {
      const next = { ...prev }
      if (next[m.id]) delete next[m.id]
      else next[m.id] = m
      return next
    })
    if (phase !== 'idle') {
      setPhase('idle')
      setSignals([])
    }
  }

  function clearAll() {
    setSelected({})
    setSignals([])
    setPhase('idle')
  }

  async function generate() {
    if (selectedList.length === 0 || phase === 'scanning') return

    // Client preflight (access + remaining credits). Each generated signal
    // consumes one credit, so preflight against the full requested count.
    const gate = await preflight(count)
    if (!gate.allowed) return

    // Consume a credit + fetch the signal queue from the server. This cannot
    // be faked from the client without spending a real daily credit.
    let picks: { direction: 'UP' | 'DOWN'; offsetMin: number }[]
    try {
      const res = await fetch('/api/signals/future', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${gate.token}`,
        },
        body: JSON.stringify({ count }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        if (handleServerGate(res.status, body)) return
        return
      }
      const data = (await res.json()) as {
        picks: { direction: 'UP' | 'DOWN'; offsetMin: number }[]
      }
      picks = data.picks
    } catch {
      return
    }

    setSignals([])
    setPhase('scanning')

    // Map the server-issued picks onto the selected markets with entry times.
    const base = Date.now()
    let cumulative = 0
    const queue: Signal[] = picks.map((pick, i) => {
      const m = selectedList[i % selectedList.length]
      cumulative += pick.offsetMin
      return {
        market: m,
        entry: new Date(base + cumulative * 60_000),
        direction: pick.direction,
      }
    })

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setSignals(queue)
      setPhase('ready')
    }, 10_000)
  }

  const disabledOther = lockedType !== null

  // When scanning or showing results, replace the market picker entirely with
  // the analyzing / results view (per product spec — market select page hides).
  if (phase === 'scanning') {
    return <SignalScanner selectedList={selectedList} count={count} />
  }

  if (phase === 'ready') {
    return (
      <SignalResults
        signals={signals}
        onReset={() => {
          setPhase('idle')
          setSignals([])
        }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Selected summary — only shown once markets are selected */}
      {selectedList.length > 0 && (
        <SelectedBar
          selectedList={selectedList}
          lockedType={lockedType}
          onRemove={(m) => toggle(m)}
          onClear={clearAll}
        />
      )}

      {/* Market picker */}
      <section className="border-luxe surface-luxe relative overflow-hidden rounded-3xl p-5 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-accent" />
              <h2 className="text-lg font-bold tracking-tight">Select markets</h2>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 rounded-2xl border border-border/60 bg-input/20 p-1">
              <TabButton
                active={activeTab === 'otc'}
                onClick={() => setActiveTab('otc')}
                icon={Radio}
                label="OTC Market"
                dim={disabledOther && lockedType !== 'otc'}
              />
              <TabButton
                active={activeTab === 'real'}
                onClick={() => setActiveTab('real')}
                icon={Landmark}
                label="Real Market"
                dim={disabledOther && lockedType !== 'real'}
              />
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pair (e.g. EUR/USD)"
              className="h-11 w-full rounded-xl border border-border bg-input/25 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent/60"
            />
          </div>

          {/* Grid */}
          <div className="grid max-h-[22rem] grid-cols-2 gap-2.5 overflow-y-auto pr-1 scroll-rail sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((m) => {
              const isSelected = Boolean(selected[m.id])
              const isDisabled = disabledOther && lockedType !== m.type
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggle(m)}
                  disabled={isDisabled}
                  aria-pressed={isSelected}
                  className={cn(
                    'group relative flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all',
                    isSelected
                      ? 'border-transparent btn-luxe'
                      : 'border-border bg-input/20 hover:border-accent/40 hover:bg-input/40',
                    isDisabled && 'cursor-not-allowed opacity-35 hover:border-border hover:bg-input/20',
                  )}
                >
                  <PairFlags base={m.base} quote={m.quote} size={20} />
                  <span
                    className={cn(
                      'flex-1 truncate text-sm font-semibold',
                      isSelected && 'text-primary-foreground',
                    )}
                  >
                    {marketLabel(m)}
                  </span>
                  <span
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors',
                      isSelected
                        ? 'border-primary-foreground/50 bg-primary-foreground/20'
                        : 'border-border bg-transparent group-hover:border-accent/50',
                    )}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                  </span>
                </button>
              )
            })}
            {filtered.length === 0 && (
              <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
                No markets match “{query}”.
              </p>
            )}
          </div>

          {/* Signal count */}
          <SignalCount
            count={count}
            min={1}
            max={20}
            onChange={(n) => {
              setCount(n)
              if (phase !== 'idle') {
                setPhase('idle')
                setSignals([])
              }
            }}
          />

          {/* Generate */}
          <Button
            onClick={generate}
            disabled={selectedList.length === 0 || phase === 'scanning'}
            className="btn-luxe mt-1 h-14 w-full gap-2 rounded-2xl py-3.5 text-base font-bold disabled:opacity-50"
          >
            <Waypoints
              className={cn(
                'h-5 w-5',
                phase === 'scanning' ? 'animate-spin' : 'icon-float',
              )}
            />
            {phase === 'scanning'
              ? 'Generating…'
              : `Generate Future Signal${count > 1 ? 's' : ''}`}
            {selectedList.length > 0 && phase !== 'scanning' && (
              <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs">
                {count}
              </span>
            )}
          </Button>
        </div>
      </section>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  dim,
}: {
  active: boolean
  onClick: () => void
  icon: React.ComponentType<{ className?: string }>
  label: string
  dim?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-sm font-semibold transition-all',
        active
          ? 'btn-luxe'
          : 'text-muted-foreground hover:bg-input/40 hover:text-foreground',
        dim && !active && 'opacity-50',
      )}
    >
      <Icon className={cn('h-4 w-4', active && 'text-primary-foreground')} />
      {label}
    </button>
  )
}

function SignalCount({
  count,
  min,
  max,
  onChange,
}: {
  count: number
  min: number
  max: number
  onChange: (n: number) => void
}) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n))
  const presets = [3, 5, 10, 15]

  return (
    <div className="flex flex-row items-center justify-between gap-3 rounded-2xl border border-border/60 bg-input/20 p-4">
      <div className="flex min-w-0 items-center gap-2">
        <Hash className="h-4 w-4 shrink-0 text-accent" />
        <div className="min-w-0">
          <p className="text-sm font-bold tracking-tight">How many signals?</p>
          <p className="truncate text-xs text-muted-foreground">Choose the amount to generate</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {/* presets */}
        <div className="hidden items-center gap-1 rounded-xl border border-border/60 bg-background/40 p-1 sm:flex">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange(clamp(p))}
              className={cn(
                'min-w-8 rounded-lg px-2 py-1 text-xs font-bold transition-all',
                count === p
                  ? 'btn-luxe'
                  : 'text-muted-foreground hover:bg-input/50 hover:text-foreground',
              )}
            >
              {p}
            </button>
          ))}
        </div>

        {/* stepper */}
        <div className="flex items-center gap-1 rounded-xl border border-border/60 bg-background/40 p-1">
          <button
            type="button"
            onClick={() => onChange(clamp(count - 1))}
            disabled={count <= min}
            aria-label="Decrease signal count"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-input/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            value={count}
            onChange={(e) => {
              const v = Number.parseInt(e.target.value, 10)
              if (!Number.isNaN(v)) onChange(clamp(v))
            }}
            className="w-12 bg-transparent text-center font-mono text-lg font-bold tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            aria-label="Signal count"
          />
          <button
            type="button"
            onClick={() => onChange(clamp(count + 1))}
            disabled={count >= max}
            aria-label="Increase signal count"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-input/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function SelectedBar({
  selectedList,
  lockedType,
  onRemove,
  onClear,
}: {
  selectedList: Market[]
  lockedType: MarketType | null
  onRemove: (m: Market) => void
  onClear: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const MOBILE_LIMIT = 3
  const isCollapsible = selectedList.length > MOBILE_LIMIT

  return (
    <section className="border-luxe surface-luxe rounded-3xl p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="btn-luxe flex h-8 w-8 items-center justify-center rounded-lg">
            <Check className="h-4 w-4 text-primary-foreground" />
          </span>
          <div className="flex items-baseline gap-2">
            <h2 className="text-sm font-bold tracking-tight">Selected</h2>
            <span className="text-xs text-muted-foreground">
              {selectedList.length} market{selectedList.length === 1 ? '' : 's'}
              {lockedType ? ` · ${lockedType === 'otc' ? 'OTC Market' : 'Real Market'}` : ''}
            </span>
          </div>
        </div>
        {selectedList.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="btn-luxe-outline flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-1.5 sm:flex sm:flex-wrap sm:gap-2">
        {selectedList.length === 0 ? (
          <p className="col-span-3 text-sm text-muted-foreground">
            No markets selected yet. Pick pairs below to build your signal queue.
          </p>
        ) : (
          selectedList.map((m, i) => {
            // On mobile, hide chips beyond the limit until expanded. Always show on sm+.
            const hiddenOnMobile = isCollapsible && !expanded && i >= MOBILE_LIMIT
            return (
              <span
                key={m.id}
                className={cn(
                  'animate-in fade-in zoom-in-95 min-w-0 items-center justify-center gap-1 rounded-full border border-border bg-input/30 px-1.5 py-1 text-[10px] font-semibold duration-200 sm:justify-start sm:gap-2 sm:pl-1.5 sm:pr-1 sm:text-sm',
                  hiddenOnMobile ? 'hidden sm:flex' : 'flex',
                )}
              >
                <span className="shrink-0">
                  <PairFlags base={m.base} quote={m.quote} size={14} />
                </span>
                <span className="truncate">{marketLabel(m)}</span>
                <button
                  type="button"
                  onClick={() => onRemove(m)}
                  aria-label={`Remove ${marketLabel(m)}`}
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive sm:h-5 sm:w-5"
                >
                  <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </button>
              </span>
            )
          })
        )}
      </div>

      {/* Mobile-only see all / show less toggle */}
      {isCollapsible && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="btn-luxe-outline mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold sm:hidden"
        >
          {expanded ? 'Show less' : `Show all ${selectedList.length}`}
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')}
          />
        </button>
      )}
    </section>
  )
}

function SignalScanner({
  selectedList,
  count,
}: {
  selectedList: Market[]
  count: number
}) {
  const [progress, setProgress] = useState(0)
  const [stageIdx, setStageIdx] = useState(0)
  const [tickerIdx, setTickerIdx] = useState(0)

  const stages = useMemo(
    () => [
      'Initializing quantum lattice',
      'Fetching liquidity depth',
      'Modeling reverse-logic bias',
      'Scoring confidence bands',
      'Locking entry windows',
    ],
    [],
  )

  useEffect(() => {
    // Total 10s to match the parent timer; animate progress smoothly.
    const start = Date.now()
    const total = 10_000
    const tick = setInterval(() => {
      const elapsed = Date.now() - start
      const p = Math.min(100, (elapsed / total) * 100)
      setProgress(p)
      setStageIdx(Math.min(stages.length - 1, Math.floor((p / 100) * stages.length)))
      if (p >= 100) clearInterval(tick)
    }, 80)
    return () => clearInterval(tick)
  }, [stages.length])

  useEffect(() => {
    if (selectedList.length <= 1) return
    const t = setInterval(() => {
      setTickerIdx((i) => (i + 1) % selectedList.length)
    }, 900)
    return () => clearInterval(t)
  }, [selectedList.length])

  const activeMarket = selectedList[tickerIdx] ?? selectedList[0]

  return (
    <section className="border-luxe surface-luxe card-corner-glow animate-in fade-in zoom-in-95 relative overflow-hidden rounded-3xl p-6 duration-500 sm:p-8">
      {/* soft grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--accent) 1px, transparent 1px), linear-gradient(to bottom, var(--accent) 1px, transparent 1px)',
          backgroundSize: '38px 38px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            Vertex AI · Scanning
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="text-gradient">Analyzing markets</span>
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Generating {count} future signal{count === 1 ? '' : 's'} across{' '}
            {selectedList.length} pair{selectedList.length === 1 ? '' : 's'}
          </p>
        </div>

        {/* Radar / orbit visual */}
        <div className="relative flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
          {/* concentric rings */}
          <span className="absolute inset-0 rounded-full border border-accent/25" />
          <span className="absolute inset-[14%] rounded-full border border-accent/20" />
          <span className="absolute inset-[28%] rounded-full border border-accent/15" />

          {/* sweeping conic beam */}
          <span
            aria-hidden
            className="scan-sweep absolute inset-0 rounded-full"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg, var(--accent) 40deg, transparent 90deg)',
              maskImage:
                'radial-gradient(circle, transparent 18%, black 20%, black 100%)',
              WebkitMaskImage:
                'radial-gradient(circle, transparent 18%, black 20%, black 100%)',
              opacity: 0.45,
            }}
          />

          {/* orbit — outer, clockwise */}
          <span className="orbit-cw absolute inset-[6%] rounded-full">
            <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
              <span className="block h-2 w-2 rounded-full bg-accent shadow-[0_0_14px_2px_var(--accent)]" />
            </span>
            <span className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
              <span className="block h-1.5 w-1.5 rounded-full bg-up shadow-[0_0_10px_1px_var(--up)]" />
            </span>
          </span>

          {/* orbit — inner, counter-clockwise */}
          <span className="orbit-ccw absolute inset-[22%] rounded-full">
            <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
              <span className="block h-1.5 w-1.5 rounded-full bg-[var(--gold)] shadow-[0_0_10px_1px_var(--gold)]" />
            </span>
            <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="block h-1.5 w-1.5 rounded-full bg-down shadow-[0_0_10px_1px_var(--down)]" />
            </span>
          </span>

          {/* core */}
          <div className="core-pulse relative flex h-24 w-24 items-center justify-center rounded-full border border-accent/40 bg-background/60 backdrop-blur-sm sm:h-28 sm:w-28">
            <Radar className="h-9 w-9 text-accent" strokeWidth={1.6} />
          </div>

          {/* active pair badge floating below core */}
          {activeMarket && (
            <div className="animate-in fade-in absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border/70 bg-background/85 px-3 py-1.5 shadow-lg backdrop-blur-md duration-300">
              <PairFlags base={activeMarket.base} quote={activeMarket.quote} size={16} />
              <span className="font-mono text-xs font-bold tabular-nums">
                {marketLabel(activeMarket)}
              </span>
            </div>
          )}
        </div>

        {/* stage + progress */}
        <div className="w-full max-w-md">
          <div className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="flex items-center gap-1.5 text-accent">
              <Cpu className="h-3.5 w-3.5" />
              {stages[stageIdx]}
            </span>
            <span className="tabular-nums text-accent">{Math.floor(progress)}%</span>
          </div>
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-input/40">
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent/70 via-accent to-[var(--gold)] transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
            {stages.map((s, i) => (
              <span
                key={s}
                className={cn(
                  'rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors',
                  i <= stageIdx
                    ? 'border-accent/40 bg-accent/10 text-accent'
                    : 'border-border/60 bg-input/20 text-muted-foreground',
                )}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function SignalResults({ signals, onReset }: { signals: Signal[]; onReset: () => void }) {
  return (
    <section className="border-luxe surface-luxe card-corner-glow animate-in fade-in slide-in-from-bottom-3 relative overflow-hidden rounded-3xl p-5 duration-500 sm:p-6">
      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="btn-luxe flex h-9 w-9 items-center justify-center rounded-xl">
              <Radar className="h-4 w-4 text-primary-foreground" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                Vertex AI · Ready
              </p>
              <h3 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                <span className="text-gradient">
                  {signals.length} future signal{signals.length === 1 ? '' : 's'} generated
                </span>
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="btn-luxe-outline flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold"
          >
            <X className="h-3.5 w-3.5" />
            New scan
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {signals.map((s, i) => (
            <SignalCard key={`${s.market.id}-${i}`} signal={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SignalCard({ signal, index }: { signal: Signal; index: number }) {
  const { market, entry, direction } = signal
  const isUp = direction === 'UP'
  return (
    <div
      className="border-luxe surface-luxe card-corner-glow animate-in fade-in slide-in-from-bottom-3 relative overflow-hidden rounded-2xl p-4 duration-500"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <PairFlags base={market.base} quote={market.quote} size={26} />
            <div>
              <p className="text-base font-bold tracking-tight">
                {marketLabel(market)}
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">
                {market.type === 'otc' ? 'OTC Market' : 'Real Market'} · #{index + 1}
              </p>
            </div>
          </div>
          <span
            className={cn(
              'flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-bold',
              isUp ? 'bg-up/15 text-up' : 'bg-down/15 text-down',
            )}
          >
            {isUp ? (
              <ChevronsUp className="dir-arrow-up h-4 w-4" />
            ) : (
              <ChevronsDown className="dir-arrow-down h-4 w-4" />
            )}
            {direction}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2 rounded-xl bg-input/25 px-3 py-2.5">
            <Clock className="h-4 w-4 shrink-0 text-accent" />
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Entry time
              </p>
              <p className="font-mono text-sm font-bold tabular-nums">{formatTime(entry)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-input/25 px-3 py-2.5">
            <Timer className="h-4 w-4 shrink-0 text-accent" />
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Duration
              </p>
              <p className="font-mono text-sm font-bold">1 Min</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <ChevronRight className="h-3.5 w-3.5 text-accent" />
          Place the {direction === 'UP' ? 'CALL' : 'PUT'} at {formatTime(entry)} · expiry 1 minute
        </div>
      </div>
    </div>
  )
}
