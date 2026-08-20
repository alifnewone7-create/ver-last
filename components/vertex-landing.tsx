'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  BrainCircuit,
  ScanEye,
  Waypoints,
  CircuitBoard,
  RadioTower,
  Crosshair,
  Menu,
  X,
  UserPlus,
  Wallet,
  ShieldCheck,
  KeyRound,
  Headset,
  Check,
  AlertTriangle,
  PlugZap,
  ScanSearch,
  Rocket,
  ArrowRight,
  Radar,
} from 'lucide-react'

const LIME = '#CCFF00'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Support', href: 'https://t.me/Miraj_X_Trader_Official', external: true },
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
  { icon: UserPlus, title: 'Create Account', desc: 'Use our exclusive partner link to register your trading account.' },
  { icon: Wallet, title: 'Deposit Capital', desc: 'Minimum $60 for your trading balance to get started.' },
  { icon: ShieldCheck, title: 'Verify UID', desc: 'Send your UID to our support team for instant verification.' },
]

const LICENSE_PERKS = [
  'Skip broker registration entirely',
  'Direct, unrestricted access',
  'Lifetime full license, instant activation',
  'Priority support included',
]

const BTN_PRIMARY =
  'btn-clay font-display inline-flex h-12 items-center justify-center gap-2 px-8 text-sm sm:text-base'
const BTN_SECONDARY =
  'btn-clay-dark font-display inline-flex h-12 items-center justify-center gap-2 px-8 text-sm sm:text-base'

/* ── section label ── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-display inline-flex max-w-full items-center justify-center gap-2 rounded-lg border border-[#CCFF00]/25 px-3 py-1.5 text-[0.625rem] uppercase leading-tight tracking-[0.16em] text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:rounded-xl sm:px-5 sm:py-2.5 sm:text-xs sm:tracking-[0.24em]"
      style={{
        backgroundImage:
          'linear-gradient(135deg, rgba(204,255,0,0.18) 0%, rgba(204,255,0,0.06) 45%, rgba(255,255,255,0.02) 100%)',
      }}
    >
      {children}
    </span>
  )
}

/* ── section heading block ── */
function SectionHead({
  label,
  title,
  sub,
}: {
  label: string
  title: React.ReactNode
  sub?: string
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Label>{label}</Label>
      <h2 className="font-display mt-5 text-balance text-3xl font-medium tracking-tight text-white md:text-4xl">
        {title}
      </h2>
      {sub && (
        <p className="font-display mt-4 text-pretty text-base font-light text-zinc-400">{sub}</p>
      )}
    </div>
  )
}

/* ── trade vision (hero chart) ── */
const CANDLES: [number, number, number, number][] = [
  [38, 48, 54, 33], [46, 42, 51, 38], [43, 51, 57, 40], [50, 39, 53, 34],
  [40, 45, 50, 36], [45, 62, 68, 43], [61, 57, 66, 52], [56, 47, 60, 44],
  [48, 55, 61, 45], [54, 44, 58, 40], [45, 39, 49, 34], [40, 47, 52, 37],
  [46, 41, 50, 37], [42, 52, 58, 39], [51, 46, 55, 42], [47, 56, 62, 44],
  [55, 61, 67, 51], [60, 72, 78, 57], [71, 66, 76, 62], [67, 74, 80, 64],
]

function smoothPath(pts: [number, number][]) {
  let d = `M${pts[0][0]},${pts[0][1]}`
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2
    const my = (pts[i][1] + pts[i + 1][1]) / 2
    d += ` Q${pts[i][0]},${pts[i][1]} ${mx},${my}`
  }
  const last = pts[pts.length - 1]
  d += ` L${last[0]},${last[1]}`
  return d
}

function TradeVision() {
  const W = 900
  const H = 260
  const padX = 34
  const step = (W - padX * 2) / (CANDLES.length - 1)
  const x = (i: number) => padX + i * step
  const y = (v: number) => H - 28 - ((v - 28) / 56) * (H - 88)
  const mids: [number, number][] = CANDLES.map((c, i) => [x(i), y((c[0] + c[1]) / 2)])
  const line = smoothPath(mids)
  const area = `${line} L${mids[mids.length - 1][0]},${H} L${mids[0][0]},${H} Z`
  const signalIdx = 5
  const tip: [number, number] = [x(CANDLES.length - 1), y((CANDLES[CANDLES.length - 1][0] + CANDLES[CANDLES.length - 1][1]) / 2)]

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-full w-full"
      role="img"
      aria-label="Vertex AI live candlestick analysis with a buy signal"
    >
      <defs>
        <linearGradient id="tv-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(204,255,0,0.16)" />
          <stop offset="60%" stopColor="rgba(204,255,0,0.04)" />
          <stop offset="100%" stopColor="rgba(204,255,0,0)" />
        </linearGradient>
        <linearGradient id="tv-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8FBF00" />
          <stop offset="70%" stopColor="#CCFF00" />
          <stop offset="100%" stopColor="#EDFFB0" />
        </linearGradient>
        <linearGradient id="vx-up" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DBFF4D" />
          <stop offset="100%" stopColor="#9ACC00" />
        </linearGradient>
        <linearGradient id="vx-dn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5A6B63" />
          <stop offset="100%" stopColor="#39433D" />
        </linearGradient>
      </defs>

      {/* horizontal grid */}
      {[52, 104, 156, 208].map((gy) => (
        <line key={gy} x1="0" x2={W} y1={gy} y2={gy} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 9" />
      ))}

      {/* area fill */}
      <path d={area} fill="url(#tv-fill)" className="tv-fade-in" />

      {/* candles */}
      {CANDLES.map((c, i) => {
        const [o, cl, h, l] = c
        const up = cl >= o
        const bodyTop = y(Math.max(o, cl))
        const bodyH = Math.max(6, y(Math.min(o, cl)) - bodyTop)
        return (
          <g key={i} className="candle-in" style={{ animationDelay: `${i * 45}ms` }}>
            <line
              x1={x(i)}
              x2={x(i)}
              y1={y(h)}
              y2={y(l)}
              stroke={up ? '#B8E600' : '#4C5952'}
              strokeWidth="1.4"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <rect x={x(i) - 6} y={bodyTop} width="12" height={bodyH} rx="2" fill={up ? 'url(#vx-up)' : 'url(#vx-dn)'} />
          </g>
        )
      })}

      {/* glowing trend line through candle midpoints */}
      <path
        d={line}
        fill="none"
        stroke="url(#tv-line)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.75"
        className="tv-draw"
        style={{ filter: 'drop-shadow(0 0 6px rgba(204,255,0,0.4))' }}
      />

      {/* entry marker on signal candle */}
      <g className="tv-fade-in" style={{ animationDelay: '1.4s' }}>
        <line
          x1={x(signalIdx)}
          x2={x(signalIdx)}
          y1={y(CANDLES[signalIdx][2])}
          y2={H - 6}
          stroke="rgba(204,255,0,0.3)"
          strokeDasharray="4 6"
        />
      </g>

      {/* BUY chip */}
      <g transform={`translate(${x(signalIdx)}, ${y(CANDLES[signalIdx][2]) - 26})`}>
        <g className="buy-pop">
          <rect x="-44" y="-15" width="88" height="30" rx="15" fill="rgba(4,6,4,0.92)" stroke="rgba(204,255,0,0.55)" />
          <circle cx="-28" cy="0" r="3.4" fill={LIME} />
          <text x="-18" y="4.5" fill="#F4FFDA" fontSize="12" fontWeight="700" letterSpacing="0.8">
            BUY 96%
          </text>
        </g>
      </g>

      {/* live tip pulse */}
      <g className="tv-fade-in" style={{ animationDelay: '2s' }}>
        <circle cx={tip[0]} cy={tip[1]} r="4.5" fill={LIME} />
        <circle cx={tip[0]} cy={tip[1]} r="4.5" fill="none" stroke={LIME} className="tv-ping" />
      </g>
    </svg>
  )
}

function HeroTerminal() {
  return (
    <div className="hero-float overflow-hidden rounded-2xl border border-white/[0.08] bg-[#050705]/90 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl">
      {/* terminal chrome bar */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#CCFF00]/60" />
          </span>
          <span className="font-display hidden text-[0.65rem] uppercase tracking-[0.22em] text-zinc-500 sm:block">
            Vertex Terminal
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-display inline-flex items-center gap-1.5 rounded-md border border-[#CCFF00]/30 bg-[#CCFF00]/10 px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[#CCFF00] sm:text-[0.65rem]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#CCFF00]/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#CCFF00]" />
            </span>
            Live
          </span>
        </div>
      </div>

      {/* chart */}
      <div className="relative p-3 sm:p-5" data-testid="hero-candle-chart">
        <div className="aspect-[900/260] w-full">
          <TradeVision />
        </div>
      </div>

      <p className="font-display flex items-center justify-center gap-2 border-t border-white/[0.06] py-3.5 text-xs text-zinc-500 sm:text-sm">
        <CircuitBoard className="h-3.5 w-3.5 text-[#CCFF00]" />
        Powered by Vertex AI real-time algorithm
      </p>
    </div>
  )
}

/* ── navbar ── */
function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="clay-card mx-auto flex h-16 max-w-6xl items-center justify-between rounded-[20px] px-4 sm:px-5">
        <a href="#top" className="flex items-center gap-3" data-testid="nav-logo-link">
          <span className="relative h-9 w-9 overflow-hidden rounded-xl ring-1 ring-white/10">
            <Image src="/vertex-logo.png" alt="Vertex AI logo" fill className="object-cover" sizes="36px" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-white">
            Vertex <span className="text-[#CCFF00]">AI</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              className="font-display rounded-xl px-3.5 py-2 text-sm text-zinc-400 transition-colors duration-200 hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="hidden md:block">
            <Link
              href="/login"
              data-testid="nav-get-started-button"
              className={`${BTN_PRIMARY} !h-11 !px-6 !text-sm`}
            >
              Get Vertex AI
            </Link>
          </div>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
            data-testid="nav-mobile-toggle"
            className="btn-clay-dark inline-flex h-10 w-10 items-center justify-center rounded-xl text-white md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          className="clay-card mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-[20px] p-3 md:hidden"
          data-testid="nav-mobile-menu"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              onClick={() => setOpen(false)}
              className="font-display rounded-xl px-4 py-3 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            data-testid="nav-mobile-cta"
            className={`${BTN_PRIMARY} mt-2 w-full`}
          >
            Get Vertex AI
          </Link>
        </div>
      )}
    </header>
  )
}

/* ── hero ── */
function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-8 pt-10 sm:px-6 lg:pb-10 lg:pt-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[36rem] w-[72rem] -translate-x-1/2 rounded-full opacity-70 blur-[120px]"
        style={{ background: 'radial-gradient(ellipse at center, rgba(204,255,0,0.16), transparent 65%)' }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="reveal-up mb-6 flex justify-center">
          <span
            data-testid="hero-badge"
            className="font-display inline-flex items-center gap-2 rounded-xl border border-[#CCFF00]/25 px-4 py-2 text-[0.65rem] uppercase tracking-[0.2em] text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_20px_rgba(204,255,0,0.08)] backdrop-blur-md sm:text-xs"
            style={{
              backgroundImage:
                'linear-gradient(135deg, rgba(204,255,0,0.16) 0%, rgba(204,255,0,0.05) 45%, rgba(255,255,255,0.02) 100%)',
            }}
          >
            <Radar className="h-3.5 w-3.5 animate-[spin_5s_linear_infinite] text-[#CCFF00]" />
            AI-Powered Trading Signals
          </span>
        </div>

        <h1
          className="font-display reveal-up text-balance text-4xl leading-[1.05] tracking-tight md:text-5xl lg:text-7xl"
          data-testid="hero-heading"
        >
          <span className="font-light text-white">Trade with Intelligence.</span>{' '}
          <span className="font-semibold text-[#CCFF00]">Win with Vertex AI.</span>
        </h1>

        <p
          className="font-display reveal-up mx-auto mt-7 max-w-2xl text-pretty text-base font-light leading-relaxed text-zinc-400 sm:text-lg"
          style={{ animationDelay: '120ms' }}
        >
          An advanced trading intelligence platform that uncovers high-probability opportunities
          in real time — empowering faster, smarter, more confident trades.
        </p>

        <div
          className="reveal-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          style={{ animationDelay: '220ms' }}
        >
          <Link href="/login" data-testid="hero-cta-button" className={`${BTN_PRIMARY} w-full sm:w-auto`}>
            Get Vertex AI
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a href="#pricing" data-testid="hero-pricing-button" className={`${BTN_SECONDARY} w-full sm:w-auto`}>
            <KeyRound className="h-4 w-4 text-[#CCFF00]" />
            View Pricing
          </a>
        </div>
      </div>

      <div
        className="reveal-up relative mx-auto mt-16 max-w-5xl lg:mt-20"
        style={{ animationDelay: '320ms' }}
        data-testid="hero-neural-core-card"
      >
        <HeroTerminal />

        <div
          aria-hidden="true"
          className="mt-8 h-px w-full lg:mt-10"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(204,255,0,0.35) 50%, transparent)',
          }}
        />
      </div>
    </section>
  )
}

/* ── feature card ── */
function FeatureCard({
  f,
  className = '',
  horizontal = false,
}: {
  f: (typeof FEATURES)[number]
  className?: string
  horizontal?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      data-testid={`feature-card-${f.title.toLowerCase().replace(/\s+/g, '-')}`}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#070907]/70 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#CCFF00]/40 hover:shadow-[0_16px_48px_rgba(0,0,0,0.55),0_0_32px_rgba(204,255,0,0.07)] ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(204,255,0,0.09), transparent 70%)',
        }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px opacity-100 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(204,255,0,0.7) 50%, transparent)',
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-1/2 block -translate-y-1/2"
      >
        <span className="block h-52 w-52 rounded-full border border-[#CCFF00]/[0.07]" />
        <span className="absolute inset-6 rounded-full border border-[#CCFF00]/[0.1]" />
        <span className="absolute inset-12 rounded-full border border-[#CCFF00]/[0.14]" />
        <span className="absolute inset-[76px] rounded-full bg-[#CCFF00]/[0.06] blur-[2px]" />
      </span>

      <div className={`relative flex h-full p-7 sm:p-8 ${horizontal ? 'flex-col gap-5 sm:flex-row sm:items-center sm:gap-8' : 'flex-col'}`}>
        <div className={`flex items-center gap-4 ${horizontal ? 'sm:shrink-0' : ''}`}>
          <div
            className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#CCFF00]/30 shadow-[0_0_18px_rgba(204,255,0,0.12),inset_0_1px_0_rgba(255,255,255,0.1)] transition-shadow duration-300 group-hover:shadow-[0_0_26px_rgba(204,255,0,0.28),inset_0_1px_0_rgba(255,255,255,0.12)]"
            style={{
              background:
                'linear-gradient(135deg, rgba(204,255,0,0.22) 0%, rgba(204,255,0,0.06) 60%, rgba(255,255,255,0.02) 100%)',
            }}
          >
            <f.icon className="h-5 w-5 text-[#CCFF00]" />
            <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#CCFF00]/50 opacity-100 lg:opacity-0 lg:group-hover:opacity-100" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full border border-black/40 bg-[#CCFF00] opacity-100 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100" />
            </span>
          </div>
          <h3 className="font-display text-xl tracking-tight text-zinc-100 transition-colors duration-300 group-hover:text-white">
            {f.title}
          </h3>
        </div>

        <p className={`font-display text-sm font-light leading-relaxed text-zinc-400 ${horizontal ? 'sm:mt-0 sm:max-w-xl' : 'mt-5'}`}>
          {f.desc}
        </p>
      </div>
    </div>
  )
}

/* ── features (bento) ── */
function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6 lg:py-16">
      <SectionHead
        label="Built for serious traders"
        title={
          <>
            Everything you need to trade with <span className="text-[#CCFF00]">machine precision</span>
          </>
        }
        sub="A complete algorithmic toolkit engineered for accuracy, speed and consistency."
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-12 lg:gap-6">
        <FeatureCard f={FEATURES[0]} className="lg:col-span-7" />
        <FeatureCard f={FEATURES[1]} className="lg:col-span-5" />
        <FeatureCard f={FEATURES[2]} className="lg:col-span-4" />
        <FeatureCard f={FEATURES[3]} className="lg:col-span-4" />
        <FeatureCard f={FEATURES[4]} className="lg:col-span-4" />
        <FeatureCard f={FEATURES[5]} className="lg:col-span-12" horizontal />
      </div>
    </section>
  )
}

/* ── how it works (timeline) ── */
function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6 lg:py-16">
      <SectionHead
        label="How it works"
        title={
          <>
            From zero to first signal in <span className="text-[#CCFF00]">minutes</span>
          </>
        }
      />

      <div className="relative mt-14">
        {/* connecting line — desktop horizontal */}
        <div
          aria-hidden="true"
          className="absolute left-[16.66%] right-[16.66%] top-7 hidden h-px md:block"
          style={{
            background:
              'linear-gradient(90deg, rgba(204,255,0,0.5), rgba(204,255,0,0.15) 50%, rgba(204,255,0,0.5))',
          }}
        />
        {/* connecting line — mobile vertical */}
        <div
          aria-hidden="true"
          className="absolute bottom-10 left-7 top-10 w-px md:hidden"
          style={{
            background:
              'linear-gradient(180deg, rgba(204,255,0,0.5), rgba(204,255,0,0.12) 50%, rgba(204,255,0,0.5))',
          }}
        />

        <div className="grid gap-10 md:grid-cols-3 md:gap-6">
          {STEPS.map((s) => (
            <div key={s.step} data-testid={`step-card-${s.step}`} className="relative flex gap-5 md:flex-col md:items-center md:text-center">
              <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#CCFF00]/40 bg-[#0A0C08] shadow-[0_0_24px_rgba(204,255,0,0.15)]">
                <s.icon className="h-5 w-5 text-[#CCFF00]" />
                <span className="font-display absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#CCFF00] text-[0.6rem] font-bold text-black shadow-[0_2px_8px_rgba(204,255,0,0.4)]">
                  {s.step.slice(1)}
                </span>
              </div>
              <div className="md:mt-5">
                <h3 className="font-display text-lg tracking-tight text-zinc-100 sm:text-xl">{s.title}</h3>
                <p className="font-display mt-2 max-w-sm text-sm font-light leading-relaxed text-zinc-400 md:mx-auto">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── pricing ── */
function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6 lg:py-16">
      <SectionHead
        label="Choose your access"
        title={
          <>
            Two ways to start with <span className="text-[#CCFF00]">Vertex AI</span>
          </>
        }
        sub="Get free access through our partner broker, or buy a direct license and skip the setup."
      />

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-2 lg:gap-8">
        {/* ── free access ── */}
        <div
          className="relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[#070907]/80 p-7 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-9"
          data-testid="pricing-free-card"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-2xl tracking-tight text-white">Free Access</h3>
            <div className="font-display text-4xl font-semibold tracking-tight text-white">$0</div>
          </div>
          <p className="font-display mt-3 text-sm font-light text-zinc-400">
            Follow these 3 simple steps to unlock Vertex AI for free.
          </p>

          {/* vertical step timeline */}
          <div className="relative mt-8 flex-1">
            <div
              aria-hidden="true"
              className="absolute bottom-5 left-[19px] top-5 w-px"
              style={{
                background:
                  'linear-gradient(180deg, rgba(204,255,0,0.45), rgba(204,255,0,0.1))',
              }}
            />
            <ol className="flex flex-col gap-7">
              {FREE_STEPS.map((step, i) => (
                <li key={step.title} className="relative flex gap-5">
                  <span className="font-display relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#CCFF00]/35 bg-[#0A0C08] text-xs font-semibold text-[#CCFF00] shadow-[0_0_16px_rgba(204,255,0,0.12)]">
                    {i + 1}
                  </span>
                  <div className="pt-0.5">
                    <div className="flex items-center gap-2">
                      <step.icon className="h-4 w-4 text-[#CCFF00]" />
                      <p className="font-display text-sm font-medium text-zinc-100">{step.title}</p>
                    </div>
                    <p className="font-display mt-1.5 text-sm font-light leading-relaxed text-zinc-500">
                      {step.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-9 flex flex-col gap-3">
            <a
              href="https://broker-qx.pro/sign-up/?lid=1020815"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="pricing-quotex-button"
              className="btn-clay-plum font-display inline-flex h-12 w-full items-center justify-center gap-2 px-8 text-sm sm:text-base"
            >
              <UserPlus className="h-4 w-4" />
              Create Quotex Account
            </a>
            <a
              href="https://t.me/Miraj_X_Trader_Official"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="pricing-contact-admin-button"
              className={`${BTN_SECONDARY} w-full`}
            >
              <Headset className="h-4 w-4 text-[#CCFF00]" />
              Contact Admin
            </a>
          </div>
        </div>

        {/* ── buy license (premium) ── */}
        <div
          className="relative flex flex-col overflow-hidden rounded-3xl border border-[#CCFF00]/25 bg-[#090B06]/90 p-7 shadow-[0_12px_48px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-9"
          data-testid="pricing-license-card"
        >
          {/* rotating tracing beam border */}
          <span aria-hidden="true" className="welcome-luxe-border rounded-3xl" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-28 left-1/2 h-64 w-[30rem] -translate-x-1/2 rounded-full blur-[80px]"
            style={{ background: 'radial-gradient(ellipse at center, rgba(204,255,0,0.2), transparent 70%)' }}
          />

          <div className="relative">
            <h3 className="font-display text-2xl tracking-tight text-white">Buy License</h3>
          </div>

          <div className="relative mt-6 flex items-end gap-2">
            <span className="font-display text-6xl font-semibold tracking-tight text-white sm:text-7xl">
              $50
            </span>
            <span className="font-display mb-2.5 text-sm text-zinc-500">/ Lifetime</span>
          </div>
          <p className="font-display relative mt-3 text-sm font-light text-zinc-400">
            Skip broker registration. Purchase a direct, unrestricted 1-month license immediately.
          </p>

          <div
            aria-hidden="true"
            className="relative mt-7 h-px w-full"
            style={{ background: 'linear-gradient(90deg, rgba(204,255,0,0.35), transparent)' }}
          />

          <ul className="relative mt-7 flex flex-1 flex-col gap-4">
            {LICENSE_PERKS.map((perk) => (
              <li key={perk} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#CCFF00] shadow-[0_0_10px_rgba(204,255,0,0.35)]">
                  <Check className="h-3 w-3 text-black" />
                </span>
                <span className="font-display text-sm font-light text-zinc-200">{perk}</span>
              </li>
            ))}
          </ul>

          <a
            href="https://t.me/Miraj_X_Trader_Official"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="pricing-purchase-button"
            className={`${BTN_PRIMARY} relative mt-9 w-full`}
          >
            <KeyRound className="h-4 w-4" />
            Purchase License
          </a>
          <p className="font-display relative mt-4 text-center text-xs text-zinc-600">
            Instant activation · priority support included
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── cta ── */
function CtaBand() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
      <div className="corner-frame relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#060806] px-6 py-16 text-center sm:px-12 lg:py-24">
        <div aria-hidden="true" className="tech-grid absolute inset-0 opacity-60" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 blur-[90px]"
          style={{ background: 'radial-gradient(ellipse at center, rgba(204,255,0,0.22), transparent 70%)' }}
        />
        <h2 className="font-display relative text-balance text-3xl font-medium tracking-tight text-white md:text-4xl lg:text-5xl">
          Start your trading career with <span className="text-[#CCFF00]">Vertex AI</span>
        </h2>
        <p className="font-display relative mx-auto mt-5 max-w-xl text-pretty text-base font-light text-zinc-400">
          Join thousands of traders using automated, data-driven signals to trade with confidence —
          every single day.
        </p>
        <Link
          href="/registration"
          data-testid="cta-create-account-button"
          className={`${BTN_PRIMARY} relative mt-10 w-full sm:w-auto`}
        >
          <Rocket className="h-4 w-4" />
          Create free account
        </Link>
      </div>
    </section>
  )
}

/* ── footer ── */
function Footer() {
  return (
    <footer id="support" className="scroll-mt-24 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          <div>
            <a href="#top" className="flex items-center gap-3" data-testid="footer-logo-link">
              <span className="relative h-9 w-9 overflow-hidden rounded-xl ring-1 ring-white/10">
                <Image src="/vertex-logo.png" alt="Vertex AI logo" fill className="object-cover" sizes="36px" />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight text-white">
                Vertex <span className="text-[#CCFF00]">AI</span>
              </span>
            </a>
            <p className="font-display mt-4 max-w-xs text-sm font-light leading-relaxed text-zinc-500">
              Advanced trading intelligence that turns real-time market data into clear,
              confident decisions.
            </p>
          </div>

          <div>
            <p className="font-display text-xs uppercase tracking-[0.2em] text-zinc-600">Explore</p>
            <nav className="mt-4 flex flex-col gap-2.5">
              {NAV_LINKS.slice(0, 3).map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-display text-sm text-zinc-500 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <p className="font-display text-xs uppercase tracking-[0.2em] text-zinc-600">Legal & Support</p>
            <nav className="mt-4 flex flex-col gap-2.5">
              <Link
                href="/privacy"
                data-testid="footer-privacy-link"
                className="font-display text-sm text-zinc-500 transition-colors hover:text-white"
              >
                Privacy Policy
              </Link>
              <a
                href="https://t.me/Miraj_X_Trader_Official"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-support-link"
                className="font-display text-sm text-zinc-500 transition-colors hover:text-white"
              >
                Support
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-12 flex gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
          <AlertTriangle className="h-5 w-5 shrink-0 text-[#CCFF00]/70" />
          <p className="font-display text-xs font-light leading-relaxed text-zinc-500">
            <span className="font-medium text-zinc-300">Trading Risk Disclaimer:</span> Trading
            financial instruments carries a high level of risk and may not be suitable for all
            investors. The high degree of leverage can work against you as well as for you. Past
            performance of Vertex AI is not indicative of future results. You should never trade with
            money you cannot afford to lose. Vertex AI provides tools and signals for informational
            purposes only and does not constitute financial advice.
          </p>
        </div>

        <p className="font-display mt-8 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} Vertex AI. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export function VertexLanding() {
  const router = useRouter()

  useEffect(() => {
    const warm = () => {
      router.prefetch('/login')
      router.prefetch('/registration')
      fetch('/login').catch(() => {})
      fetch('/registration').catch(() => {})
    }
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(warm, { timeout: 2000 })
    } else {
      setTimeout(warm, 1200)
    }
  }, [router])

  return (
    <div
      id="top"
      className="relative min-h-dvh bg-[#020302]"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 90% 55% at 50% -10%, #132600 0%, rgba(6,10,4,0.85) 45%, #020302 100%)',
        backgroundAttachment: 'fixed',
      }}
    >
      <Navbar />
      <main>
        <Hero />
        <Pricing />
        <HowItWorks />
        <Features />
        <CtaBand />
      </main>
      <Footer />
    </div>
  )
}
