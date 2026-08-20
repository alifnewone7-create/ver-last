'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, User, Eye, EyeOff, Check, Loader2, ArrowRight } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { cn } from '@/lib/utils'

function friendlyError(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.'
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

type AuthMode = 'login' | 'registration'

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
      {children}
    </span>
  )
}

const inputClass =
  'font-display h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-3 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors duration-200 focus:border-[#CCFF00]/60 focus:ring-2 focus:ring-[#CCFF00]/15'

export function AuthCard({ mode: initialMode }: { mode: AuthMode }) {
  const router = useRouter()
  const { login, register } = useAuth()
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const isLogin = mode === 'login'

  function switchMode(next: AuthMode) {
    if (next === mode) return
    setMode(next)
    setError('')
    window.history.replaceState(null, '', next === 'login' ? '/login' : '/registration')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    setSubmitting(true)
    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await register(name, email, password)
      }
      router.push('/dashboard')
    } catch (err) {
      const code =
        err && typeof err === 'object' && 'code' in err
          ? String((err as { code: string }).code)
          : ''
      setError(friendlyError(code))
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-card-enter relative w-full max-w-md overflow-hidden rounded-3xl border border-[#CCFF00]/20 bg-[#070907]/85 p-6 shadow-[0_12px_48px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-8">
      <span aria-hidden="true" className="welcome-luxe-border rounded-3xl" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[26rem] -translate-x-1/2 rounded-full blur-[80px]"
        style={{ background: 'radial-gradient(ellipse at center, rgba(204,255,0,0.16), transparent 70%)' }}
      />

      {/* Tabs */}
      <div
        className="auth-rise relative z-10 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1"
        style={{ '--rise-delay': '80ms' } as React.CSSProperties}
      >
        <button
          type="button"
          onClick={() => switchMode('login')}
          aria-current={isLogin ? 'page' : undefined}
          data-testid="auth-tab-login"
          className={cn(
            'font-display flex h-10 items-center justify-center rounded-lg text-sm font-semibold',
            isLogin
              ? 'bg-[#CCFF00] text-black shadow-[0_2px_14px_rgba(204,255,0,0.35)]'
              : 'text-zinc-400 hover:text-white',
          )}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => switchMode('registration')}
          aria-current={!isLogin ? 'page' : undefined}
          data-testid="auth-tab-registration"
          className={cn(
            'font-display flex h-10 items-center justify-center rounded-lg text-sm font-semibold',
            !isLogin
              ? 'bg-[#CCFF00] text-black shadow-[0_2px_14px_rgba(204,255,0,0.35)]'
              : 'text-zinc-400 hover:text-white',
          )}
        >
          Registration
        </button>
      </div>

      {/* Heading */}
      <div
        className="auth-rise relative z-10 mt-6 text-center"
        style={{ '--rise-delay': '150ms' } as React.CSSProperties}
      >
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {isLogin ? (
            <>
              Welcome <span className="text-[#CCFF00]">back</span>
            </>
          ) : (
            <>
              Create your <span className="text-[#CCFF00]">account</span>
            </>
          )}
        </h1>
        <p className="font-display mt-2 text-pretty text-sm font-light leading-relaxed text-zinc-400">
          {isLogin
            ? 'Sign in to access your Vertex AI trading dashboard.'
            : 'Join Vertex AI and start trading with automated signals.'}
        </p>
      </div>

      {/* Form */}
      <form className="relative z-10 mt-7 flex flex-col gap-4" onSubmit={handleSubmit}>
        {!isLogin && (
          <div
            className="auth-rise relative"
            style={{ '--rise-delay': '210ms' } as React.CSSProperties}
          >
            <FieldIcon>
              <User className="h-[18px] w-[18px]" />
            </FieldIcon>
            <input
              type="text"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              autoComplete="name"
              data-testid="auth-name-input"
              className={inputClass}
            />
          </div>
        )}

        <div
          className="auth-rise relative"
          style={{ '--rise-delay': '270ms' } as React.CSSProperties}
        >
          <FieldIcon>
            <Mail className="h-[18px] w-[18px]" />
          </FieldIcon>
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            autoComplete="email"
            data-testid="auth-email-input"
            className={inputClass}
          />
        </div>

        <div
          className="auth-rise relative"
          style={{ '--rise-delay': '330ms' } as React.CSSProperties}
        >
          <FieldIcon>
            <Lock className="h-[18px] w-[18px]" />
          </FieldIcon>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            data-testid="auth-password-input"
            className={cn(inputClass, 'pr-11')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            data-testid="auth-toggle-password"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-white"
          >
            {showPassword ? (
              <EyeOff className="h-[18px] w-[18px]" />
            ) : (
              <Eye className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>

        {error && (
          <p
            role="alert"
            data-testid="auth-error"
            className="font-display rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2.5 text-sm text-red-400"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          data-testid="auth-submit-button"
          className="btn-clay font-display auth-rise mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-base disabled:opacity-70"
          style={{ '--rise-delay': '440ms' } as React.CSSProperties}
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          {submitting
            ? isLogin
              ? 'Signing in...'
              : 'Creating account...'
            : isLogin
              ? 'Sign in'
              : 'Create account'}
        </button>
      </form>

      {/* Footer switch */}
      <p
        className="font-display auth-rise relative z-10 mt-6 text-center text-sm font-light text-zinc-400"
        style={{ '--rise-delay': '500ms' } as React.CSSProperties}
      >
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button
          type="button"
          onClick={() => switchMode(isLogin ? 'registration' : 'login')}
          data-testid="auth-switch-link"
          className="font-semibold text-[#CCFF00] hover:text-white"
        >
          {isLogin ? 'Register now' : 'Sign in'}
        </button>
      </p>
    </div>
  )
}

const brandPoints = [
  'Automated AI trading signals in real time',
  'AI that analyzes markets faster than you can blink',
  'Trusted by traders worldwide',
]

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="relative grid min-h-dvh grid-cols-1 overflow-x-clip bg-[#020302] lg:grid-cols-2"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 90% 55% at 50% -10%, #132600 0%, rgba(6,10,4,0.85) 45%, #020302 100%)',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Branding panel - visible on large screens */}
      <aside className="relative z-10 hidden flex-col justify-between border-r border-white/[0.08] p-10 lg:flex xl:p-14">
        <Link href="/" className="flex items-center gap-3" data-testid="auth-brand-logo">
          <span className="relative h-11 w-11 overflow-hidden rounded-xl ring-1 ring-white/10">
            <Image src="/vertex-logo.png" alt="Vertex AI" fill className="object-cover" sizes="44px" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-white">
            Vertex <span className="text-[#CCFF00]">AI</span>
          </span>
        </Link>

        <div className="max-w-md">
          <h2 className="font-display text-balance text-4xl leading-tight tracking-tight xl:text-5xl">
            <span className="font-light text-white">Trade smarter with</span>{' '}
            <span className="font-semibold text-[#CCFF00]">AI powered signals.</span>
          </h2>
          <ul className="mt-9 flex flex-col gap-4">
            {brandPoints.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#CCFF00] shadow-[0_0_12px_rgba(204,255,0,0.35)]">
                  <Check className="h-3.5 w-3.5 text-black" />
                </span>
                <span className="font-display text-pretty text-sm font-light leading-relaxed text-zinc-400">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-display text-xs text-zinc-600">
          {'© '}
          {new Date().getFullYear()} Vertex AI. All rights reserved.
        </p>
      </aside>

      {/* Form panel */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-full max-w-[40rem] -translate-x-1/2 rounded-full opacity-60 blur-[110px]"
          style={{ background: 'radial-gradient(ellipse at center, rgba(204,255,0,0.14), transparent 65%)' }}
        />
        <div className="auth-logo-enter relative z-10 mb-6 flex flex-col items-center gap-3 sm:mb-8 lg:hidden">
          <Link href="/" className="relative flex items-center justify-center" data-testid="auth-mobile-logo">
            <span className="auth-logo-glow" aria-hidden="true" />
            <Image
              src="/vertex-logo.png"
              alt="Vertex AI"
              width={64}
              height={64}
              className="rounded-2xl shadow-xl ring-1 ring-white/15"
            />
          </Link>
          <div className="text-center">
            <span className="font-display text-2xl font-semibold tracking-tight text-white">
              Vertex <span className="text-[#CCFF00]">AI</span>
            </span>
            <p className="font-display mt-1 text-xs font-light text-zinc-500">
              AI-powered trading, made effortless.
            </p>
          </div>
        </div>
        {children}
      </div>
    </main>
  )
}
