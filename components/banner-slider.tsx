'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1600&q=80',
    tag: 'New Collection',
    title: 'Shine with Every Step',
    subtitle: 'Modern elegance. Everyday luxury. Crafted for those who move with purpose.',
    cta: 'Shop Now',
    href: '/?category=all',
  },
  {
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1600&q=80',
    tag: 'Ladies Collection',
    title: 'Carry Confidence',
    subtitle: 'Luxurious bags crafted from premium leather. Made to impress, built to last.',
    cta: 'Shop Ladies Bags',
    href: '/?category=ladies',
  },
  {
    image: 'https://images.unsplash.com/photo-1627123424574-724758594785?w=1600&q=80',
    tag: 'Accessories',
    title: 'Details Matter',
    subtitle: 'Premium wallets and card holders. Compact elegance for the modern professional.',
    cta: 'Shop Wallets',
    href: '/?category=wallets',
  },
]

export default function BannerSlider() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length)
        setAnimating(false)
      }, 400)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (idx: number) => {
    if (idx === current) return
    setAnimating(true)
    setTimeout(() => {
      setCurrent(idx)
      setAnimating(false)
    }, 400)
  }

  const slide = slides[current]!

  return (
    <section className="relative h-[520px] overflow-hidden sm:h-[600px]">
      {/* Background image */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${animating ? 'opacity-0' : 'opacity-100'}`}
      >
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div
        className={`relative flex h-full flex-col items-center justify-center px-6 text-center text-white transition-all duration-500 ${animating ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'}`}
      >
        <p className="text-xs uppercase tracking-[0.3em] text-white/70">{slide.tag}</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-light tracking-tight sm:text-6xl">{slide.title}</h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-white/70">{slide.subtitle}</p>
        <Link
          href={slide.href}
          className="mt-8 inline-block border border-white px-8 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black"
        >
          {slide.cta}
        </Link>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'}`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
        aria-label="Previous slide"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => goTo((current + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
        aria-label="Next slide"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  )
}
