'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import type { Product } from '@/app/actions/products'

interface BannerSliderProps {
  featuredProducts?: Product[]
}

export default function BannerSlider({ featuredProducts = [] }: BannerSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const panels = featuredProducts.slice(0, 3).map((p) => ({
    image: p.image_url ?? p.thumbnail_url ?? '',
    alt: p.name,
    label: p.name,
    href: `/products/${p.id}`,
  }))

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth)
      setActive(Math.max(0, Math.min(panels.length - 1, idx)))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [panels.length])

  const scrollTo = (i: number) => {
    const el = containerRef.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  if (panels.length === 0) return null

  return (
    <section className="relative flex h-svh min-h-[580px] flex-col bg-[#F7F4EF]">

      {/* Headline */}
      <div className="flex-shrink-0 px-4 pb-4 pt-[88px] text-center sm:pb-6 sm:pt-[92px]">
        <p className="mb-2 text-[10px] uppercase tracking-[0.4em] text-[#9B6F47]">Crafted in Leather</p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 3.5vw, 3.4rem)',
            lineHeight: '1.15',
            letterSpacing: '-0.02em',
            color: '#111111',
            fontWeight: 400,
          }}
        >
          Everyday Elegance,{' '}
          <em style={{ fontStyle: 'italic', color: '#9B6F47' }}>Inspired by Stars</em>
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-xs leading-relaxed text-[#5C5652]">
          Luxurious leather goods built for modern life — confidence and style, without the heavy price tag.
        </p>
      </div>

      {/* Arch panels */}
      <div
        ref={containerRef}
        className="flex flex-1 snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-3 pb-3 lg:overflow-visible lg:snap-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {panels.map((panel, i) => (
          <Link
            key={i}
            href={panel.href}
            className="group relative flex-shrink-0 snap-center bg-[#EDE9E3] w-[calc(100vw-24px)] lg:w-auto lg:flex-1"
            style={{ borderTopLeftRadius: '9999px', borderTopRightRadius: '9999px' }}
          >
            {/* Inner clip */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ borderTopLeftRadius: '9999px', borderTopRightRadius: '9999px' }}
            >
              {panel.image ? (
                <Image
                  src={panel.image}
                  alt={panel.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority={i === 0}
                />
              ) : (
                <div className="h-full w-full bg-[#EDE9E3]" />
              )}
            </div>
            {/* Product name pill */}
            <div className="absolute inset-x-0 bottom-5 flex justify-center px-4">
              <span className="max-w-[80%] truncate rounded-full bg-black/40 px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-black/60 text-center">
                {panel.label}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Swipe dots — mobile only */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 lg:hidden">
        {panels.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1 rounded-full transition-all duration-300 ${
              active === i ? 'w-6 bg-[#111111]' : 'w-2 bg-[#111111]/25'
            }`}
          />
        ))}
      </div>

    </section>
  )
}
