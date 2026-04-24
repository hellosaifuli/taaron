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

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-screen-2xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-4">
            <div className="sm:col-span-1">
              <p className="text-sm font-semibold uppercase tracking-widest">Taaron</p>
              <p className="mt-3 text-xs leading-relaxed text-neutral-500">
                Modern elegance. Everyday luxury.
              </p>
            </div>
            {[
              { title: 'Shop', links: ['All Products', 'New Arrivals', 'Bags', 'Belts', 'Wallets'] },
              { title: 'Company', links: ['About', 'Contact', 'FAQ'] },
              { title: 'Connect', links: ['Facebook', 'Instagram', 'TikTok'] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-xs font-semibold uppercase tracking-widest">{col.title}</p>
                <ul className="mt-4 space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-xs text-neutral-500 transition-colors hover:text-black">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 border-t border-neutral-200 pt-8 text-center text-xs text-neutral-400">
            © 2024 Taaron. COD & bKash available.
          </div>
        </div>
      </footer>
    </div>
  )
}
