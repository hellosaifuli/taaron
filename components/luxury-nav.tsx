'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const shopLinks = [
  { label: 'All Products', href: '/?category=all' },
  { label: 'New Arrivals', href: '/?category=new-arrivals' },
  { label: 'Bags & Backpacks', href: '/?category=bags' },
  { label: 'Belts', href: '/?category=belts' },
  { label: 'Card Holders', href: '/?category=cardholder' },
  { label: 'Ladies Bags', href: '/?category=ladies' },
  { label: 'Wallets', href: '/?category=wallets' },
]

export default function LuxuryNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#F4F0E6]/95 shadow-sm backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4 lg:px-12">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/taaron-logo.png"
              alt="Taaron"
              width={130}
              height={40}
              className={`h-8 w-auto object-contain transition-all duration-500 ${scrolled ? '' : 'brightness-0 invert'}`}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-10 lg:flex">
            <Link
              href="/"
              className={`text-xs uppercase tracking-widest transition-colors ${scrolled ? 'text-[#1C1C1C] hover:text-[#B8962E]' : 'text-white/80 hover:text-white'}`}
            >
              Home
            </Link>

            {/* Shop Dropdown */}
            <div className="group relative">
              <button
                className={`flex items-center gap-1 text-xs uppercase tracking-widest transition-colors ${scrolled ? 'text-[#1C1C1C] hover:text-[#B8962E]' : 'text-white/80 hover:text-white'}`}
              >
                Shop
                <svg className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="invisible absolute left-1/2 top-full mt-4 w-52 -translate-x-1/2 origin-top scale-95 border border-[#E0DAD0] bg-[#F4F0E6] py-3 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:scale-100 group-hover:opacity-100">
                {shopLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-5 py-2 text-xs uppercase tracking-wider text-[#4A4A4A] transition-colors hover:bg-[#EDE8DD] hover:text-[#1C1C1C]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/contact"
              className={`text-xs uppercase tracking-widest transition-colors ${scrolled ? 'text-[#1C1C1C] hover:text-[#B8962E]' : 'text-white/80 hover:text-white'}`}
            >
              Contact
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-6">
            <Link
              href="/auth"
              className={`hidden text-xs uppercase tracking-widest transition-colors lg:block ${scrolled ? 'text-[#1C1C1C] hover:text-[#B8962E]' : 'text-white/80 hover:text-white'}`}
            >
              Account
            </Link>
            <Link
              href="/checkout"
              className={`hidden text-xs uppercase tracking-widest transition-colors lg:block ${scrolled ? 'text-[#1C1C1C] hover:text-[#B8962E]' : 'text-white/80 hover:text-white'}`}
            >
              Cart (0)
            </Link>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden ${scrolled ? 'text-[#1C1C1C]' : 'text-white'}`}
              aria-label="Menu"
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
          <div className="border-t border-[#E0DAD0] bg-[#F4F0E6] px-6 py-6 lg:hidden">
            <Link href="/" className="block py-3 text-xs uppercase tracking-widest text-[#1C1C1C]" onClick={() => setMobileOpen(false)}>Home</Link>
            <p className="mt-3 text-[10px] uppercase tracking-widest text-[#9A9080]">Shop</p>
            {shopLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block py-2 pl-3 text-xs tracking-wide text-[#4A4A4A]" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href="/contact" className="mt-3 block py-3 text-xs uppercase tracking-widest text-[#1C1C1C]" onClick={() => setMobileOpen(false)}>Contact</Link>
            <Link href="/auth" className="block py-3 text-xs uppercase tracking-widest text-[#1C1C1C]" onClick={() => setMobileOpen(false)}>Account</Link>
            <Link href="/checkout" className="block py-3 text-xs uppercase tracking-widest text-[#1C1C1C]" onClick={() => setMobileOpen(false)}>Cart</Link>
          </div>
        )}
      </header>
    </>
  )
}
