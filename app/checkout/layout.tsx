import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your Taaron order securely. Cash on delivery and bKash accepted.',
  robots: { index: false, follow: false },
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
