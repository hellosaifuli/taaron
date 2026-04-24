import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import BannerSlider from '@/components/banner-slider'
import Script from 'next/script'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Taaron — Premium Leather Goods | Everyday Elegance',
  description:
    'Taaron crafts premium leather wallets, bags, and belts in Bangladesh. Artisanal craftsmanship, minimalist design, modern luxury. COD & bKash available.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Taaron — Premium Leather Goods',
    description: 'Premium leather wallets, bags, and belts. Artisanal craftsmanship meets minimalist design.',
    type: 'website',
  },
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
  { number: '01', title: 'Full-Grain Leather', body: 'We source only top-tier hides that develop a rich patina over time — your piece becomes more beautiful with every use.' },
  { number: '02', title: 'Artisanal Craft', body: 'Hand-stitched edges, burnished corners, and precision hardware. Each detail is intentional, each seam built to last decades.' },
  { number: '03', title: 'Quiet Luxury', body: 'No logos, no noise. Just honest materials, clean lines, and the confidence of owning something truly well-made.' },
]

const faqs = [
  {
    q: 'What materials does Taaron use for its leather goods?',
    a: 'Taaron uses full-grain and top-grain leather sourced from quality tanneries. Our hides are selected for their natural texture, durability, and ability to develop a unique patina over time.',
  },
  {
    q: 'Does Taaron offer Cash on Delivery (COD) in Bangladesh?',
    a: 'Yes, Taaron offers Cash on Delivery (COD) across Bangladesh. We also accept bKash for convenient mobile payments.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery within Dhaka takes 1–2 business days. Outside Dhaka, expect 3–5 business days via courier.',
  },
  {
    q: 'Can I return a product if I am not satisfied?',
    a: 'Yes. Taaron offers a 30-day return policy on all items in original, unused condition. Contact us and we will arrange a hassle-free return or exchange.',
  },
  {
    q: 'How do I care for my Taaron leather product?',
    a: 'Keep leather away from direct sunlight and moisture. Apply a quality leather conditioner every 3–6 months to maintain suppleness. Wipe clean with a dry or slightly damp cloth — never soak.',
  },
  {
    q: 'Are Taaron products handmade?',
    a: 'Yes. Each Taaron product is handcrafted with artisanal techniques including hand-stitching, edge burnishing, and careful finishing. Small production batches ensure consistent quality.',
  },
]

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000'

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Taaron',
  alternateName: 'তারণ',
  url: baseUrl,
  logo: `${baseUrl}/taaron-logo.png`,
  description: 'Premium leather goods brand from Bangladesh. Artisanal craftsmanship, minimalist design, everyday elegance.',
  foundingLocation: { '@type': 'Place', name: 'Bangladesh' },
  sameAs: ['https://www.facebook.com/taaron', 'https://www.instagram.com/taaron'],
  contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', availableLanguage: ['English', 'Bengali'] },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Taaron',
  url: baseUrl,
  description: 'Premium leather wallets, bags, and belts. COD & bKash in Bangladesh.',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${baseUrl}/?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default async function Home() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, image_url, thumbnail_url')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(8)

  return (
    <>
      {/* JSON-LD Schemas */}
      <Script id="org-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <Script id="website-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="bg-[#F4F0E6] text-[#1C1C1C]">
        {/* Hero */}
        <BannerSlider />

        {/* New Arrivals — immediately after banner */}
        <section className="px-6 py-16 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-screen-xl">
            <div className="mb-10 flex items-end justify-between">
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
              <div className="py-24 text-center text-sm text-[#9A9080]">No products available yet.</div>
            )}
          </div>
        </section>

        {/* Shop by Category */}
        <section aria-label="Shop by Category" className="px-6 py-16 lg:px-12 lg:py-20">
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
                aria-label={`Shop ${cat.name}`}
                className={`group relative overflow-hidden ${cat.span} ${cat.span.includes('row-span-2') ? 'aspect-auto min-h-[400px]' : 'aspect-[3/4]'}`}
              >
                <Image
                  src={cat.image}
                  alt={`Taaron ${cat.name}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/80 via-[#1C1C1C]/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8962E]">Shop Now</p>
                  <p className="mt-1 font-serif text-xl font-medium text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                    {cat.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Craftsmanship pillars */}
        <section aria-label="Why Taaron" className="border-y border-[#E0DAD0] bg-[#1C1C1C] px-6 py-20 lg:px-12 lg:py-28">
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
                  <h3 className="mt-4 text-sm font-semibold uppercase tracking-widest text-[#F4F0E6]">{p.title}</h3>
                  <div className="mt-3 h-px w-8 bg-[#B8962E]" />
                  <p className="mt-4 text-sm leading-loose text-[#9A9080]">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ — AEO */}
        <section aria-label="Frequently Asked Questions" className="px-6 py-16 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#B8962E]">Help</p>
              <h2 className="mt-3 font-serif text-3xl font-medium lg:text-4xl" style={{ fontFamily: 'var(--font-serif)' }}>
                Frequently Asked Questions
              </h2>
            </div>
            <dl className="divide-y divide-[#E0DAD0]">
              {faqs.map((faq) => (
                <div key={faq.q} className="py-6">
                  <dt className="text-sm font-semibold text-[#1C1C1C]">{faq.q}</dt>
                  <dd className="mt-3 text-sm leading-loose text-[#6B6561]">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

      </div>
    </>
  )
}
