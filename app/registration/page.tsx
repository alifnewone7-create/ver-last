import type { Metadata } from 'next'
import { AuthCard, AuthLayout } from '@/components/auth-card'
import { AuthRedirect } from '@/components/auth-redirect'

export const metadata: Metadata = {
  title: 'Registration | Vertex AI',
  description:
    'Create your Vertex AI account to start trading smarter with automated, data-driven signals built to grow your account.',
  openGraph: {
    title: 'Create your Vertex AI account',
    description:
      'Register for Vertex AI and start trading smarter with automated, data-driven signals today.',
    images: ['/vertex-logo.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create your Vertex AI account',
    description:
      'Register for Vertex AI and start trading smarter with automated signals today.',
    images: ['/vertex-logo.png'],
  },
}

export default function RegistrationPage() {
  return (
    <AuthRedirect>
      <AuthLayout>
        <AuthCard mode="registration" />
      </AuthLayout>
    </AuthRedirect>
  )
}
