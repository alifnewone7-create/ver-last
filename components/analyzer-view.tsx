'use client'

import { TopNav } from '@/components/top-nav'
import { AuthGuard } from '@/components/auth-guard'
import { ChartAnalyzer } from '@/components/chart-analyzer'

type Mode = 'otc' | 'real'

export function AnalyzerView({ mode }: { mode: Mode }) {
  return (
    <AuthGuard>
      {() => (
        <main className="home-bg relative min-h-dvh">
          <TopNav />

          <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
            <ChartAnalyzer mode={mode} />
          </div>
        </main>
      )}
    </AuthGuard>
  )
}
