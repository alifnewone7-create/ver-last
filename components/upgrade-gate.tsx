'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import {
  Lock,
  KeyRound,
  Headset,
  X,
  Gauge,
  Gem,
  Crown,
  Check,
  UserPlus,
  Wallet,
  ShieldCheck,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FEATURE_LABEL, type FeatureKey } from '@/lib/tiers'

type GateReason = 'locked' | 'limit'

type GatePayload = {
  reason: GateReason
  feature?: FeatureKey
  message?: string
}

type UpgradeGateContextValue = {
  /** Open the upgrade modal with a reason. */
  open: (payload: GatePayload) => void
}

const UpgradeGateContext = createContext<UpgradeGateContextValue | undefined>(
  undefined,
)

const FREE_STEPS = [
  {
    icon: UserPlus,
    title: 'Create Account',
    desc: 'Use our exclusive partner link to register your trading account.',
  },
  {
    icon: Wallet,
    title: 'Deposit Capital',
    desc: 'Minimum $60 for your trading balance to get started.',
  },
  {
    icon: ShieldCheck,
    title: 'Verify UID',
    desc: 'Send your UID to our support team for instant verification.',
  },
]

const LICENSE_PERKS = [
  'Skip broker registration entirely',
  'Direct, unrestricted access',
  'Lifetime full license, instant activation',
  'Priority support included',
]

export function UpgradeGateProvider({ children }: { children: ReactNode }) {
  const [payload, setPayload] = useState<GatePayload | null>(null)
  const [showPlans, setShowPlans] = useState(false)

  const open = useCallback((next: GatePayload) => {
    setShowPlans(false)
    setPayload(next)
  }, [])
  const close = useCallback(() => {
    setPayload(null)
    setShowPlans(false)
  }, [])

  const isLimit = payload?.reason === 'limit'
  const featureLabel = payload?.feature ? FEATURE_LABEL[payload.feature] : null

  return (
    <UpgradeGateContext.Provider value={{ open }}>
      {children}

      {payload && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="upgrade-title"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />

          {isLimit ? (
            <div className="border-luxe surface-luxe relative z-10 w-full max-w-sm overflow-hidden rounded-[28px] shadow-2xl shadow-primary/30">
              {/* ambient color grading */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
              <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/12 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-16 h-52 w-52 rounded-full bg-accent/12 blur-3xl" />

              {/* top bar keeps the close button safely inside the card */}
              <div className="relative z-30 flex justify-end px-4 pt-4">
                <button
                  type="button"
                  onClick={close}
                  className="btn-luxe-outline flex h-9 w-9 items-center justify-center rounded-xl"
                  aria-label="Close dialog"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="relative z-10 flex flex-col items-center px-6 pb-7 pt-1 text-center sm:px-8">
                {/* icon medallion */}
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/12 via-primary/10 to-accent/12 ring-1 ring-primary/40">
                  <div className="pointer-events-none absolute inset-0 rounded-full bg-primary/12 blur-xl" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-background/60 text-primary ring-1 ring-primary/30">
                    <Gauge className="h-7 w-7" />
                  </div>
                </div>

                <h2
                  id="upgrade-title"
                  className="mt-5 text-balance text-2xl font-bold tracking-tight sm:text-[1.7rem]"
                >
                  Daily limit reached
                </h2>

                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {`You've used all of your ${
                    featureLabel ?? 'tool'
                  } generations for today.`}
                </p>

                {/* reset time chip */}
                <div className="mt-5 flex w-full items-start gap-3 rounded-2xl border border-primary/25 bg-primary/[0.07] p-3.5 text-left">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl icon-chip">
                    <Clock className="h-4 w-4" />
                  </span>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Resets every morning after{' '}
                    <span className="font-semibold text-foreground">
                      6:00 AM
                    </span>{' '}
                    Bangladesh Standard Time{' '}
                    <span className="whitespace-nowrap">(UTC+06:00)</span>.
                  </p>
                </div>

                <Button
                  nativeButton={false}
                  render={
                    <a
                      href="https://t.me/Miraj_X_Trader_Official"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  className="btn-luxe mt-6 h-12 w-full gap-2 rounded-xl text-sm font-semibold sm:text-base"
                >
                  <Crown className="h-[18px] w-[18px]" />
                  I want to upgrade my account
                </Button>
              </div>
            </div>
          ) : !showPlans ? (
            <div className="border-luxe surface-luxe relative z-10 w-full max-w-md overflow-hidden rounded-3xl shadow-2xl shadow-primary/25">
              {/* subtle gold hairline at top */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

              {/* Header band */}
              <div className="relative overflow-hidden border-b border-border/60 px-5 pb-6 pt-5 sm:px-8 sm:pb-7 sm:pt-6">
                <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-primary/12 blur-3xl" />
                <div className="pointer-events-none absolute -left-10 -top-16 h-36 w-36 rounded-full bg-accent/12 blur-3xl" />

                <div className="relative flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl icon-chip shadow-lg shadow-primary/20 ring-1 ring-primary/30 sm:h-14 sm:w-14">
                      <Lock className="lock-anim h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <h2
                      id="upgrade-title"
                      className="min-w-0 text-balance text-lg font-bold leading-snug tracking-tight sm:text-2xl"
                    >
                      Unlock the full{' '}
                      <span className="text-shine">experience</span>
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={close}
                    className="btn-luxe-outline flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    aria-label="Close dialog"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="relative px-6 pb-6 pt-5 sm:px-8">
                <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                  {payload.message ??
                    `Your Free account can browse every page, but generating results with ${
                      featureLabel ?? 'the tools'
                    } is reserved for members. Choose a plan to start winning.`}
                </p>

                <ul className="mt-5 flex flex-col gap-3">
                  {[
                    'Unlimited AI signal generation',
                    'Priority support & instant activation',
                    'Full access to every premium tool',
                  ].map((perk) => (
                    <li key={perk} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full icon-chip">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-foreground/90">{perk}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-col gap-2.5">
                  <Button
                    onClick={() => setShowPlans(true)}
                    className="btn-luxe h-12 w-full gap-2 rounded-xl text-sm font-semibold sm:text-base"
                  >
                    <Gem className="h-[18px] w-[18px]" />
                    View plans
                  </Button>
                  <Button
                    variant="outline"
                    nativeButton={false}
                    render={
                      <a
                        href="https://t.me/Miraj_X_Trader_Official"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                    className="h-11 w-full gap-2 rounded-xl"
                  >
                    <Headset className="h-[18px] w-[18px]" />
                    Contact Admin
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative z-10 max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[28px] border border-white/[0.08] bg-[#060806] p-5 shadow-[0_12px_48px_rgba(0,0,0,0.55)] sm:p-8">
              <button
                type="button"
                onClick={close}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-black/40 text-zinc-400 transition-colors hover:text-white"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>

              {/* section header — same shape as homepage */}
              <div className="mx-auto max-w-2xl text-center">
                <span
                  className="font-display inline-flex max-w-full items-center justify-center gap-2 rounded-lg border border-[#CCFF00]/25 px-3 py-1.5 text-[0.625rem] uppercase leading-tight tracking-[0.16em] text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:rounded-xl sm:px-5 sm:py-2.5 sm:text-xs sm:tracking-[0.24em]"
                  style={{
                    backgroundImage:
                      'linear-gradient(135deg, rgba(204,255,0,0.18) 0%, rgba(204,255,0,0.06) 45%, rgba(255,255,255,0.02) 100%)',
                  }}
                >
                  <Crown className="h-3 w-3 text-[#CCFF00] sm:h-3.5 sm:w-3.5" />
                  Choose your access
                </span>
                <h2
                  id="upgrade-title"
                  className="font-display mt-5 text-balance text-2xl font-medium tracking-tight text-white sm:text-3xl md:text-4xl"
                >
                  Two ways to start with{' '}
                  <span className="text-[#CCFF00]">Vertex AI</span>
                </h2>
                <p className="font-display mx-auto mt-4 max-w-md text-pretty text-sm font-light text-zinc-400 sm:text-base">
                  Get free access through our partner broker, or buy a direct
                  license and skip the setup.
                </p>
              </div>

              <div className="mx-auto mt-8 grid max-w-5xl gap-5 lg:grid-cols-2 lg:gap-7">
                {/* ── free access ── */}
                <div className="relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[#070907]/80 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl tracking-tight text-white sm:text-2xl">
                      Free Access
                    </h3>
                    <div className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                      $0
                    </div>
                  </div>
                  <p className="font-display mt-3 text-sm font-light text-zinc-400">
                    Follow these 3 simple steps to unlock Vertex AI for free.
                  </p>

                  {/* vertical step timeline */}
                  <div className="relative mt-7 flex-1">
                    <div
                      aria-hidden="true"
                      className="absolute bottom-5 left-[19px] top-5 w-px"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(204,255,0,0.45), rgba(204,255,0,0.1))',
                      }}
                    />
                    <ol className="flex flex-col gap-6">
                      {FREE_STEPS.map((step, i) => (
                        <li key={step.title} className="relative flex gap-4">
                          <span className="font-display relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#CCFF00]/35 bg-[#0A0C08] text-xs font-semibold text-[#CCFF00] shadow-[0_0_16px_rgba(204,255,0,0.12)]">
                            {i + 1}
                          </span>
                          <div className="pt-0.5">
                            <div className="flex items-center gap-2">
                              <step.icon className="h-4 w-4 text-[#CCFF00]" />
                              <p className="font-display text-sm font-medium text-zinc-100">
                                {step.title}
                              </p>
                            </div>
                            <p className="font-display mt-1.5 text-sm font-light leading-relaxed text-zinc-500">
                              {step.desc}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="mt-8 flex flex-col gap-3">
                    <a
                      href="https://broker-qx.pro/sign-up/?lid=1020815"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-clay-plum font-display inline-flex h-12 w-full items-center justify-center gap-2 px-6 text-sm sm:text-base"
                    >
                      <UserPlus className="h-4 w-4" />
                      Create Quotex Account
                    </a>
                    <a
                      href="https://t.me/Miraj_X_Trader_Official"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-clay-dark font-display inline-flex h-12 w-full items-center justify-center gap-2 px-6 text-sm sm:text-base"
                    >
                      <Headset className="h-4 w-4 text-[#CCFF00]" />
                      Contact Admin
                    </a>
                  </div>
                </div>

                {/* ── buy license (premium) ── */}
                <div className="relative flex flex-col overflow-hidden rounded-3xl border border-[#CCFF00]/25 bg-[#090B06]/90 p-6 shadow-[0_12px_48px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-8">
                  <span aria-hidden="true" className="welcome-luxe-border rounded-3xl" />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-28 left-1/2 h-64 w-[30rem] -translate-x-1/2 rounded-full blur-[80px]"
                    style={{
                      background:
                        'radial-gradient(ellipse at center, rgba(204,255,0,0.2), transparent 70%)',
                    }}
                  />

                  <div className="relative">
                    <h3 className="font-display text-xl tracking-tight text-white sm:text-2xl">
                      Buy License
                    </h3>
                  </div>

                  <div className="relative mt-5 flex items-end gap-2">
                    <span className="font-display text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                      $50
                    </span>
                    <span className="font-display mb-2 text-sm text-zinc-500">
                      / Lifetime
                    </span>
                  </div>
                  <p className="font-display relative mt-3 text-sm font-light text-zinc-400">
                    Skip broker registration. Purchase a direct, unrestricted
                    1-month license immediately.
                  </p>

                  <div
                    aria-hidden="true"
                    className="relative mt-6 h-px w-full"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(204,255,0,0.35), transparent)',
                    }}
                  />

                  <ul className="relative mt-6 flex flex-1 flex-col gap-4">
                    {LICENSE_PERKS.map((perk) => (
                      <li key={perk} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#CCFF00] shadow-[0_0_10px_rgba(204,255,0,0.35)]">
                          <Check className="h-3 w-3 text-black" />
                        </span>
                        <span className="font-display text-sm font-light text-zinc-200">
                          {perk}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="https://t.me/Miraj_X_Trader_Official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-clay font-display relative mt-8 inline-flex h-12 w-full items-center justify-center gap-2 px-6 text-sm sm:text-base"
                  >
                    <KeyRound className="h-4 w-4" />
                    Purchase License
                  </a>
                  <p className="font-display relative mt-4 text-center text-xs text-zinc-600">
                    Instant activation · priority support included
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPlans(false)}
                className="font-display mx-auto mt-6 block text-xs font-medium text-zinc-500 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                Back
              </button>
            </div>
          )}
        </div>
      )}
    </UpgradeGateContext.Provider>
  )
}

export function useUpgradeGate() {
  const ctx = useContext(UpgradeGateContext)
  if (!ctx) {
    throw new Error('useUpgradeGate must be used within an UpgradeGateProvider')
  }
  return ctx
}
