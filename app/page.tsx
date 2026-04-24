import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import BannerSlider from '@/components/banner-slider'
import LuxuryNav from '@/components/luxury-nav'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Taaron — Everyday Elegance',
  description: 'Premium leather goods. Artisanal craftsmanship, minimalist design.',
}

interface Product {
  id: string
  name: string
  price: number
  image_url: string | null
  thumbnail_url: string | null
}

const categories = [
  { name: 'Bags & Backpacks', slug: 'bags', image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80', span: 'lg:col-span-2 lg:row-span-2' },
  { name: 'Wallets', slug: 'wallets', image: 'https://images.unsplash.com/photo-1627123424574-724758594785?w=800&q=80', span: '' },
  { name: 'Belts', slug: 'belts', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', span: '' },
  { name: 'Ladies Bags', slug: 'ladies', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80', span: 'lg:col-span-2' },
  { name: 'Card Holders', slug: 'cardholder', image: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=800&q=80', span: '' },
]

const pillars = [
  {
    number: '01',
    title: 'Full-Grain Leather',
    body: 'We source only top-tier hides that develop a rich patina over time — your piece becomes more beautiful with every use.',
  },
  {
    number: '02',
    title: 'Artisanal Craft',
    body: 'Hand-stitched edges, burnished corners, and precision hardware. Each detail is intentional, each seam built to last decades.',
  },
  {
    number: '03',
    title: 'Quiet Luxury',
    body: 'No logos, no noise. Just honest materials, clean lines, and the confidence of owning something truly well-made.',
  },
]

export default async function Home() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, image_url, thumbnail_url')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(8)

  return (
    <div className="bg-[#F4F0E6] text-[#1C1C1C]">
      <LuxuryNav />

      {/* Hero */}
      <BannerSlider />

      {/* Marquee strip */}
      <div className="overflow-hidden border-y border-[#E0DAD0] bg-[#1C1C1C] py-3.5">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mx-10 text-[10px] uppercase tracking-[0.35em] text-[#B8962E]">
              Modern Elegance • Everyday Luxury • Durable Craftsmanship • Authentic Simplicity • Artisanal Quality
            </span>
          ))}
        </div>
      </div>

      {/* Brand manifesto */}
      <section className="grid lg:grid-cols-2">
        <div className="flex flex-col justify-center px-10 py-20 lg:px-20 lg:py-28">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#B8962E]">Our Philosophy</p>
          <h2 className="mt-5 font-serif text-4xl font-medium leading-tight lg:text-5xl" style={{ fontFamily: 'var(--font-serif)' }}>
            Leather that tells<br />
            <em>your</em> story.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-loose text-[#6B6561]">
            At Taaron, we believe that what you carry should reflect who you are. Inspired by the stars — symbols of guidance and timeless elegance — our goods are built to age beautifully, developing a unique character with every day you carry them.
          </p>
          <p className="mt-4 max-w-md text-sm leading-loose text-[#6B6561]">
            We create premium leather goods for professionals and creatives who appreciate slow fashion, artisanal craftsmanship, and functional luxury — without the heavy price tag.
          </p>
          <Link
            href="/?category=all"
            className="mt-10 inline-flex w-fit items-center gap-3 border border-[#1C1C1C] px-8 py-3.5 text-[11px] uppercase tracking-widest text-[#1C1C1C] transition-all hover:bg-[#1C1C1C] hover:text-[#F4F0E6]"
          >
            Shop Collection
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="relative aspect-[4/5] lg:aspect-auto">
          <Image
            src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1000&q=85"
            alt="Taaron leather craft"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-[#1C1C1C]/10" />
        </div>
      </section>

      {/* Shop by Category */}
      <section className="px-6 py-20 lg:px-12 lg:py-28">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#B8962E]">Explore</p>
            <h2 className="mt-3 font-serif text-3xl font-medium lg:text-4xl" style={{ fontFamily: 'var(--font-serif)' }}>
              Shop by Category
            </h2>
          </div>
          <Link href="/?category=all" className="text-[11px] uppercase tracking-widest text-[#6B6561] underline-offset-4 hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:grid-rows-2 lg:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/?category=${cat.slug}`}
              className={`group relative overflow-hidden ${cat.span} ${cat.span.includes('row-span-2') ? 'aspect-auto min-h-[400px]' : 'aspect-[3/4]'}`}
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/80 via-[#1C1C1C]/20 to-transparent transition-opacity duration-300 group-hover:from-[#1C1C1C]/90" />
              <div className="absolute bottom-0 left-0 p-5">
                <p className="font-serif text-lg font-medium text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                  {cat.name}
                </p>
                <p className="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/50 transition-all duration-300 group-hover:text-white/80">
                  Shop Now
                  <svg className="h-3 w-3 translate-x-0 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Craftsmanship pillars */}
      <section className="border-y border-[#E0DAD0] bg-[#1C1C1C] px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-16 text-center">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#B8962E]">Why Taaron</p>
            <h2 className="mt-4 font-serif text-3xl font-medium text-[#F4F0E6] lg:text-4xl" style={{ fontFamily: 'var(--font-serif)' }}>
              Built Different
            </h2>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.number} className="group">
                <p className="font-serif text-5xl font-medium text-[#B8962E]/30 transition-colors duration-300 group-hover:text-[#B8962E]/60" style={{ fontFamily: 'var(--font-serif)' }}>
                  {p.number}
                </p>
                <h3 className="mt-4 text-sm font-semibold uppercase tracking-widest text-[#F4F0E6]">
                  {p.title}
                </h3>
                <div className="mt-3 h-px w-8 bg-[#B8962E]" />
                <p className="mt-4 text-sm leading-loose text-[#9A9080]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#B8962E]">Featured</p>
              <h2 className="mt-3 font-serif text-3xl font-medium lg:text-4xl" style={{ fontFamily: 'var(--font-serif)' }}>
                New Arrivals
              </h2>
            </div>
            <Link href="/?category=all" className="text-[11px] uppercase tracking-widest text-[#6B6561] underline-offset-4 hover:underline">
              View All →
            </Link>
          </div>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {(products as Product[]).map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="group">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#EDE8DD]">
                    {product.image_url || product.thumbnail_url ? (
                      <Image
                        src={product.image_url || product.thumbnail_url || ''}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-[#9A9080]">No image</div>
                    )}
                    {/* Quick view overlay */}
                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[#1C1C1C]/90 py-3 text-center text-[10px] uppercase tracking-widest text-white transition-transform duration-300 group-hover:translate-y-0">
                      View Product
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-[#1C1C1C]">{product.name}</h3>
                    <p className="mt-1 text-sm font-light text-[#B8962E]">৳{product.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center text-sm text-[#9A9080]">
              No products available yet.
            </div>
          )}
        </div>
      </section>

      {/* Full-bleed CTA */}
      <section className="relative h-80 overflow-hidden lg:h-96">
        <Image
          src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1600&q=80"
          alt="Taaron craftsmanship"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#1C1C1C]/65" />
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#B8962E]">Taaron Promise</p>
          <h2 className="mt-4 font-serif text-3xl font-medium text-white lg:text-4xl" style={{ fontFamily: 'var(--font-serif)' }}>
            Premium quality.<br />Accessible price.
          </h2>
          <Link
            href="/?category=all"
            className="mt-8 inline-block border border-white px-10 py-3.5 text-[11px] uppercase tracking-widest text-white transition-all hover:bg-white hover:text-[#1C1C1C]"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Marquee bottom */}
      <div className="overflow-hidden border-y border-[#E0DAD0] bg-[#F4F0E6] py-3">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mx-10 text-[10px] uppercase tracking-[0.35em] text-[#6B6561]">
              Free Shipping on Orders Over ৳3000 • Handcrafted in Bangladesh • 30-Day Returns • Lifetime Craftsmanship Guarantee
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="overflow-hidden border-y border-[#E0DAD0] bg-white py-3">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="mx-8 text-xs uppercase tracking-widest text-[#6B6561]">
              Modern Elegance • Everyday Luxury • Durable Craftsmanship • Authentic Simplicity
            </span>
          ))}
        </div>
      </div>

      <footer className="bg-[#e8e9e2]">
        <div className="relative px-8 pt-16 pb-8">
          <p className="max-w-xs text-sm leading-relaxed text-[#1e2235]/70">
            At Taaron, We create luxurious, durable leather wallets, bags, and belts so you carry
            confidence and style without the heavy price tag.
          </p>
          <div className="mt-8 flex items-center justify-center pb-8">
            <Image
              src="/taaron-logo.png"
              alt="Taaron"
              width={1200}
              height={220}
              className="w-full max-w-5xl object-contain"
              priority={false}
            />
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-[#1e2235]/10 px-8 py-4">
          <p className="text-xs text-[#1e2235]/60">© 2026 Taaron (তারণ)</p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Facebook" className="text-[#1e2235]/50 transition-colors hover:text-[#1e2235]">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" aria-label="Instagram" className="text-[#1e2235]/50 transition-colors hover:text-[#1e2235]">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="#" aria-label="YouTube" className="text-[#1e2235]/50 transition-colors hover:text-[#1e2235]">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="#" aria-label="TikTok" className="text-[#1e2235]/50 transition-colors hover:text-[#1e2235]">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
