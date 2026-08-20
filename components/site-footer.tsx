import Image from 'next/image'
import Link from 'next/link'
import { Brain, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const FOOTER_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Support', href: 'https://t.me/Miraj_X_Trader_Official', external: true },
]

export function SiteFooter() {
  return (
    <footer id="support" className="relative scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* CTA card sitting above the footer */}
        <div className="surface-luxe relative mb-12 overflow-hidden rounded-3xl border border-primary/40 p-8 text-center shadow-2xl shadow-primary/15 sm:p-12">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-primary/12 blur-[90px]" />
            <div className="absolute bottom-0 right-10 h-44 w-44 rounded-full bg-accent/12 blur-[80px]" />
          </div>
          <div className="relative">
            <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
              Start your trading career with{' '}
              <span className="text-gradient">Vertex AI</span>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-pretty text-muted-foreground">
              Join thousands of traders using automated, data-driven signals to trade with
              confidence — every single day.
            </p>
            <Button
              render={<Link href="/registration" />}
              className="btn-luxe mt-7 h-12 gap-2 rounded-xl px-8 text-base font-semibold"
            >
              <Brain className="icon-pulse-soft h-[18px] w-[18px]" />
              Get Vertex AI
            </Button>
          </div>
        </div>
      </div>

      {/* footer body */}
      <div className="bg-popover">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 border-t border-border pb-8 pt-8 text-center md:flex-row md:justify-between md:pt-10 md:text-left">
            {/* logo + name */}
            <a href="/#top" className="flex items-center gap-2.5">
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
            </a>

            {/* links */}
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {FOOTER_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* risk disclaimer */}
          <div className="border-t border-border py-6">
            <div className="flex gap-3 rounded-2xl border border-[var(--down)]/30 bg-[var(--down)]/5 p-4">
              <AlertTriangle className="h-5 w-5 shrink-0 text-[var(--down)]" />
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
        </div>
      </div>
    </footer>
  )
}
