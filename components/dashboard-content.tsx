'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  Gift,
  Rocket,
  Star,
  Crown,
  ShieldCheck,
  LayoutGrid,
  ScanLine,
  Radio,
  ArrowRight,
  Lock,
  type AppIcon as LucideIcon,
} from '@/components/icons'
import { TopNav } from '@/components/top-nav'
import { TradingChart } from '@/components/trading-chart'
import { ToolCards } from '@/components/tool-cards'
import { type UserProfile } from '@/components/auth-provider'
import { normalizeTier, type Tier } from '@/lib/tiers'
import { useUpgradeGate } from '@/components/upgrade-gate'

const TIER_ICON: Record<Tier, LucideIcon> = {
  free: Gift,
  basic: Rocket,
  standard: Star,
  premium: Crown,
  admin: ShieldCheck,
}

export function DashboardContent({ profile }: { profile: UserProfile }) {
  const firstName = profile.name.split(' ')[0] || 'Trader'
  const tier = normalizeTier(profile.plan)
  const TierIcon = TIER_ICON[tier]
  const { open } = useUpgradeGate()
  const isFree = tier === 'free'

  return (
    <main className="home-bg relative min-h-dvh">
      <TopNav />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 sm:gap-6 sm:px-6 sm:py-10 lg:py-12">
        {/* ── hero + usage row ── */}
        <div className="grid gap-5 sm:gap-6 lg:grid-cols-3">
          {/* hero card */}
          <section
            data-testid="dashboard-hero-card"
            className="border-luxe surface-luxe relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:col-span-2"
          >
            <span aria-hidden className="welcome-luxe-border rounded-3xl" />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 right-0 h-56 w-[26rem] rounded-full blur-[80px]"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(204,255,0,0.16), transparent 70%)',
              }}
            />

            <div className="relative z-10 flex h-full flex-col justify-between gap-7">
              <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
                {/* avatar */}
                <span className="relative h-24 w-24 shrink-0 sm:h-28 sm:w-28">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -inset-2 rounded-[1.5rem] bg-[#CCFF00]/10 blur-xl"
                  />
                  <span className="relative z-10 block h-full w-full overflow-hidden rounded-[1.3rem] ring-1 ring-[#CCFF00]/40">
                    <Image
                      src="/vertex-profile.png"
                      alt={`${firstName} profile`}
                      width={112}
                      height={112}
                      className="h-full w-full object-cover"
                      priority
                      unoptimized
                    />
                  </span>
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-display text-[0.65rem] uppercase tracking-[0.22em] text-zinc-500">
                    Welcome back
                  </p>
                  <div className="mt-1.5 flex flex-col items-center gap-2.5 sm:flex-row sm:items-center">
                    <h1 className="font-display truncate text-3xl font-medium tracking-tight text-white sm:text-4xl">
                      {profile.name}
                    </h1>
                    <span
                      data-testid="dashboard-plan-badge"
                      className="font-display inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#CCFF00]/35 bg-[#CCFF00]/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#CCFF00]"
                    >
                      <TierIcon className="h-3 w-3" />
                      {profile.plan}
                    </span>
                  </div>
                  <p className="font-display mx-auto mt-3 max-w-md text-pretty text-sm font-light leading-relaxed text-zinc-400 sm:mx-0">
                    Scan any OTC or real market chart in seconds and get precise, AI-powered signals with the perfect entry time.
                  </p>
                </div>
              </div>

              {/* quick actions */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/otc-chart-analyzer"
                  data-testid="dashboard-cta-analyze"
                  className="btn-luxe font-display inline-flex h-12 w-full items-center justify-center gap-2 px-6 text-sm sm:w-auto sm:flex-1 sm:text-base"
                >
                  <ScanLine className="h-4 w-4" />
                  Start Analyzing
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/live-signals"
                  data-testid="dashboard-cta-live"
                  className="btn-luxe-outline font-display inline-flex h-12 w-full items-center justify-center gap-2 px-6 text-sm sm:w-auto sm:flex-1 sm:text-base"
                >
                  <Radio className="h-4 w-4 text-[#CCFF00]" />
                  Live Signals
                </Link>
              </div>
            </div>
          </section>

          {/* daily usage */}
          <section
            data-testid="dashboard-usage-section"
            className="flex flex-col gap-4 lg:col-span-1"
          >
            <TradingChart />

            {isFree && (
              <button
                type="button"
                data-testid="dashboard-unlock-now-button"
                onClick={() => open({ reason: 'locked' })}
                className="group relative overflow-hidden rounded-2xl border border-[#CCFF00]/35 bg-gradient-to-b from-[#151808] via-[#0E1108] to-[#080A06] p-4 text-left transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[#CCFF00]/60 hover:shadow-[0_16px_44px_-18px_rgba(204,255,0,0.4)] sm:p-5"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#CCFF00]/70 to-transparent"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#CCFF00]/[0.1] blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                />
                <div className="relative z-10 flex items-center gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#CCFF00]/30 bg-[#0A0C08] text-[#CCFF00] shadow-[0_0_18px_rgba(204,255,0,0.15)] transition-transform duration-300 group-hover:scale-105">
                    <Lock className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[0.62rem] uppercase tracking-[0.22em] text-[#CCFF00]">
                      Free plan
                    </p>
                    <p className="font-display mt-0.5 truncate text-sm font-medium text-white sm:text-base">
                      Unlock Now
                    </p>
                    <p className="font-display mt-0.5 truncate text-[0.7rem] font-light text-zinc-400">
                      Get unlimited signals &amp; premium tools
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#CCFF00] transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </button>
            )}
          </section>
        </div>

        {/* ── trading tools ── */}
        <section
          data-testid="dashboard-tools-section"
          className="border-luxe surface-luxe relative overflow-hidden rounded-3xl p-5 sm:p-7"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full blur-3xl"
            style={{ background: 'rgba(204,255,0,0.07)' }}
          />

          <div className="relative z-10">
            <div className="flex items-start gap-3 sm:gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#CCFF00]/25 bg-[#0A0C08] text-[#CCFF00] shadow-[0_0_18px_rgba(204,255,0,0.1)]">
                <LayoutGrid className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-xl font-medium tracking-tight text-white sm:text-2xl">
                  Trading Tools
                </h2>
                <p className="font-display mt-0.5 text-sm font-light text-zinc-400">
                  AI-powered chart analysis, ready to use.
                </p>
              </div>
            </div>

            <div
              aria-hidden
              className="my-5 h-px w-full"
              style={{
                background:
                  'linear-gradient(90deg, rgba(204,255,0,0.3), rgba(255,255,255,0.06) 50%, transparent)',
              }}
            />

            <ToolCards />
          </div>
        </section>
      </div>
    </main>
  )
}
