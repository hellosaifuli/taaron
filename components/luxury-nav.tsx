'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/cart-provider'

const shopLinks = [
  { label: 'All Products', href: '/category/all' },
  { label: 'Bags & Backpacks', href: '/category/bags' },
  { label: 'Wallets', href: '/category/wallets' },
  { label: 'Belts', href: '/category/belts' },
  { label: 'Card Holders', href: '/category/cardholder' },
  { label: 'Ladies Bags', href: '/category/ladies' },
]

export default function LuxuryNav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const { count } = useCart()

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (y < 80) { setHidden(false); lastY.current = y; return }
      setHidden(y > lastY.current)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 border-b border-[#E8E8E8] bg-white transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-3 lg:px-12">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/taaron-logo.png"
              alt="Taaron"
              width={110}
              height={34}
              className="h-6 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-10 lg:flex">
            <Link href="/" className="text-xs uppercase tracking-widest text-[#1E2737] transition-colors hover:text-[#1969B5]">
              Home
            </Link>

            <div className="group relative">
              <button className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#1E2737] transition-colors hover:text-[#1969B5]">
                Shop
                <svg className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="invisible absolute left-1/2 top-full mt-3 w-52 -translate-x-1/2 origin-top scale-95 border border-[#E8E8E8] bg-white py-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:scale-100 group-hover:opacity-100">
                {shopLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-5 py-2.5 text-xs uppercase tracking-wider text-[#334155] transition-colors hover:bg-[#F6F6F6] hover:text-[#1E2737]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/contact" className="text-xs uppercase tracking-widest text-[#1E2737] transition-colors hover:text-[#1969B5]">
              Contact
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-6">
            <Link href="/auth" className="hidden text-xs uppercase tracking-widest text-[#1E2737] transition-colors hover:text-[#1969B5] lg:block">
              Account
            </Link>

            <Link
              href="/checkout"
              aria-label={`Cart — ${count} item${count !== 1 ? 's' : ''}`}
              className="relative hidden lg:flex items-center gap-2 text-xs uppercase tracking-widest text-[#1E2737] transition-colors hover:text-[#1969B5]"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#1969B5] text-[9px] font-medium text-white animate-scale-in">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>

            {/* Mobile cart */}
            <Link href="/checkout" className="relative lg:hidden">
              <svg className="h-5 w-5 text-[#1E2737]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1969B5] text-[9px] font-medium text-white">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-[#1E2737] lg:hidden"
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-[#E8E8E8] bg-white px-6 py-6 lg:hidden">
            <Link href="/" className="block py-3 text-xs uppercase tracking-widest text-[#1E2737]" onClick={() => setMobileOpen(false)}>Home</Link>
            <p className="mt-4 mb-1 text-[10px] uppercase tracking-widest text-[#7A8EA6]">Shop</p>
            {shopLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block py-2.5 pl-3 text-xs tracking-wide text-[#334155] hover:text-[#1E2737]" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="mt-4 border-t border-[#E8E8E8] pt-4">
              <Link href="/contact" className="block py-3 text-xs uppercase tracking-widest text-[#1E2737]" onClick={() => setMobileOpen(false)}>Contact</Link>
              <Link href="/auth" className="block py-3 text-xs uppercase tracking-widest text-[#1E2737]" onClick={() => setMobileOpen(false)}>Account</Link>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
