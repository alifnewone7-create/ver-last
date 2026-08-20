import { SiteNavbar } from '@/components/site-navbar'
import { HeroSection } from '@/components/hero-section'
import { FeatureGrid } from '@/components/feature-grid'
import { PricingTiers } from '@/components/pricing-tiers'
import { SiteFooter } from '@/components/site-footer'
import { StarField } from '@/components/star-field'

export function LandingPage() {
  return (
    <div id="top" className="relative min-h-dvh bg-background">
      <StarField />
      <div className="relative z-10">
        <SiteNavbar />
        <main>
          <HeroSection />
          <FeatureGrid />
          <PricingTiers />
        </main>
        <SiteFooter />
      </div>
    </div>
  )
}
