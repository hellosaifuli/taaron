'use client'

import { useState } from 'react'
import Image from 'next/image'

interface GalleryImage {
  url: string
  alt: string
}

interface ProductGalleryProps {
  images: GalleryImage[]
  productName: string
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [active, setActive] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [prev, setPrev] = useState<number | null>(null)
  const [dir, setDir] = useState<'left' | 'right'>('right')

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center bg-[#EEF2F7] text-sm text-[#7A8EA6]">
        No image available
      </div>
    )
  }

  const navigate = (nextIdx: number) => {
    if (nextIdx === active) return
    setDir(nextIdx > active ? 'right' : 'left')
    setPrev(active)
    setActive(nextIdx)
    setTimeout(() => setPrev(null), 500)
  }

  const current = images[active]!

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className={`relative aspect-[4/5] overflow-hidden bg-[#EEF2F7] ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
        onClick={() => setZoomed((z) => !z)}
      >
        {/* Current image */}
        <Image
          src={current.url}
          alt={current.alt || productName}
          fill
          className={`object-cover transition-all duration-500 ${
            zoomed ? 'scale-150' : 'scale-100'
          } ${prev !== null ? (dir === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left') : ''}`}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />

        {/* Previous image fading out */}
        {prev !== null && images[prev] && (
          <Image
            src={images[prev].url}
            alt={images[prev]?.alt || productName}
            fill
            className={`object-cover transition-opacity duration-500 opacity-0`}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        )}

        {/* Zoom hint */}
        {!zoomed && (
          <div className="absolute right-3 top-3 bg-[#1E2737]/50 px-2 py-1 text-[9px] uppercase tracking-widest text-white backdrop-blur-sm opacity-0 transition-opacity duration-300 hover:opacity-100 group-hover:opacity-100">
            Click to zoom
          </div>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-[#1E2737]/60 px-2.5 py-1 text-[10px] uppercase tracking-widest text-white backdrop-blur-sm">
            {active + 1} / {images.length}
          </div>
        )}

        {/* Prev / Next */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); navigate((active - 1 + images.length) % images.length) }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 text-[#1E2737] shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-md"
              aria-label="Previous image"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigate((active + 1) % images.length) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 text-[#1E2737] shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-md"
              aria-label="Next image"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => navigate(i)}
              aria-label={`View image ${i + 1}`}
              className={`group relative aspect-square overflow-hidden bg-[#EEF2F7] transition-all duration-300 ${
                i === active
                  ? 'ring-1 ring-[#1E2737] ring-offset-2'
                  : 'opacity-50 hover:opacity-90'
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${productName} view ${i + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Dot indicators (mobile) */}
      {images.length > 1 && (
        <div className="flex justify-center gap-1.5 lg:hidden">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => navigate(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === active ? 'w-6 bg-[#1E2737]' : 'w-2 bg-[#CBD5E1]'
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
