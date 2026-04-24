import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  price: number
  image_url: string | null
  thumbnail_url: string | null
}

export const metadata = {
  title: 'Taaron - Shine with Every Step',
  description: 'Luxurious leather wallets, bags, and belts. Modern elegance, everyday luxury.',
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
    <div className="w-full bg-white">
      {/* Header */}
      <header className="border-b border-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="text-lg font-semibold tracking-wider">
              TAARON
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-8 md:flex">
              <Link href="/" className="text-sm hover:text-gray-600">
                Home
              </Link>
              <div className="group relative">
                <button className="text-sm hover:text-gray-600">Shop</button>
                <div className="absolute left-0 hidden w-48 bg-white shadow-lg group-hover:block">
                  <Link href="/?category=bags" className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Bags & Backpacks
                  </Link>
                  <Link href="/?category=belts" className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Belts
                  </Link>
                  <Link href="/?category=wallets" className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Wallets
                  </Link>
                  <Link href="/?category=cardholder" className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Card Holders
                  </Link>
                  <Link href="/?category=ladies" className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Ladies Bags
                  </Link>
                  <Link href="/?category=combos" className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Gift Combos
                  </Link>
                </div>
              </div>
              <Link href="/" className="text-sm hover:text-gray-600">
                Our Story
              </Link>
              <Link href="/" className="text-sm hover:text-gray-600">
                Help & Contact
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
              <input
                type="text"
                placeholder="Search..."
                className="hidden w-32 border-b border-gray-300 bg-white px-2 py-1 text-sm outline-none md:block"
              />
              <Link href="/dashboard" className="text-sm hover:text-gray-600">
                Account
              </Link>
              <Link href="/checkout" className="text-sm hover:text-gray-600">
                Cart
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative h-96 bg-gray-900 sm:h-[500px]">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="text-center text-white">
            <p className="text-sm tracking-widest uppercase">Explore Our Collection</p>
            <h1 className="mt-4 text-4xl font-light sm:text-5xl">Shine with Every Step</h1>
            <p className="mt-4 text-sm text-gray-300">
              Modern Elegance • Everyday Luxury • Durable Craftsmanship
            </p>
            <Link
              href="/?shop=true"
              className="mt-8 inline-block border-2 border-white px-8 py-3 text-sm font-medium hover:bg-white hover:text-gray-900"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-light">Featured Products</h2>
        <p className="mt-2 text-sm text-gray-600">Luxurious leather products for everyday elegance</p>

        {products && products.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(products as Product[]).map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group"
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  {product.image_url || product.thumbnail_url ? (
                    <Image
                      src={product.image_url || product.thumbnail_url || ''}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="h-full w-full object-cover transition-opacity group-hover:opacity-75"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium">{product.name}</h3>
                  <p className="mt-2 text-lg font-semibold">
                    Tk {product.price.toLocaleString()}
                  </p>
                  <button className="mt-3 w-full border-b-2 border-gray-900 py-2 text-sm hover:bg-gray-50">
                    Add
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center text-gray-600">
            No products available yet
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="font-semibold">Company</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/" className="hover:text-gray-900">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-gray-900">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-gray-900">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Help</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/" className="hover:text-gray-900">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-gray-900">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-gray-900">
                    Size Guide
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Follow Us</h3>
              <div className="mt-4 flex gap-4 text-sm">
                <a href="#" className="hover:text-gray-600">
                  Facebook
                </a>
                <a href="#" className="hover:text-gray-600">
                  Instagram
                </a>
                <a href="#" className="hover:text-gray-600">
                  YouTube
                </a>
                <a href="#" className="hover:text-gray-600">
                  TikTok
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2024 Taaron. Shine with Every Step. COD & bKash Available.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
