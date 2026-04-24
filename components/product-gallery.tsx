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

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center bg-[#EDE8DD] text-sm text-[#9A9080]">
        No image available
      </div>
    )
  }

  const current = images[active]!

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div
        className={`relative aspect-square overflow-hidden bg-[#EDE8DD] cursor-zoom-in ${zoomed ? 'cursor-zoom-out' : ''}`}
        onClick={() => setZoomed(!zoomed)}
      >
        <Image
          src={current.url}
          alt={current.alt || productName}
          fill
          className={`object-cover transition-transform duration-500 ${zoomed ? 'scale-150' : 'scale-100'}`}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-[#1C1C1C]/60 px-2.5 py-1 text-[10px] uppercase tracking-widest text-white backdrop-blur-sm">
            {active + 1} / {images.length}
          </div>
        )}

        {/* Prev/Next arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setActive((active - 1 + images.length) % images.length) }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 text-[#1C1C1C] shadow backdrop-blur-sm transition-all hover:bg-white"
              aria-label="Previous image"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setActive((active + 1) % images.length) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 text-[#1C1C1C] shadow backdrop-blur-sm transition-all hover:bg-white"
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
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative aspect-square overflow-hidden bg-[#EDE8DD] transition-all duration-200 ${
                i === active
                  ? 'ring-2 ring-[#1C1C1C] ring-offset-1'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${productName} view ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
