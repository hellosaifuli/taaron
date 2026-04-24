import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import LuxuryNav from '@/components/luxury-nav'
import SiteFooter from '@/components/site-footer'
import { CartProvider } from '@/components/cart-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Taaron — Premium Leather Goods | Everyday Elegance',
    template: '%s | Taaron',
  },
  description:
    'Taaron crafts premium leather wallets, bags, and belts for everyday elegance. Artisanal craftsmanship, minimalist design, and modern luxury — without the heavy price tag. Shop in Bangladesh with COD & bKash.',
  keywords: [
    'leather goods Bangladesh', 'premium leather wallet', 'leather bag Bangladesh',
    'leather belt', 'artisanal leather', 'taaron', 'তারণ', 'luxury leather Bangladesh',
    'handmade leather wallet', 'leather cardholder', 'ladies leather bag', 'minimalist wallet',
  ],
  authors: [{ name: 'Taaron', url: baseUrl }],
  creator: 'Taaron',
  publisher: 'Taaron',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'Taaron',
    title: 'Taaron — Premium Leather Goods | Everyday Elegance',
    description: 'Premium leather wallets, bags, and belts. Artisanal craftsmanship meets minimalist design. COD & bKash available in Bangladesh.',
    images: [{ url: `${baseUrl}/taaron-logo.png`, width: 1200, height: 630, alt: 'Taaron — Premium Leather Goods' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Taaron — Premium Leather Goods',
    description: 'Artisanal leather wallets, bags, and belts. Modern luxury without the heavy price tag.',
    images: [`${baseUrl}/taaron-logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: baseUrl },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#FAFAFA] text-[#1E2737] selection:bg-[#1969B5]/20" style={{ fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
        <CartProvider>
          <LuxuryNav />
          <main>{children}</main>
          <SiteFooter />
        </CartProvider>
        <Toaster closeButton position="bottom-right" />
      </body>
    </html>
  )
}
