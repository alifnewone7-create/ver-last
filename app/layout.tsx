import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Playfair_Display, Outfit } from 'next/font/google'
import { AuthProvider } from '@/components/auth-provider'
import { UpgradeGateProvider } from '@/components/upgrade-gate'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
})
const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vertex-ai.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Vertex AI — Smart Algorithmic Trading',
  description:
    'Vertex AI is an advanced algorithmic trading assistant that helps you trade smarter with automated, data-driven signals. Get free access or buy a direct license today.',
  generator: 'iamhear',
  icons: {
    icon: '/vertex-logo.png',
    apple: '/vertex-logo.png',
  },
  openGraph: {
    title: 'Vertex AI | Smart Algorithmic Trading',
    description:
      'Trade smarter with Vertex AI | automated, data-driven trading signals. Start your trading career today.',
    images: ['/vertex-logo.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vertex AI — Smart Algorithmic Trading',
    description:
      'Trade smarter with Vertex AI — automated, data-driven trading signals.',
    images: ['/vertex-logo.png'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#1a1530',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${outfit.variable}`}
    >
      <body className="bg-background font-sans antialiased">
        <AuthProvider>
          <UpgradeGateProvider>{children}</UpgradeGateProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
