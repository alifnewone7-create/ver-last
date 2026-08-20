import type { Metadata } from 'next'
import { AuthCard, AuthLayout } from '@/components/auth-card'
import { AuthRedirect } from '@/components/auth-redirect'

export const metadata: Metadata = {
  title: 'Login | Vertex AI',
  description:
    'Sign in to your Vertex AI account to access your algorithmic trading dashboard and automated signals.',
  openGraph: {
    title: 'Login to Vertex AI',
    description:
      'Sign in to your Vertex AI account and access your automated, data-driven trading signals.',
    images: ['/vertex-logo.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Login to Vertex AI',
    description:
      'Sign in to your Vertex AI account and access your automated trading signals.',
    images: ['/vertex-logo.png'],
  },
}

export default function LoginPage() {
  return (
    <AuthRedirect>
      <AuthLayout>
        <AuthCard mode="login" />
      </AuthLayout>
    </AuthRedirect>
  )
}
