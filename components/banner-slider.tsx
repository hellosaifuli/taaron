'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1800&q=90',
    tag: 'New Season',
    title: 'Crafted for\nthe Discerning',
    subtitle: 'Premium leather goods built to last a lifetime.',
    cta: 'Explore Collection',
    href: '/?category=all',
  },
  {
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1800&q=90',
    tag: 'Ladies Collection',
    title: 'Quiet Luxury,\nEvery Day',
    subtitle: 'Artisanal bags that elevate the everyday.',
    cta: 'Shop Ladies',
    href: '/?category=ladies',
  },
  {
    image: 'https://images.unsplash.com/photo-1627123424574-724758594785?w=1800&q=90',
    tag: 'Essentials',
    title: 'Details That\nDefine You',
    subtitle: 'Slim wallets and cardholders for the modern professional.',
    cta: 'Shop Essentials',
    href: '/?category=wallets',
  },
]

export default function BannerSlider() {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [transitioning, setTransitioning] = useState(false)

  const goTo = (idx: number) => {
    if (idx === current || transitioning) return
    setTransitioning(true)
    setPrev(current)
    setTimeout(() => {
      setCurrent(idx)
      setPrev(null)
      setTransitioning(false)
    }, 700)
  }

  useEffect(() => {
    const t = setInterval(() => goTo((current + 1) % slides.length), 6000)
    return () => clearInterval(t)
  }, [current, transitioning])

  const slide = slides[current]!

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Bg images */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
          {/* Layered overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative flex h-full flex-col justify-end pb-24 pl-8 pr-8 lg:pl-20">
        <div
          className={`max-w-xl transition-all duration-700 ${transitioning ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}
        >
          <p className="mb-4 text-[10px] uppercase tracking-[0.4em] text-white/60">
            {slide.tag}
          </p>
          <h1 className="font-serif text-5xl font-medium leading-tight text-white sm:text-6xl lg:text-7xl" style={{ fontFamily: 'var(--font-serif)', whiteSpace: 'pre-line' }}>
            {slide.title}
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-white/60 sm:text-base">
            {slide.subtitle}
          </p>
          <div className="mt-8 flex items-center gap-6">
            <Link
              href={slide.href}
              className="group inline-flex items-center gap-3 border border-white/40 px-8 py-3.5 text-[11px] uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white hover:text-[#1C1C1C]"
            >
              {slide.cta}
              <svg className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 right-8 flex flex-col items-end gap-3 lg:bottom-12 lg:right-12">
          <p className="text-[10px] uppercase tracking-widest text-white/40">
            {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </p>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-px transition-all duration-500 ${i === current ? 'w-12 bg-white' : 'w-4 bg-white/30 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
