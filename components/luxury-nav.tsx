'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/components/cart-provider'

const shopLinks = [
  { label: 'All Products', href: '/category/all' },
  { label: 'Bags', href: '/category/bags' },
  { label: 'Wallets', href: '/category/wallets' },
  { label: 'Belts', href: '/category/belts' },
  { label: 'Card Holders', href: '/category/cardholder' },
  { label: 'Ladies', href: '/category/ladies' },
]

export default function LuxuryNav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { count } = useCart()

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">

        {/* ── Desktop pill ─────────────────────────────────────── */}
        <nav className="hidden lg:flex items-center gap-7 rounded-full border border-[#E5DFD6] bg-[#F2EFE8]/95 px-8 py-2.5 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-[12px] tracking-wide text-[#111111] transition-colors hover:text-[#9B6F47]">Home</Link>
            <div className="group relative">
              <button className="flex items-center gap-1 text-[12px] tracking-wide text-[#111111] transition-colors hover:text-[#9B6F47]">
                Shop
                <svg className="h-2.5 w-2.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="invisible absolute left-0 top-full mt-3 min-w-[170px] rounded-2xl border border-[#E5DFD6] bg-[#F2EFE8] py-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
                {shopLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block px-5 py-2.5 text-[12px] tracking-wide text-[#111111] transition-colors hover:text-[#9B6F47]">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="h-4 w-px bg-[#E5DFD6]" />
          <Link href="/" className="text-[13px] font-medium uppercase text-[#111111] transition-colors hover:text-[#9B6F47]" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.16em' }}>
            Taaron
          </Link>
          <div className="h-4 w-px bg-[#E5DFD6]" />
          <div className="flex items-center gap-6">
            <Link href="/auth" className="text-[12px] tracking-wide text-[#111111] transition-colors hover:text-[#9B6F47]">Account</Link>
            <Link href="/checkout" className="text-[12px] tracking-wide text-[#111111] transition-colors hover:text-[#9B6F47]">
              {count > 0 ? `Cart (${count})` : 'Cart'}
            </Link>
          </div>
        </nav>

        {/* ── Mobile pill ──────────────────────────────────────── */}
        <div className="flex w-full items-center justify-between rounded-full border border-[#E5DFD6] bg-[#F2EFE8]/95 px-5 py-3 shadow-sm backdrop-blur-md lg:hidden">
          <Link href="/" className="text-[13px] font-medium uppercase text-[#111111]" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.14em' }}>
            Taaron
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/checkout" className="relative flex items-center gap-1.5 text-[12px] tracking-wide text-[#111111]" aria-label="Cart">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
              </svg>
              {count > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#9B6F47] text-[9px] font-semibold text-white">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#E5DFD6]"
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-[#F7F4EF] pt-[72px] lg:hidden">

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto px-6 py-2">
            <Link href="/" className="flex items-center border-b border-[#E5DFD6] py-5 text-[13px] uppercase tracking-widest text-[#111111]" onClick={() => setMobileOpen(false)}>
              Home
            </Link>

            <div className="border-b border-[#E5DFD6] py-5">
              <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#9E9690]">Shop</p>
              {shopLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center py-3 text-[15px] text-[#111111] active:text-[#9B6F47]"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <Link href="/contact" className="flex items-center border-b border-[#E5DFD6] py-5 text-[13px] uppercase tracking-widest text-[#111111]" onClick={() => setMobileOpen(false)}>Contact</Link>
            <Link href="/auth" className="flex items-center py-5 text-[13px] uppercase tracking-widest text-[#111111]" onClick={() => setMobileOpen(false)}>Account</Link>
          </nav>

          {/* Contact info at bottom — matching reference */}
          <div className="flex-shrink-0 space-y-2 px-4 pb-8 pt-2">
            {/* Phone card */}
            <div className="rounded-full border border-[#E5DFD6] bg-white px-6 py-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#9E9690]">WhatsApp / Phone</p>
              <a href="tel:+8801XXXXXXXXX" className="mt-1 block text-[17px] font-medium text-[#111111]">
                +880 1XXX-XXXXXX
              </a>
              <p className="mt-0.5 text-[11px] text-[#9B6F47]">Sun – Thu, 10am – 7pm BST</p>
            </div>

            {/* Social card */}
            <div className="rounded-full border border-[#E5DFD6] bg-white px-6 py-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#9E9690]">Follow Us</p>
              <div className="mt-2 flex items-center gap-4">
                <a href="https://www.facebook.com/taaron.store" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-[#5C5652] transition-colors hover:text-[#111111]">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/taaron.store" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#5C5652] transition-colors hover:text-[#111111]">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@taaron.store" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-[#5C5652] transition-colors hover:text-[#111111]">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.22 8.22 0 0 0 4.84 1.56V6.82a4.85 4.85 0 0 1-1.07-.13Z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>
      )}
    </>
  )
}
