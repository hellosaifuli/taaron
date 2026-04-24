import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Taaron Store',
  description: 'Luxurious leather wallets, bags, and belts. Modern elegance, everyday luxury.',
}

interface Product {
  id: string
  name: string
  price: number
  image_url: string | null
  thumbnail_url: string | null
}

const categories = [
  {
    name: 'New Arrivals',
    slug: 'new-arrivals',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
  },
  {
    name: 'Bags & Backpacks',
    slug: 'bags',
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600',
  },
  {
    name: 'Belts',
    slug: 'belts',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
  },
  {
    name: 'Card Holders',
    slug: 'cardholder',
    image: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=600',
  },
  {
    name: 'Ladies Bags',
    slug: 'ladies',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600',
  },
  {
    name: 'Wallets',
    slug: 'wallets',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594785?w=600',
  },
]

const shopLinks = [
  { label: 'All Products', href: '/?category=all' },
  { label: 'New Arrivals', href: '/?category=new-arrivals' },
  { label: 'Bags & Backpacks', href: '/?category=bags' },
  { label: 'Belts', href: '/?category=belts' },
  { label: 'Card Holders', href: '/?category=cardholder' },
  { label: 'Ladies Bags', href: '/?category=ladies' },
  { label: 'Wallets', href: '/?category=wallets' },
]

export default async function Home() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, image_url, thumbnail_url')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-semibold uppercase tracking-widest">
            Taaron
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {/* Home */}
            <Link href="/" className="text-sm text-neutral-600 transition-colors hover:text-black">
              Home
            </Link>

            {/* Shop dropdown */}
            <div className="group relative">
              <button className="flex items-center gap-1 text-sm text-neutral-600 transition-colors hover:text-black">
                Shop
                <svg className="h-3 w-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="invisible absolute left-0 top-full mt-2 w-52 origin-top-left scale-95 border border-neutral-100 bg-white py-2 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:scale-100 group-hover:opacity-100">
                {shopLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-black"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <Link href="/contact" className="text-sm text-neutral-600 transition-colors hover:text-black">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-6">
            <Link href="/auth" className="text-sm text-neutral-600 transition-colors hover:text-black">
              Account
            </Link>
            <Link href="/checkout" className="text-sm text-neutral-600 transition-colors hover:text-black">
              Cart
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-neutral-200 bg-black px-6 py-24 text-center text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">New Collection</p>
        <h1 className="mt-4 text-5xl font-light tracking-tight sm:text-6xl">Shine with Every Step</h1>
        <p className="mx-auto mt-6 max-w-md text-sm text-neutral-400">
          Modern elegance. Everyday luxury. Crafted for those who move with purpose.
        </p>
        <Link
          href="/?category=all"
          className="mt-8 inline-block bg-white px-8 py-3 text-xs font-semibold uppercase tracking-widest text-black transition-opacity hover:opacity-80"
        >
          Shop Now
        </Link>
      </section>

      {/* Shop by Category */}
      <section className="mx-auto max-w-screen-2xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Shop by Category</h2>
          <p className="mt-2 text-sm text-neutral-500">Find the perfect piece for every occasion</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/?category=${cat.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-3">
                <p className="text-sm font-semibold text-white">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="border-t border-neutral-100 bg-neutral-50 px-6 py-16">
        <div className="mx-auto max-w-screen-2xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-light tracking-tight">Featured Products</h2>
              <p className="mt-1 text-sm text-neutral-500">Curated selection of our finest pieces</p>
            </div>
            <Link href="/?category=all" className="text-xs uppercase tracking-widest text-neutral-500 transition-colors hover:text-black">
              View All →
            </Link>
          </div>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {(products as Product[]).map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="group">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100">
                    {product.image_url || product.thumbnail_url ? (
                      <Image
                        src={product.image_url || product.thumbnail_url || ''}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-start justify-between">
                    <h3 className="text-sm font-medium">{product.name}</h3>
                    <p className="text-sm font-semibold">৳{product.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center text-sm text-neutral-400">
              No products available yet.
            </div>
          )}
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-neutral-200 bg-white py-3">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="mx-8 text-xs tracking-widest text-neutral-500 uppercase">
              Modern Elegance • Everyday Luxury • Durable Craftsmanship • Authentic Simplicity
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#e8e9e2]">
        {/* Main footer body */}
        <div className="relative px-8 pt-16 pb-8">
          {/* Description top-left */}
          <p className="max-w-xs text-sm leading-relaxed text-[#1e2235]/70">
            At Taaron, We create luxurious, durable leather wallets, bags, and belts so you carry
            confidence and style without the heavy price tag.
          </p>

          {/* Large logo */}
          <div className="mt-8 flex items-center justify-center pb-8">
            <Image
              src="/taaron-logo.png"
              alt="Taaron"
              width={1200}
              height={220}
              className="w-full max-w-5xl object-contain"
              priority
            />
          </div>
        </div>

        {/* Bottom strip */}
        <div className="flex items-center justify-between border-t border-[#1e2235]/10 px-8 py-4">
          <p className="text-xs text-[#1e2235]/60">© 2026 Taaron (তারণ)</p>
          <div className="flex items-center gap-4">
            {/* Facebook */}
            <a href="#" aria-label="Facebook" className="text-[#1e2235]/50 transition-colors hover:text-[#1e2235]">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" aria-label="Instagram" className="text-[#1e2235]/50 transition-colors hover:text-[#1e2235]">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            {/* YouTube */}
            <a href="#" aria-label="YouTube" className="text-[#1e2235]/50 transition-colors hover:text-[#1e2235]">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            {/* TikTok */}
            <a href="#" aria-label="TikTok" className="text-[#1e2235]/50 transition-colors hover:text-[#1e2235]">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
