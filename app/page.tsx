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
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-semibold uppercase tracking-widest">
            Taaron
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {['Bags', 'Belts', 'Wallets', 'Shop All'].map((item) => (
              <Link
                key={item}
                href={`/?category=${item.toLowerCase().replace(' ', '-')}`}
                className="text-sm text-neutral-600 transition-colors hover:text-black"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <Link href="/auth" className="text-sm text-neutral-600 transition-colors hover:text-black">
              Account
            </Link>
            <Link href="/checkout" className="relative text-sm text-neutral-600 transition-colors hover:text-black">
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
          href="/?shop=true"
          className="mt-8 inline-block bg-white px-8 py-3 text-xs font-semibold uppercase tracking-widest text-black transition-opacity hover:opacity-80"
        >
          Shop Now
        </Link>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-screen-2xl px-6 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-light tracking-tight">Featured Products</h2>
            <p className="mt-1 text-sm text-neutral-500">Curated selection of our finest pieces</p>
          </div>
          <Link href="/?shop=true" className="text-xs uppercase tracking-widest text-neutral-500 transition-colors hover:text-black">
            View All →
          </Link>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(products as Product[]).map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group">
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
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
                  <div>
                    <h3 className="text-sm font-medium">{product.name}</h3>
                  </div>
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
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-screen-2xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-4">
            <div className="sm:col-span-1">
              <p className="text-sm font-semibold uppercase tracking-widest">Taaron</p>
              <p className="mt-3 text-xs leading-relaxed text-neutral-500">
                Modern elegance. Everyday luxury.
              </p>
            </div>
            {[
              { title: 'Shop', links: ['Bags', 'Belts', 'Wallets', 'New Arrivals'] },
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
