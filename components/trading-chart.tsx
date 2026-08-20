'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Gauge,
  ScanLine,
  ScanSearch,
  Telescope,
  Radio,
  RefreshCw,
  Info,
  Lock,
  InfinityIcon,
  Clock,
  type AppIcon,
} from '@/components/icons'
import { useAuth } from '@/components/auth-provider'
import { FEATURES, FEATURE_LABEL, TIER_LABEL, type FeatureKey } from '@/lib/tiers'
import { cn } from '@/lib/utils'

const FEATURE_ICON: Record<FeatureKey, AppIcon> = {
  'otc-chart-analyzer': ScanLine,
  'real-chart-analyzer': ScanSearch,
  'future-signals': Telescope,
  'live-signals': Radio,
}

export function TradingChart() {
  const { loading, tier, hasAccess, isUnlimited, limit, usage } = useAuth()
  const [infoOpen, setInfoOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!infoOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setInfoOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [infoOpen])

  return (
    <div
      data-testid="daily-limit-card"
      className="border-luxe surface-luxe relative flex h-full flex-col overflow-hidden rounded-3xl p-5 sm:p-6"
    >
      <span aria-hidden className="welcome-luxe-border rounded-3xl" />
      {/* top lime glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-40 w-[22rem] -translate-x-1/2 rounded-full blur-[70px]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(204,255,0,0.14), transparent 70%)',
        }}
      />

      {/* header */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#CCFF00]/25 bg-[#0A0C08] text-[#CCFF00] shadow-[0_0_16px_rgba(204,255,0,0.12)]">
            <Gauge className="h-5 w-5" />
          </span>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h3 className="font-display text-lg font-medium tracking-tight text-white">
                Daily Limit
              </h3>
              <button
                type="button"
                onClick={() => setInfoOpen(true)}
                aria-label="How the daily limit resets"
                aria-haspopup="dialog"
                data-testid="daily-limit-info-button"
                className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/10 hover:text-[#CCFF00]"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>
            <p className="font-display text-[0.65rem] uppercase tracking-[0.16em] text-zinc-500">
              Resets every 24 hours
            </p>
          </div>
        </div>

        {/* quota badge */}
        <span
          data-testid="daily-limit-badge"
          className={cn(
            'font-display flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em]',
            hasAccess
              ? 'border-[#CCFF00]/35 bg-[#CCFF00]/10 text-[#CCFF00]'
              : 'border-rose-400/30 bg-rose-500/10 text-rose-300',
          )}
        >
          {isUnlimited ? (
            <>
              <InfinityIcon className="h-3.5 w-3.5" />
              Unlimited
            </>
          ) : hasAccess ? (
            <>
              <RefreshCw className="h-3 w-3" />
              {limit} / tool
            </>
          ) : (
            <>
              <Lock className="h-3 w-3" />
              {TIER_LABEL[tier]}
            </>
          )}
        </span>
      </div>

      {/* divider */}
      <div
        aria-hidden
        className="relative z-10 mt-4 h-px w-full"
        style={{
          background:
            'linear-gradient(90deg, rgba(204,255,0,0.28), rgba(255,255,255,0.05) 55%, transparent)',
        }}
      />

      {/* body */}
      {loading ? (
        <ul className="relative z-10 mt-4 flex flex-1 flex-col gap-2.5">
          {FEATURES.map((f) => (
            <li
              key={f}
              className="h-[52px] animate-pulse rounded-xl border border-white/5 bg-white/[0.03]"
            />
          ))}
        </ul>
      ) : !hasAccess ? (
        /* locked state */
        <div
          data-testid="daily-limit-locked"
          className="relative z-10 mt-4 flex flex-1 flex-col"
        >
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-rose-400/20 p-5 text-center"
            style={{
              backgroundImage:
                'linear-gradient(160deg, rgba(220,60,110,0.1), rgba(9,11,6,0.7) 60%)',
            }}
          >
            <span className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-rose-400/30 bg-[#0A0C08] text-rose-300">
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-1.5 rounded-2xl bg-rose-500/15 blur-lg"
              />
              <Lock className="relative h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-sm font-semibold text-white">
                Locked on the Free plan
              </p>
              <p className="font-display mx-auto mt-1 max-w-xs text-xs font-light leading-relaxed text-zinc-400">
                Upgrade to unlock a daily quota across all four tools.
              </p>
            </div>
          </div>

          {/* locked tools preview */}
          <ul className="mt-3 flex flex-col gap-2">
            {FEATURES.map((feature) => {
              const Icon = FEATURE_ICON[feature]
              return (
                <li
                  key={feature}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-[#0A0C08]/60 px-3 py-2.5 opacity-60"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-400">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="font-display flex-1 truncate text-xs font-medium text-zinc-300">
                    {FEATURE_LABEL[feature]}
                  </p>
                  <Lock className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                </li>
              )
            })}
          </ul>
        </div>
      ) : (
        <ul className="relative z-10 mt-4 flex flex-1 flex-col gap-2.5">
          {FEATURES.map((feature) => (
            <UsageRow
              key={feature}
              feature={feature}
              used={usage[feature] || 0}
              limit={limit}
              unlimited={isUnlimited}
            />
          ))}
        </ul>
      )}

      {/* Reset-time info dialog */}
      {mounted &&
        infoOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-info-title"
          >
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              onClick={() => setInfoOpen(false)}
              className="absolute inset-0 cursor-default bg-background/75 backdrop-blur-sm"
            />
            <div className="border-luxe surface-luxe relative z-10 w-full max-w-sm overflow-hidden rounded-3xl p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
              <span aria-hidden className="welcome-luxe-border rounded-3xl" />
              <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#CCFF00]/25 bg-[#0A0C08] text-[#CCFF00] shadow-[0_0_18px_rgba(204,255,0,0.12)]">
                <Clock className="h-7 w-7" />
              </span>
              <h2
                id="reset-info-title"
                className="font-display mt-4 text-lg font-medium tracking-tight text-white"
              >
                Resets daily at 6:00 AM
              </h2>
              <p className="font-display mt-2 text-pretty text-sm font-light leading-relaxed text-zinc-400">
                Your daily quota refreshes every morning after 6:00 AM Bangladesh
                Standard Time (UTC+06:00).
              </p>
              <button
                type="button"
                onClick={() => setInfoOpen(false)}
                className="btn-luxe font-display mt-6 flex h-11 w-full items-center justify-center text-sm"
              >
                OK
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}

function UsageRow({
  feature,
  used,
  limit,
  unlimited,
}: {
  feature: FeatureKey
  used: number
  limit: number | null
  unlimited: boolean
}) {
  const Icon = FEATURE_ICON[feature]
  const remaining =
    unlimited || limit === null ? null : Math.max(0, limit - used)
  const pct =
    unlimited || limit === null || limit === 0
      ? 100
      : Math.min(100, Math.round((used / limit) * 100))
  const depleted = remaining !== null && remaining <= 0

  return (
    <li
      data-testid={`usage-row-${feature}`}
      className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#0A0C08]/70 px-3 py-2.5 transition-colors hover:border-[#CCFF00]/25"
    >
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border',
          depleted
            ? 'border-rose-400/25 bg-rose-500/10 text-rose-300'
            : 'border-[#CCFF00]/25 bg-[#CCFF00]/[0.07] text-[#CCFF00]',
        )}
      >
        <Icon className="h-[1.05rem] w-[1.05rem]" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="font-display truncate text-xs font-medium text-zinc-200">
            {FEATURE_LABEL[feature]}
          </p>
          {unlimited ? (
            <InfinityIcon className="h-4 w-4 shrink-0 text-[#CCFF00]" />
          ) : (
            <span
              className={cn(
                'font-display shrink-0 text-xs font-bold tabular-nums',
                depleted ? 'text-rose-300' : 'text-[#CCFF00]',
              )}
            >
              {used}
              <span className="text-zinc-500">/{limit}</span>
            </span>
          )}
        </div>
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: depleted
                ? 'linear-gradient(90deg, rgba(220,60,110,0.7), rgb(244,114,140))'
                : 'linear-gradient(90deg, rgba(204,255,0,0.45), #CCFF00)',
            }}
          />
        </div>
      </div>
    </li>
  )
}
