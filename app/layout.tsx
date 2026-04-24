import { GeistSans } from 'geist/font/sans'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata = {
  title: {
    default: 'Taaron — Everyday Elegance',
    template: '%s | Taaron',
  },
  description: 'Premium leather goods. Artisanal craftsmanship, minimalist design, everyday elegance.',
  robots: { follow: true, index: true },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-[#F4F0E6] text-[#1C1C1C] selection:bg-[#B8962E]/30">
        <main>
          {children}
          <Toaster closeButton />
        </main>
      </body>
    </html>
  )
}
