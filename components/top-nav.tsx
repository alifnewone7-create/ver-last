'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  LayoutDashboard,
  ScanLine,
  ScanSearch,
  Telescope,
  Radio,
  SlidersHorizontal,
  LogOut,
  Menu,
  X,
  IdCard,
  ShieldCheck,
  Mail,
  Copy,
  Check,
} from '@/components/icons'
import { useAuth } from '@/components/auth-provider'
import { cn } from '@/lib/utils'
import { normalizeTier, type Tier } from '@/lib/tiers'
import { Gift, Rocket, Star, Crown } from '@/components/icons'

const TIER_ROW_ICONS: Record<Tier, typeof Gift> = {
  free: Gift,
  basic: Rocket,
  standard: Star,
  premium: Crown,
  admin: ShieldCheck,
}

const TIER_STYLES: Record<Tier, { gradient: string; border: string; text: string }> = {
  free: {
    gradient: 'linear-gradient(135deg, rgba(120,130,120,0.18), rgba(20,24,18,0.85))',
    border: 'border-zinc-400/25',
    text: 'text-zinc-200',
  },
  basic: {
    gradient: 'linear-gradient(135deg, rgba(204,255,0,0.16), rgba(15,20,6,0.9))',
    border: 'border-[#CCFF00]/30',
    text: 'text-[#CCFF00]',
  },
  standard: {
    gradient: 'linear-gradient(135deg, rgba(56,200,255,0.16), rgba(6,16,22,0.9))',
    border: 'border-sky-400/30',
    text: 'text-sky-300',
  },
  premium: {
    gradient: 'linear-gradient(135deg, rgba(255,190,60,0.18), rgba(24,16,4,0.9))',
    border: 'border-amber-400/30',
    text: 'text-amber-300',
  },
  admin: {
    gradient: 'linear-gradient(135deg, rgba(220,60,110,0.18), rgba(24,6,12,0.9))',
    border: 'border-rose-400/30',
    text: 'text-rose-300',
  },
}

const navLinks = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'OTC Chart Analyzer', href: '/otc-chart-analyzer', icon: ScanLine },
  { label: 'Real Chart Analyzer', href: '/real-chart-analyzer', icon: ScanSearch },
  { label: 'Future Signals', href: '/future-signals', icon: Telescope },
  { label: 'Live Signals', href: '/live-signals', icon: Radio },
  { label: 'Management', href: '/management', icon: SlidersHorizontal },
]

const navSections = [
  {
    heading: null,
    links: [{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }],
  },
  {
    heading: 'Chart Analyzers',
    links: [
      { label: 'OTC Chart Analyzer', href: '/otc-chart-analyzer', icon: ScanLine },
      { label: 'Real Chart Analyzer', href: '/real-chart-analyzer', icon: ScanSearch },
    ],
  },
  {
    heading: 'Signal System',
    links: [
      { label: 'Live Signals', href: '/live-signals', icon: Radio },
      { label: 'Future Signals', href: '/future-signals', icon: Telescope },
    ],
  },
  {
    heading: 'Management',
    links: [{ label: 'Management', href: '/management', icon: SlidersHorizontal }],
  },
]

export function TopNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { profile, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close overlays whenever the route changes
  useEffect(() => {
    setMenuOpen(false)
    setProfileOpen(false)
  }, [pathname])

  // Lock body scroll and enable Escape-to-close while the profile modal is open
  useEffect(() => {
    if (!profileOpen) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setProfileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [profileOpen])

  // Lock body scroll and enable Escape-to-close while the logout confirmation is open
  useEffect(() => {
    if (!logoutConfirmOpen) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setLogoutConfirmOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [logoutConfirmOpen])

  const firstName = profile?.name?.split(' ')[0] || 'Trader'
  const tier = normalizeTier(profile?.plan)
  const tierStyle = TIER_STYLES[tier]
  const TierRowIcon = TIER_ROW_ICONS[tier]

  function requestLogout() {
    setLogoutConfirmOpen(true)
  }

  async function confirmLogout() {
    setLoggingOut(true)
    await logout()
    router.push('/login')
  }

  async function handleCopyEmail() {
    const email = profile?.email
    if (!email) return
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      // Fallback for browsers/contexts without the async clipboard API
      const textarea = document.createElement('textarea')
      textarea.value = email
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      try {
        document.execCommand('copy')
      } catch {
        // ignore
      }
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="border-luxe surface-luxe mx-auto max-w-6xl rounded-2xl backdrop-blur-xl">
        <nav className="flex items-center justify-between gap-4 px-3 py-2.5 sm:px-5 sm:py-3">
          {/* Mobile: hamburger (left) */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="btn-luxe-outline flex h-10 w-10 items-center justify-center rounded-xl md:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Logo (center on mobile, left on desktop) */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 md:gap-3"
          >
            <Image
              src="/vertex-logo.png"
              alt="Vertex AI"
              width={36}
              height={36}
              className="hidden rounded-xl ring-1 ring-primary/30 md:block"
            />
            <span className="text-lg font-bold tracking-tight md:text-xl">
                    Vertex <span className="text-shine">AI</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 rounded-2xl border border-border/60 bg-input/20 p-1 md:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  title={link.label}
                  aria-label={link.label}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all',
                    active
                      ? 'btn-luxe'
                      : 'text-muted-foreground hover:bg-input/40 hover:text-foreground',
                  )}
                >
                  <link.icon
                    className={cn(
                      'h-[1.15rem] w-[1.15rem] shrink-0 transition-transform group-hover:scale-110',
                      active && 'text-primary-foreground',
                    )}
                  />
                  <span className="sr-only">{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Profile (right) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              aria-label="Profile menu"
              aria-expanded={profileOpen}
              className="flex items-center gap-2.5 rounded-2xl transition-all md:border md:border-border/60 md:bg-input/20 md:py-1 md:pl-1 md:pr-3 md:hover:bg-input/40"
            >
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl ring-1 ring-primary/40 transition-transform hover:scale-105 md:hover:scale-100">
                <Image
                  src="/vertex-profile.png"
                  alt={`${firstName} profile`}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="hidden flex-col items-start leading-tight md:flex">
                <span className="max-w-[9rem] truncate text-sm font-semibold">
                  {firstName}
                </span>
                <span className="text-gradient text-[11px] font-bold uppercase tracking-wide">
                  {profile?.plan || 'free'}
                </span>
              </span>
            </button>

          </div>

          {/* Centered profile popup (rendered above everything via portal) */}
          {mounted &&
            profileOpen &&
            createPortal(
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Your profile"
                className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 pt-16 sm:items-center sm:pt-4"
              >
                <button
                  type="button"
                  aria-label="Close profile"
                  onClick={() => setProfileOpen(false)}
                  className="absolute inset-0 cursor-default bg-background/75 backdrop-blur-sm"
                />
                <div
                  data-testid="profile-details-card"
                  className="border-luxe surface-luxe relative z-10 w-full max-w-md overflow-hidden rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
                >
                  <span aria-hidden className="welcome-luxe-border rounded-3xl" />
                  {/* top lime glow */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[26rem] -translate-x-1/2 rounded-full blur-[70px]"
                    style={{
                      background:
                        'radial-gradient(ellipse at center, rgba(204,255,0,0.18), transparent 70%)',
                    }}
                  />

                  {/* section header */}
                  <div className="relative z-10 flex items-center justify-between gap-3 border-b border-[#CCFF00]/15 bg-[#0A0C08]/70 px-5 py-3.5 sm:px-6">
                    <p className="font-display inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-zinc-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.8)]" />
                      Vertex account
                    </p>
                    <button
                      type="button"
                      onClick={() => setProfileOpen(false)}
                      aria-label="Close profile"
                      data-testid="profile-close-button"
                      className="btn-luxe-outline flex h-9 w-9 shrink-0 items-center justify-center"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="relative z-10 flex flex-col items-center px-5 pb-6 pt-6 text-center sm:px-7 sm:pt-7">

                    {/* avatar */}
                    <span className="relative mt-5 h-24 w-24 sm:h-28 sm:w-28">
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -inset-2 rounded-[1.6rem] bg-[#CCFF00]/12 blur-xl"
                      />
                      <span className="relative z-10 block h-full w-full overflow-hidden rounded-[1.4rem] ring-2 ring-[#CCFF00]/45">
                        <Image
                          src="/vertex-profile.png"
                          alt={`${firstName} profile`}
                          width={112}
                          height={112}
                          className="h-full w-full object-cover"
                        />
                      </span>
                    </span>

                    <h2 className="font-display mt-4 max-w-full truncate text-2xl font-medium tracking-tight text-white sm:text-3xl">
                      {profile?.name || 'Trader'}
                    </h2>

                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                      <span
                        data-testid="profile-plan-badge"
                        className="font-display inline-flex items-center gap-1.5 rounded-full border border-[#CCFF00]/35 bg-[#CCFF00]/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#CCFF00]"
                      >
                        <IdCard className="h-3 w-3" />
                        {profile?.plan || 'free'} plan
                      </span>
                    </div>

                    {/* divider */}
                    <div
                      aria-hidden
                      className="mt-6 h-px w-full"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent, rgba(204,255,0,0.3) 50%, transparent)',
                      }}
                    />

                    {/* details */}
                    <div className="mt-5 flex w-full flex-col gap-3 text-left">
                      <section
                        data-testid="profile-email-row"
                        className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/[0.07] bg-[#0A0C08]/80 p-3.5 sm:p-4"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#CCFF00]/25 bg-[#0A0C08] text-[#CCFF00] shadow-[0_0_14px_rgba(204,255,0,0.1)]">
                          <Mail className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-[0.6rem] uppercase tracking-[0.18em] text-zinc-500">
                            Email address
                          </p>
                          <p className="font-display mt-0.5 break-all text-sm font-medium lowercase leading-snug text-zinc-100">
                            {(profile?.email || '—').toLowerCase()}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyEmail}
                          aria-label={copied ? 'Email copied' : 'Copy email address'}
                          disabled={!profile?.email}
                          data-testid="profile-copy-email-button"
                          className="btn-luxe-outline flex h-9 w-9 shrink-0 items-center justify-center disabled:opacity-40"
                        >
                          {copied ? (
                            <Check className="h-4 w-4 text-[#CCFF00]" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </section>

                      <section
                        data-testid="profile-tier-row"
                        className={`flex min-w-0 items-center gap-3 rounded-2xl border p-3.5 sm:p-4 ${tierStyle.border}`}
                        style={{ backgroundImage: tierStyle.gradient }}
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-[#0A0C08]/70 ${tierStyle.border} ${tierStyle.text}`}
                        >
                          <TierRowIcon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="font-display text-[0.6rem] uppercase tracking-[0.18em] text-zinc-400">
                            Account tier
                          </p>
                          <p
                            className={`font-display mt-0.5 truncate text-sm font-bold capitalize ${tierStyle.text}`}
                          >
                            {profile?.plan || 'free'} plan
                          </p>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>,
              document.body,
            )}
        </nav>
      </div>

      {/* Mobile left sidebar */}
      {menuOpen && (
        <div className="md:hidden">
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setMenuOpen(false)}
            className="animate-in fade-in fixed inset-0 z-40 cursor-default bg-background/60 backdrop-blur-sm duration-200"
          />
          <aside className="animate-in slide-in-from-left surface-luxe fixed inset-y-0 left-0 z-50 flex w-[19rem] max-w-[82%] flex-col border-r border-border/60 shadow-[0_0_32px_-14px_oklch(0.5_0.2_165_/_0.3)] backdrop-blur-2xl duration-300">
            {/* Header with profile */}
            <div className="relative overflow-hidden border-b border-border/60 px-4 pb-4 pt-5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/12 via-primary/5 to-transparent" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Image
                    src="/vertex-logo.png"
                    alt="Vertex AI"
                    width={38}
                    height={38}
                    className="rounded-xl ring-1 ring-primary/30"
                  />
                  <span className="text-lg font-bold tracking-tight">
              Vertex <span className="text-shine">AI</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="btn-luxe-outline flex h-9 w-9 items-center justify-center rounded-xl"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Grouped nav sections */}
            <nav className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
              {navSections.map((section, i) => (
                <div key={section.heading ?? `section-${i}`} className="flex flex-col gap-1.5">
                  {section.heading && (
                    <div className="flex items-center gap-2.5 px-2 pb-1 pt-1">
                      <span className="h-4 w-1 rounded-full bg-gradient-to-b from-primary to-primary/40" />
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground/80">
                        {section.heading}
                      </p>
                      <span className="h-px flex-1 bg-gradient-to-r from-border/70 to-transparent" />
                    </div>
                  )}
                  {section.links.map((link) => {
                    const active = pathname === link.href
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all',
                          active
                            ? 'btn-luxe'
                            : 'text-muted-foreground hover:bg-input/30 hover:text-foreground',
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                            active
                              ? 'bg-primary-foreground/15'
                              : 'bg-input/40 group-hover:bg-input/60',
                          )}
                        >
                          <link.icon className="h-[1.05rem] w-[1.05rem]" />
                        </span>
                        {link.label}
                      </Link>
                    )
                  })}
                </div>
              ))}
            </nav>

            <div className="border-t border-border/60 p-3">
              <button
                type="button"
                onClick={requestLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <LogOut className="h-5 w-5" />
                Log out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Logout confirmation dialog */}
      {mounted &&
        logoutConfirmOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-confirm-title"
          >
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              onClick={() => !loggingOut && setLogoutConfirmOpen(false)}
              className="animate-in fade-in absolute inset-0 cursor-default bg-background/70 backdrop-blur-sm duration-200"
            />
            <div className="animate-in fade-in zoom-in-95 border-luxe surface-luxe relative z-10 w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl shadow-primary/25 duration-200">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-destructive/60 to-transparent" />
              <div className="flex flex-col items-center px-6 pb-6 pt-7 text-center sm:px-8">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/15 text-destructive ring-1 ring-destructive/30">
                  <LogOut className="h-7 w-7" />
                </span>
                <h2
                  id="logout-confirm-title"
                  className="mt-4 text-lg font-bold tracking-tight sm:text-xl"
                >
                  Log out of Vertex AI?
                </h2>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                  You&apos;ll need to sign in again to access your dashboard and
                  tools.
                </p>

                <div className="mt-6 flex w-full flex-col gap-2.5 sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={confirmLogout}
                    disabled={loggingOut}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-destructive px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60 sm:flex-1"
                  >
                    <LogOut className="h-4 w-4" />
                    {loggingOut ? 'Logging out…' : 'Log out'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoutConfirmOpen(false)}
                    disabled={loggingOut}
                    className="btn-luxe-outline flex h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold disabled:opacity-60 sm:flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </header>
  )
}
