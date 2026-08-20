'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  BrainCircuit,
  ScanEye,
  Waypoints,
  CircuitBoard,
  RadioTower,
  Crosshair,
  Bot,
  Gauge,
  PlugZap,
  ScanSearch,
  Rocket,
  Menu,
  X,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  Wallet,
  ShieldCheck,
  KeyRound,
  Headset,
  Check,
  AlertTriangle,
  Activity,
  Orbit,
  Antenna,
} from 'lucide-react'

/* ─────────────────────────── data ─────────────────────────── */

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Support', href: 'https://t.me/Miraj_X_Trader_Official', external: true },
]

const TICKER = [
  { pair: 'EUR/USD', change: '+0.42%', up: true },
  { pair: 'BTC/USDT', change: '+2.18%', up: true },
  { pair: 'GBP/JPY', change: '-0.31%', up: false },
  { pair: 'XAU/USD', change: '+0.87%', up: true },
  { pair: 'ETH/USDT', change: '-1.04%', up: false },
  { pair: 'USD/CAD', change: '+0.19%', up: true },
  { pair: 'AUD/USD', change: '-0.22%', up: false },
  { pair: 'SOL/USDT', change: '+3.65%', up: true },
]

const FEATURES = [
  {
    icon: BrainCircuit,
    title: 'Neural Signal Engine',
    desc: 'A deep-learning core trained on millions of candles generates each signal with institutional-grade context.',
  },
  {
    icon: ScanEye,
    title: 'Chart Vision AI',
    desc: 'Upload any chart screenshot — the vision model reads structure, momentum and volume in seconds.',
  },
  {
    icon: Waypoints,
    title: 'Smart Entry Routing',
    desc: 'Every signal ships with a precise entry window, expiry and direction so you never guess timing.',
  },
  {
    icon: CircuitBoard,
    title: 'Robotic Execution Logic',
    desc: 'Emotion-free machine logic filters weak setups and only surfaces the highest-probability trades.',
  },
  {
    icon: RadioTower,
    title: 'Live Market Telemetry',
    desc: 'Real-time streams across forex, crypto and OTC markets — scanned around the clock without pause.',
  },
  {
    icon: Crosshair,
    title: 'Precision Risk Guard',
    desc: 'Built-in money management keeps position sizing disciplined and protects your capital first.',
  },
]

const STATS = [
  { icon: Gauge, value: '98.6%', label: 'Signal accuracy' },
  { icon: Activity, value: '120+', label: 'Signals per day' },
  { icon: Orbit, value: '40+', label: 'Markets scanned' },
  { icon: Antenna, value: '24/7', label: 'Live telemetry' },
]

const STEPS = [
  {
    icon: PlugZap,
    step: '01',
    title: 'Connect your account',
    desc: 'Register in under a minute and link up through our partner broker — or activate a direct license.',
  },
  {
    icon: ScanSearch,
    step: '02',
    title: 'AI scans the markets',
    desc: 'The Vertex core sweeps 40+ pairs in real time, scoring every setup against its neural playbook.',
  },
  {
    icon: Rocket,
    step: '03',
    title: 'Trade the signals',
    desc: 'Receive crystal-clear BUY / SELL calls with entry, expiry and confidence — then execute.',
  },
]

const FREE_STEPS = [
  {
    icon: UserPlus,
    title: 'Create Account',
    desc: 'Use our exclusive partner link to register your trading account.',
  },
  {
    icon: Wallet,
    title: 'Deposit Capital',
    desc: 'Minimum $50 for your trading balance to get started.',
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
  '1-month full license, instant activation',
  'Priority support included',
]

const TERMINAL_SIGNALS = [
  { pair: 'EUR/USD', dir: 'BUY', conf: 96, up: true },
  { pair: 'BTC/USDT', dir: 'BUY', conf: 92, up: true },
  { pair: 'GBP/JPY', dir: 'SELL', conf: 89, up: false },
]

/* ─────────────────────────── navbar ─────────────────────────── */

function ClayNavbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="clay-card mx-auto flex h-16 max-w-6xl items-center justify-between rounded-[20px] px-4 sm:px-5">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="relative h-9 w-9 overflow-hidden rounded-xl ring-1 ring-white/10">
            <Image src="/vertex-logo.png" alt="Vertex AI logo" fill className="object-cover" sizes="36px" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Vertex <span className="text-primary">AI</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="rounded-xl px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link href="/login" className="btn-clay hidden h-11 items-center justify-center px-6 text-sm md:inline-flex">
            <Bot className="h-4 w-4" />
            Get Vertex AI
          </Link>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
            className="btn-clay-dark inline-flex h-10 w-10 items-center justify-center rounded-xl md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="clay-card mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-[20px] p-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-foreground/90 transition-colors hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
          <Link href="/login" onClick={() => setOpen(false)} className="btn-clay mt-2 inline-flex h-12 w-full items-center justify-center text-sm">
            <Bot className="h-4 w-4" />
            Get Vertex AI
          </Link>
        </div>
      )}
    </header>
  )
}

/* ─────────────────────────── hero terminal ─────────────────────────── */

/* candles: [open, close, high, low] in a 0-100 price space */
const CANDLES: [number, number, number, number][] = [
  [38, 48, 54, 33], [46, 42, 51, 38], [43, 51, 57, 40], [50, 39, 53, 34],
  [40, 45, 50, 36], [45, 62, 68, 43], [61, 57, 66, 52], [56, 47, 60, 44],
  [48, 55, 61, 45], [54, 44, 58, 40], [45, 39, 49, 34], [40, 47, 52, 37],
  [46, 41, 50, 37], [42, 52, 58, 39], [51, 46, 55, 42], [47, 56, 62, 44],
  [55, 61, 67, 51], [60, 72, 78, 57], [71, 66, 76, 62], [67, 74, 80, 64],
]

function CandleChart() {
  const W = 520
  const H = 230
  const padX = 26
  const step = (W - padX * 2) / (CANDLES.length - 1)
  const y = (v: number) => H - 30 - ((v - 28) / 56) * (H - 96)
  const x = (i: number) => padX + i * step
  const path = CANDLES.map((c, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y((c[0] + c[1]) / 2).toFixed(1)}`).join(' ')
  const signalIdx = 5

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-full w-full" role="img" aria-label="AI detected candlestick pattern with a buy signal">
      <defs>
        <linearGradient id="vx-up" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.9 0.24 128)" />
          <stop offset="100%" stopColor="oklch(0.7 0.22 132)" />
        </linearGradient>
        <linearGradient id="vx-dn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.72 0.21 22)" />
          <stop offset="100%" stopColor="oklch(0.56 0.2 22)" />
        </linearGradient>
      </defs>

      {/* trend spine */}
      <path
        d={path}
        fill="none"
        stroke="oklch(0.85 0.2 128 / 0.5)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="6 7"
        className="spine-flow"
        vectorEffect="non-scaling-stroke"
      />

      {CANDLES.map((c, i) => {
        const [o, cl, h, l] = c
        const up = cl >= o
        const bodyTop = y(Math.max(o, cl))
        const bodyH = Math.max(6, y(Math.min(o, cl)) - bodyTop)
        return (
          <g key={i} className="candle-in" style={{ animationDelay: `${i * 55}ms` }}>
            <line
              x1={x(i)}
              x2={x(i)}
              y1={y(h)}
              y2={y(l)}
              stroke={up ? 'oklch(0.8 0.2 128)' : 'oklch(0.64 0.2 22)'}
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <rect
              x={x(i) - 5.5}
              y={bodyTop}
              width="11"
              height={bodyH}
              rx="2"
              fill={up ? 'url(#vx-up)' : 'url(#vx-dn)'}
            />
          </g>
        )
      })}

      {/* buy marker */}
      <g transform={`translate(${x(signalIdx)}, ${y(CANDLES[signalIdx][2]) - 22})`}>
        <g className="buy-pop">
          <rect x="-31" y="-13" width="62" height="26" rx="13" fill="oklch(0.15 0.03 130)" stroke="oklch(0.85 0.22 128 / 0.55)" vectorEffect="non-scaling-stroke" />
          <circle cx="-19" cy="0" r="3.6" fill="oklch(0.88 0.24 128)" />
          <text x="-11" y="4.5" fill="oklch(0.96 0.02 128)" fontSize="11" fontWeight="800" letterSpacing="0.6">BUY</text>
        </g>
      </g>
    </svg>
  )
}

function HeroTerminal() {
  return (
    <div className="clay-card relative min-w-0 p-4 sm:p-6" data-testid="hero-neural-core-card">
      {/* chart panel */}
      <div className="clay-inset overflow-hidden rounded-[22px] p-3 sm:p-4" data-testid="hero-candle-chart">
        <div className="h-40 w-full sm:h-48">
          <CandleChart />
        </div>
      </div>

      {/* footer strip */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <CircuitBoard className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs text-muted-foreground sm:text-sm">Powered by Vertex AI real-time algorithm</span>
      </div>
    </div>
  )
}

/* ─────────────────────────── sections ─────────────────────────── */

function ClayHero() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 pb-14 pt-10 sm:px-6 sm:pt-14 lg:pb-20">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* copy */}
        <div className="text-center lg:text-left">
          <h1 className="text-balance text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
            Trade with Intelligence.{' '}
            <span className="text-primary">Win with Vertex AI.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
            An advanced trading intelligence platform that uncovers
            high-probability opportunities in real time — empowering faster,
            smarter, more confident trades.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3.5 sm:flex-row sm:justify-center lg:justify-start">
            <Link href="/login" className="btn-clay inline-flex h-13 w-full items-center justify-center px-8 text-base sm:h-12 sm:w-auto">
              <BrainCircuit className="h-5 w-5" />
              Get Vertex AI
            </Link>
            <a href="#pricing" className="btn-clay-dark inline-flex h-13 w-full items-center justify-center px-8 text-base sm:h-12 sm:w-auto">
              <KeyRound className="h-[18px] w-[18px]" />
              View Pricing
            </a>
          </div>
        </div>

        {/* terminal */}
        <HeroTerminal />
      </div>
    </section>
  )
}

function ClayFeatures() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="clay-chip gap-2 rounded-full px-4 py-2 text-xs font-semibold text-muted-foreground">
          <CircuitBoard className="h-3.5 w-3.5 text-primary" />
          Built for serious traders
        </span>
        <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
          Everything you need to trade with{' '}
          <span className="text-primary">machine precision</span>
        </h2>
        <p className="mt-3 text-pretty text-muted-foreground">
          A complete algorithmic toolkit engineered for accuracy, speed and consistency.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {FEATURES.map((f) => (
          <div key={f.title} className="clay-card p-6 transition-transform duration-300 hover:-translate-y-1.5">
            <div className="clay-chip-lime h-13 w-13 rounded-[16px] p-3.5">
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-bold tracking-tight">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function ClaySteps() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-6 lg:pb-24">
      <div className="clay-card p-6 sm:p-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="clay-chip gap-2 rounded-full px-4 py-2 text-xs font-semibold text-muted-foreground">
            <Waypoints className="h-3.5 w-3.5 text-primary" />
            How it works
          </span>
          <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
            From zero to first signal in <span className="text-primary">minutes</span>
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.step} className="clay-inset relative p-6">
              <span className="mono-label absolute right-5 top-5 text-primary">{s.step}</span>
              <div className="clay-chip h-12 w-12 rounded-[14px] p-3">
                <s.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-bold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ClayPricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-6 lg:pb-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="clay-chip gap-2 rounded-full px-4 py-2 text-xs font-semibold text-muted-foreground">
          <KeyRound className="h-3.5 w-3.5 text-primary" />
          Choose your access
        </span>
        <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
          Two ways to start with <span className="text-primary">Vertex AI</span>
        </h2>
        <p className="mt-3 text-pretty text-muted-foreground">
          Get free access through our partner broker, or buy a direct license and skip the setup.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Free access */}
        <div className="clay-card flex flex-col p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold tracking-tight">Free Access</h3>
            <span className="clay-chip rounded-full px-3.5 py-1.5 text-xs font-bold text-primary">
              $0 / partner
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Follow these 3 simple steps to unlock Vertex AI for free.
          </p>

          <ol className="mt-6 flex flex-1 flex-col gap-3.5">
            {FREE_STEPS.map((step, i) => (
              <li key={step.title} className="clay-inset flex gap-4 p-4">
                <span className="clay-chip-lime h-10 w-10 shrink-0 rounded-[12px] text-sm font-extrabold">
                  {i + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <step.icon className="h-4 w-4 text-primary" />
                    <p className="font-bold leading-tight">{step.title}</p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-6 flex flex-col gap-3">
            <a
              href="https://broker-qx.pro/sign-up/?lid=1020815"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-clay-dark inline-flex h-12 w-full items-center justify-center text-sm sm:text-base"
            >
              <UserPlus className="h-[18px] w-[18px]" />
              Create Quotex Account
            </a>
            <a
              href="https://t.me/Miraj_X_Trader_Official"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-clay-dark inline-flex h-12 w-full items-center justify-center text-sm sm:text-base"
            >
              <Headset className="h-[18px] w-[18px] text-primary" />
              Contact Admin
            </a>
          </div>
        </div>

        {/* Buy license */}
        <div className="clay-card relative flex flex-col p-6 ring-2 ring-primary/50 sm:p-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold tracking-tight">Buy License</h3>
            <span className="clay-chip-lime rounded-full px-3.5 py-1.5 text-xs font-extrabold">
              Direct access
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Skip broker registration. Purchase a direct, unrestricted 1-month license immediately.
          </p>

          <div className="clay-inset mt-6 flex items-end gap-1.5 px-5 py-4">
            <span className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">$99</span>
            <span className="mb-1.5 text-sm text-muted-foreground">/ month</span>
          </div>

          <ul className="mt-6 flex flex-1 flex-col gap-3">
            {LICENSE_PERKS.map((perk) => (
              <li key={perk} className="flex items-start gap-3 text-sm">
                <span className="clay-chip-lime mt-0.5 h-5.5 w-5.5 shrink-0 rounded-[8px]">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-foreground/90">{perk}</span>
              </li>
            ))}
          </ul>

          <a
            href="https://t.me/Miraj_X_Trader_Official"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-clay mt-6 inline-flex h-12 w-full items-center justify-center text-base"
          >
            <KeyRound className="h-[18px] w-[18px]" />
            Purchase License
          </a>
        </div>
      </div>
    </section>
  )
}

function ClayCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:pb-24">
      <div className="clay-lime-panel relative overflow-hidden p-8 text-center sm:p-12">
        <div className="clay-float mx-auto inline-flex h-16 w-16 items-center justify-center rounded-[20px] bg-black/10 shadow-[inset_0_2px_4px_rgb(0_0_0/0.25)]">
          <Bot className="h-8 w-8" />
        </div>
        <h2 className="mt-5 text-balance text-2xl font-extrabold tracking-tight sm:text-4xl">
          Start your trading career with Vertex AI
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-sm font-medium opacity-80 sm:text-base">
          Join thousands of traders using automated, data-driven signals to trade with
          confidence — every single day.
        </p>
        <Link
          href="/registration"
          className="btn-clay-dark mt-8 inline-flex h-12 items-center justify-center px-8 text-base"
        >
          <Rocket className="h-[18px] w-[18px] text-primary" />
          Create free account
        </Link>
      </div>
    </section>
  )
}

function ClayFooter() {
  return (
    <footer id="support" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-10 sm:px-6">
      <div className="clay-card p-6 sm:p-8">
        <div className="flex flex-col items-center gap-5 text-center md:flex-row md:justify-between md:text-left">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="relative h-9 w-9 overflow-hidden rounded-xl ring-1 ring-white/10">
              <Image src="/vertex-logo.png" alt="Vertex AI logo" fill className="object-cover" sizes="36px" />
            </span>
            <span className="text-lg font-bold tracking-tight">
              Vertex <span className="text-primary">AI</span>
            </span>
          </a>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link
              href="/privacy"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <a
              href="https://t.me/Miraj_X_Trader_Official"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Support
            </a>
          </nav>
        </div>

        <div className="clay-inset mt-6 flex gap-3 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-[oklch(0.72_0.19_25)]" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Trading Risk Disclaimer:</span>{' '}
            Trading financial instruments carries a high level of risk and may not be suitable
            for all investors. The high degree of leverage can work against you as well as for
            you. Past performance of Vertex AI is not indicative of future results. You should
            never trade with money you cannot afford to lose. Vertex AI provides tools and
            signals for informational purposes only and does not constitute financial advice.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Vertex AI. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

/* ─────────────────────────── page ─────────────────────────── */

export function ClayLanding() {
  return (
    <div id="top" className="relative min-h-dvh">
      <ClayNavbar />
      <main>
        <ClayHero />
        <ClayFeatures />
        <ClaySteps />
        <ClayPricing />
        <ClayCta />
      </main>
      <ClayFooter />
    </div>
  )
}
