import Image from 'next/image'
import Link from 'next/link'

const footerLinks = {
  Shop: [
    { label: 'All Products', href: '/category/all' },
    { label: 'Bags & Backpacks', href: '/category/bags' },
    { label: 'Wallets', href: '/category/wallets' },
    { label: 'Belts', href: '/category/belts' },
    { label: 'Card Holders', href: '/category/cardholder' },
    { label: 'Ladies Bags', href: '/category/ladies' },
  ],
  Support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'FAQ', href: '/#faq' },
  ],
}

export default function SiteFooter() {
  return (
    <footer className="bg-[#F5F5F5] text-[#1E2737]">
      {/* Main footer */}
      <div className="mx-auto max-w-screen-xl px-6 pt-16 pb-10 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1fr]">

          {/* Brand column */}
          <div>
            <p className="text-sm leading-relaxed text-[#4B5C73] max-w-xs">
              Premium leather goods crafted for everyday elegance. Artisanal quality, accessible price. Handcrafted in Bangladesh.
            </p>
            {/* Social links */}
            <div className="mt-6 flex items-center gap-4">
              <a href="#" aria-label="Taaron on Facebook" className="text-[#7A8EA6] transition-colors hover:text-[#1E2737]">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" aria-label="Taaron on Instagram" className="text-[#7A8EA6] transition-colors hover:text-[#1E2737]">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" aria-label="Taaron on YouTube" className="text-[#7A8EA6] transition-colors hover:text-[#1E2737]">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="#" aria-label="Taaron on TikTok" className="text-[#7A8EA6] transition-colors hover:text-[#1E2737]">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1E2737]">{heading}</p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[#4B5C73] transition-colors hover:text-[#1E2737]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Full-width logo watermark */}
        <div className="mt-16 -mx-6 lg:-mx-12">
          <Image
            src="/taaron-logo.png"
            alt=""
            aria-hidden
            width={1920}
            height={280}
            className="w-full object-contain opacity-[0.06]"
          />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1E2737]/10 px-6 py-5 lg:px-12">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-3 text-xs text-[#7A8EA6] sm:flex-row">
          <p>© 2026 Taaron (তারণ). All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="transition-colors hover:text-[#1E2737]">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-[#1E2737]">Terms</Link>
            <span>COD & bKash · Bangladesh</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
