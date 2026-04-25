import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In — Taaron',
  description: 'Sign in to your Taaron account to track orders and manage your profile.',
  robots: { index: false, follow: false },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
