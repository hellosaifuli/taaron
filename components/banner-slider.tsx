'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'

const arches = [
  { image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&q=85', alt: 'Taaron leather bags', label: 'Bags', href: '/category/bags' },
  { image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&q=85', alt: 'Taaron ladies collection', label: 'Ladies', href: '/category/ladies' },
  { image: 'https://images.unsplash.com/photo-1627123424574-724758594785?w=1200&q=85', alt: 'Taaron wallets', label: 'Wallets', href: '/category/wallets' },
]

export default function BannerSlider() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth)
      setActive(Math.max(0, Math.min(arches.length - 1, idx)))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (i: number) => {
    const el = containerRef.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <section className="relative flex h-svh min-h-[580px] flex-col bg-[#F7F4EF]">

      {/* Headline */}
      <div className="flex-shrink-0 px-4 pb-4 pt-[88px] text-center sm:pb-6 sm:pt-[92px]">
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.4rem, 3vw, 3rem)',
            lineHeight: '1.2',
            letterSpacing: '-0.01em',
            color: '#111111',
            fontWeight: 400,
          }}
        >
          Quiet Luxury, Every Day
        </h1>
      </div>

      {/* Arch panels — mobile: scroll-snap single; desktop: 3 equal */}
      <div
        ref={containerRef}
        className="flex flex-1 snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-3 pb-3 lg:overflow-visible lg:snap-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {arches.map((arch, i) => (
          <Link
            key={i}
            href={arch.href}
            className="group relative flex-shrink-0 snap-center bg-[#EDE9E3] w-[calc(100vw-24px)] lg:w-auto lg:flex-1"
            style={{ borderTopLeftRadius: '9999px', borderTopRightRadius: '9999px' }}
          >
            {/* Inner clip — overflow-hidden must be on a child to clip scale transforms */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ borderTopLeftRadius: '9999px', borderTopRightRadius: '9999px' }}
            >
              <Image
                src={arch.image}
                alt={arch.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 33vw"
                priority={i === 0}
              />
            </div>
            {/* Category pill */}
            <div className="absolute inset-x-0 bottom-5 flex justify-center">
              <span className="rounded-full bg-black/40 px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-black/60">
                {arch.label}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Swipe dots — mobile only */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 lg:hidden">
        {arches.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Go to ${arches[i]?.label}`}
            className={`h-1 rounded-full transition-all duration-300 ${
              active === i ? 'w-6 bg-[#111111]' : 'w-2 bg-[#111111]/25'
            }`}
          />
        ))}
      </div>

    </section>
  )
}
