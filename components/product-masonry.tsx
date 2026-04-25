'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { fetchProducts, type Product } from '@/app/actions/products'

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
  'https://images.unsplash.com/photo-1627123424574-724758594785?w=800&q=80',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
  'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80',
]

// Bento pattern — 7 items per group, 10-col grid
// Each entry: { desktop col-span, desktop aspect class, is oval }
const PATTERN = [
  { lg: 'lg:col-span-6', aspect: 'lg:aspect-[4/5]',  oval: false }, // 0: wide portrait
  { lg: 'lg:col-span-4', aspect: 'lg:aspect-square',  oval: true  }, // 1: circle
  { lg: 'lg:col-span-3', aspect: 'lg:aspect-[3/4]',   oval: false }, // 2: small
  { lg: 'lg:col-span-4', aspect: 'lg:aspect-[3/5]',   oval: false }, // 3: tall center
  { lg: 'lg:col-span-3', aspect: 'lg:aspect-[3/4]',   oval: false }, // 4: small
  { lg: 'lg:col-span-6', aspect: 'lg:aspect-[4/3]',   oval: false }, // 5: landscape
  { lg: 'lg:col-span-4', aspect: 'lg:aspect-[3/4]',   oval: false }, // 6: portrait
]

export default function ProductMasonry({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialProducts.length === 50)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(false)
  const hasMoreRef = useRef(initialProducts.length === 50)
  const countRef = useRef(initialProducts.length)

  useEffect(() => {
    countRef.current = products.length
  }, [products.length])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const handleIntersect = async ([entry]: IntersectionObserverEntry[]) => {
      if (!entry?.isIntersecting || loadingRef.current || !hasMoreRef.current) return

      loadingRef.current = true
      setLoading(true)

      try {
        const more = await fetchProducts(countRef.current)
        const reachedEnd = more.length < 50
        hasMoreRef.current = !reachedEnd
        setHasMore(!reachedEnd)
        if (more.length > 0) {
          setProducts(prev => [...prev, ...more])
          countRef.current += more.length
        }
      } catch {
        // silently fail — user can scroll again
      } finally {
        loadingRef.current = false
        setLoading(false)
      }
    }

    const observer = new IntersectionObserver(handleIntersect, { rootMargin: '400px' })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, []) // set up once, reads live values via refs

  return (
    <div className="bg-[#F7F4EF]">
      {/* Bento grid */}
      {/* Mobile: 2 equal cols. Desktop (lg+): 10-col bento pattern with items-start */}
      <div className="grid grid-cols-1 gap-2 p-2 lg:grid-cols-10 lg:items-start lg:gap-3 lg:p-3">
        {products.map((product, idx) => {
          const pat = PATTERN[idx % 7]!
          const img =
            product.image_url ??
            product.thumbnail_url ??
            PLACEHOLDER_IMAGES[idx % PLACEHOLDER_IMAGES.length]!

          return (
            <Link
              key={`${product.id}-${idx}`}
              href={`/products/${product.id}`}
              className={[
                'group relative block overflow-hidden bg-[#EDE9E3]',
                'aspect-[3/4]',
                pat.lg,
                pat.aspect,
                pat.oval ? 'lg:rounded-full' : '',
              ].join(' ')}
            >
              <Image
                src={img}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              {/* Pill label — name + price */}
              <div className="absolute inset-x-0 bottom-3 flex justify-center px-3">
                <div className="max-w-full truncate rounded-full bg-black/50 px-5 py-2 text-center text-[13px] leading-tight text-white backdrop-blur-sm">
                  {product.name}
                  <span className="ml-2.5 opacity-70">৳{product.price.toLocaleString()}</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Sentinel + state */}
      <div ref={sentinelRef} className="flex justify-center py-12">
        {loading && (
          <div className="flex items-center gap-2">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-[#9B6F47] animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        )}
        {!hasMore && !loading && products.length > 0 && (
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#9E9690]">
            End of Collection
          </p>
        )}
      </div>
    </div>
  )
}
