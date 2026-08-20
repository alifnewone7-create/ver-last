import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { StarField } from '@/components/star-field'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'Privacy Policy — Vertex AI',
  description:
    'Learn how Vertex AI collects, uses, and protects your personal information when you use our algorithmic trading signals and tools.',
}

const LAST_UPDATED = 'July 12, 2026'

const SECTIONS = [
  {
    heading: '1. Introduction',
    body: [
      'Vertex AI ("Vertex AI", "we", "us", or "our") provides an algorithmic trading assistant that delivers automated, data-driven trading signals and chart-analysis tools. This Privacy Policy explains what information we collect, how we use it, and the choices you have.',
      'By creating an account or using Vertex AI, you agree to the practices described in this policy. If you do not agree, please discontinue use of the service.',
    ],
  },
  {
    heading: '2. Information We Collect',
    body: [
      'Account information: when you register, we collect your name, email address, and authentication credentials, which are managed securely through our authentication provider.',
      'Usage data: we record how you interact with our tools — such as which analyzers or signal pages you use and your daily generation counts — to enforce plan limits and improve the service.',
      'Technical data: we may collect device, browser, and approximate location information, along with cookies and similar technologies needed to keep you signed in and secure your session.',
    ],
  },
  {
    heading: '3. How We Use Your Information',
    body: [
      'To create and manage your account, authenticate you, and maintain your subscription tier (Free, Basic, Standard, Premium, or Admin).',
      'To operate core features, including generating trading signals, applying daily usage limits, and delivering chart analysis.',
      'To protect the platform against fraud, abuse, and unauthorized access, and to comply with legal obligations.',
      'To communicate important updates about your account, plan, or the service.',
    ],
  },
  {
    heading: '4. Trading Data & Signals',
    body: [
      'Vertex AI provides tools and signals for informational purposes only. We do not execute trades on your behalf and we do not have access to your brokerage funds. Any trading you perform through third-party brokers is entirely your responsibility.',
      'Signal outputs and analysis results are generated based on market data and are not guarantees of future performance.',
    ],
  },
  {
    heading: '5. Third-Party Services',
    body: [
      'We rely on trusted third parties to operate Vertex AI, including authentication and hosting providers. These providers process data only as needed to deliver their services.',
      'Some links (for example, broker sign-up links and our Telegram support channel) direct you to external platforms that operate under their own privacy policies. We are not responsible for the practices of those third parties.',
    ],
  },
  {
    heading: '6. Cookies & Sessions',
    body: [
      'We use cookies and local storage to keep you signed in, remember preferences, and secure your session. You can control cookies through your browser settings, but disabling them may limit access to certain features.',
    ],
  },
  {
    heading: '7. Data Security',
    body: [
      'We apply industry-standard safeguards — including encryption in transit and secure credential handling — to protect your information. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.',
    ],
  },
  {
    heading: '8. Data Retention',
    body: [
      'We retain your account and usage data for as long as your account is active or as needed to provide the service. You may request deletion of your account, after which we will remove or anonymize your personal data except where retention is required by law.',
    ],
  },
  {
    heading: '9. Your Rights',
    body: [
      'Depending on your location, you may have the right to access, correct, export, or delete your personal information, and to object to or restrict certain processing. To exercise these rights, contact us using the details below.',
    ],
  },
  {
    heading: '10. Children’s Privacy',
    body: [
      'Vertex AI is not intended for anyone under the age of 18. We do not knowingly collect personal information from children. If you believe a minor has provided us information, please contact us so we can remove it.',
    ],
  },
  {
    heading: '11. Changes to This Policy',
    body: [
      'We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date above. Continued use of Vertex AI after changes take effect constitutes acceptance of the revised policy.',
    ],
  },
  {
    heading: '12. Contact Us',
    body: [
      'If you have questions about this Privacy Policy or how your data is handled, reach out to us on Telegram at @Ayan_sx.',
    ],
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div id="top" className="relative min-h-dvh bg-background">
      <StarField />
      <div className="relative z-10">
        {/* Lightweight header */}
        <header className="sticky top-3 z-50 px-3 sm:top-4 sm:px-6">
          <nav className="border-luxe surface-luxe mx-auto flex h-16 max-w-4xl items-center justify-between rounded-2xl px-4 shadow-lg shadow-black/25 backdrop-blur-xl sm:px-6">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="relative h-9 w-9 overflow-hidden rounded-lg ring-1 ring-border">
                <Image
                  src="/vertex-logo.png"
                  alt="Vertex AI logo"
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              </span>
              <span className="text-lg font-bold tracking-tight">
                Vertex <span className="text-shine">AI</span>
              </span>
            </Link>
            <Link
              href="/"
              className="btn-luxe-outline flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-medium sm:px-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to home</span>
              <span className="sm:hidden">Home</span>
            </Link>
          </nav>
        </header>

        <main className="mx-auto max-w-4xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
          {/* Title block */}
          <div className="border-luxe surface-luxe relative overflow-hidden rounded-3xl p-6 shadow-xl shadow-primary/10 sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <div className="relative flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
                <ShieldCheck className="h-7 w-7" />
              </span>
              <div>
                <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
                  Privacy Policy
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Last updated: {LAST_UPDATED}
                </p>
              </div>
            </div>
            <p className="relative mt-5 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              Your privacy matters to us. This policy describes how Vertex AI
              handles your information when you use our trading signals, chart
              analyzers, and related tools.
            </p>
          </div>

          {/* Sections */}
          <div className="mt-6 flex flex-col gap-4">
            {SECTIONS.map((section) => (
              <section
                key={section.heading}
                className="border-luxe surface-luxe rounded-3xl p-6 shadow-lg shadow-black/10 sm:p-8"
              >
                <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                  {section.heading}
                </h2>
                <div className="mt-3 flex flex-col gap-3">
                  {section.body.map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-pretty text-sm leading-relaxed text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}
