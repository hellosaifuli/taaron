import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import BannerSlider from '@/components/banner-slider'
import FadeInSection from '@/components/fade-in-section'
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
  { name: 'Bags', slug: 'bags', image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=1200&q=90' },
  { name: 'Wallets', slug: 'wallets', image: 'https://images.unsplash.com/photo-1627123424574-724758594785?w=1200&q=90' },
  { name: 'Belts', slug: 'belts', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&q=90' },
  { name: 'Ladies', slug: 'ladies', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&q=90' },
  { name: 'Cards', slug: 'cardholder', image: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=1200&q=90' },
]

const pillars = [
  { number: '01', title: 'Full-Grain Leather', body: 'We source only top-tier hides that develop a rich patina over time — your piece becomes more beautiful with every use.' },
  { number: '02', title: 'Artisanal Craft', body: 'Hand-stitched edges, burnished corners, and precision hardware. Each detail is intentional, each seam built to last decades.' },
  { number: '03', title: 'Quiet Luxury', body: 'No logos, no noise. Just honest materials, clean lines, and the confidence of owning something truly well-made.' },
]

const faqs = [
  { q: 'What materials does Taaron use?', a: 'Full-grain and top-grain leather sourced from quality tanneries — selected for natural texture, durability, and ability to develop a unique patina.' },
  { q: 'Is Cash on Delivery available?', a: 'Yes — COD across Bangladesh. We also accept bKash for convenient mobile payments.' },
  { q: 'How long does delivery take?', a: 'Dhaka: 1–2 business days. Outside Dhaka: 3–5 business days via courier.' },
  { q: 'What is the return policy?', a: '30-day returns on all items in original, unused condition. Contact us and we will arrange a hassle-free return or exchange.' },
  { q: 'How do I care for my leather product?', a: 'Keep away from direct sunlight and moisture. Apply leather conditioner every 3–6 months. Wipe clean with a dry cloth — never soak.' },
  { q: 'Are Taaron products handmade?', a: 'Yes. Each piece is handcrafted — hand-stitched, edge-burnished, and carefully finished in small production batches.' },
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
  description: 'Premium leather goods brand from Bangladesh.',
  foundingLocation: { '@type': 'Place', name: 'Bangladesh' },
  sameAs: ['https://www.facebook.com/taaron', 'https://www.instagram.com/taaron'],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Taaron',
  url: baseUrl,
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

  const productList = (products as Product[] | null) ?? []

  return (
    <>
      <Script id="org-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <Script id="website-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="bg-[#FAFAFA] text-[#1E2737]">

        {/* ─── Hero ─────────────────────────────────────────────────── */}
        <BannerSlider />

        {/* ─── Editorial Statement ──────────────────────────────────── */}
        <section className="border-b border-[#EBEBEB] px-6 py-24 lg:px-16 lg:py-36">
          <div className="mx-auto max-w-screen-xl">
            <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
              <FadeInSection>
                <h2
                  className="font-serif leading-[0.9] tracking-tight text-[#1E2737]"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(3.5rem, 8vw, 9rem)',
                  }}
                >
                  Premium<br />
                  Leather.<br />
                  <span className="text-[#1969B5]">Crafted.</span>
                </h2>
              </FadeInSection>
              <FadeInSection delay={150}>
                <div className="max-w-xs lg:pb-2">
                  <p className="text-sm leading-relaxed text-[#4B5C73]">
                    Full-grain leather goods built for everyday life in Bangladesh and beyond. Artisanal quality, accessible price.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col">
                    <Link
                      href="/category/all"
                      className="group inline-flex items-center gap-3 bg-[#1E2737] px-8 py-3.5 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#1969B5]"
                    >
                      Explore Collection
                      <svg className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-3 border border-[#DDE3EB] px-8 py-3.5 text-[11px] uppercase tracking-[0.2em] text-[#1E2737] transition-colors hover:border-[#1E2737]"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
              </FadeInSection>
            </div>
          </div>
        </section>

        {/* ─── Marquee ──────────────────────────────────────────────── */}
        <div className="overflow-hidden border-b border-[#EBEBEB] bg-[#1E2737] py-4">
          <div className="animate-marquee flex w-max gap-0 whitespace-nowrap">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="px-8 text-[11px] uppercase tracking-[0.3em] text-white/40">
                Full-Grain Leather &nbsp;·&nbsp; Handcrafted &nbsp;·&nbsp; Bangladesh &nbsp;·&nbsp; COD &amp; bKash &nbsp;·&nbsp; 30-Day Returns &nbsp;·&nbsp; Taaron তারণ &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* ─── New Arrivals ─────────────────────────────────────────── */}
        <section className="px-6 py-24 lg:px-16 lg:py-36" id="products">
          <div className="mx-auto max-w-screen-xl">

            {/* Section header */}
            <FadeInSection>
              <div className="mb-16 flex items-end justify-between border-b border-[#EBEBEB] pb-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-[#1969B5]">Latest</p>
                  <h2
                    className="mt-3 font-serif leading-none tracking-tight"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(2.5rem, 5vw, 5.5rem)',
                    }}
                  >
                    New Arrivals
                  </h2>
                </div>
                <Link
                  href="/category/all"
                  className="group mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#4B5C73] transition-colors hover:text-[#1E2737]"
                >
                  View All
                  <svg className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </FadeInSection>

            {productList.length > 0 ? (
              <>
                {/* Featured editorial row — first 2 products large */}
                {productList.length >= 2 && (
                  <div className="mb-4 grid gap-4 lg:grid-cols-2 lg:gap-6">
                    {productList.slice(0, 2).map((product, idx) => (
                      <FadeInSection key={product.id} delay={idx * 100}>
                        <Link href={`/products/${product.id}`} className="group block bg-white border border-[#F6F6F6]">
                          <div className="relative aspect-[4/5] overflow-hidden bg-[#F0F0F0]">
                            {product.image_url || product.thumbnail_url ? (
                              <Image
                                src={product.image_url || product.thumbnail_url || ''}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                priority={idx === 0}
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-[#7A8EA6]">—</div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[#1E2737]/90 py-3.5 text-center text-[10px] uppercase tracking-widest text-white transition-transform duration-300 group-hover:translate-y-0">
                              View Product
                            </div>
                          </div>
                          <div className="flex items-end justify-between p-4">
                            <div>
                              <h3 className="text-sm font-medium leading-snug text-[#1E2737]">{product.name}</h3>
                              <p className="mt-1 text-xs text-[#7A8EA6]">Full-grain leather</p>
                            </div>
                            <p className="text-base font-semibold text-[#1969B5]">৳{product.price.toLocaleString()}</p>
                          </div>
                        </Link>
                      </FadeInSection>
                    ))}
                  </div>
                )}

                {/* Remaining products — 4-col grid */}
                {productList.length > 2 && (
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
                    {productList.slice(2).map((product, idx) => (
                      <FadeInSection key={product.id} delay={idx * 60}>
                        <Link href={`/products/${product.id}`} className="group block border border-[#F6F6F6] bg-white">
                          <div className="relative aspect-[3/4] overflow-hidden bg-[#F0F0F0]">
                            {product.image_url || product.thumbnail_url ? (
                              <Image
                                src={product.image_url || product.thumbnail_url || ''}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 640px) 50vw, 25vw"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-[#7A8EA6]">—</div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[#1E2737]/90 py-3 text-center text-[10px] uppercase tracking-widest text-white transition-transform duration-300 group-hover:translate-y-0">
                              View Product
                            </div>
                          </div>
                          <div className="p-3">
                            <h3 className="text-sm font-medium leading-snug text-[#1E2737]">{product.name}</h3>
                            <p className="mt-1 text-sm text-[#1969B5]">৳{product.price.toLocaleString()}</p>
                          </div>
                        </Link>
                      </FadeInSection>
                    ))}
                  </div>
                )}

                {/* Only 1 product */}
                {productList.length === 1 && (
                  <FadeInSection>
                    <Link href={`/products/${productList[0]!.id}`} className="group block max-w-sm border border-[#F6F6F6] bg-white">
                      <div className="relative aspect-[3/4] overflow-hidden bg-[#F0F0F0]">
                        {productList[0]!.image_url || productList[0]!.thumbnail_url ? (
                          <Image
                            src={productList[0]!.image_url || productList[0]!.thumbnail_url || ''}
                            alt={productList[0]!.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="33vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-[#7A8EA6]">—</div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-medium text-[#1E2737]">{productList[0]!.name}</h3>
                        <p className="mt-1 text-sm text-[#1969B5]">৳{productList[0]!.price.toLocaleString()}</p>
                      </div>
                    </Link>
                  </FadeInSection>
                )}
              </>
            ) : (
              <FadeInSection>
                <div className="border border-[#DDE3EB] py-32 text-center text-sm text-[#7A8EA6]">
                  No products available yet.
                </div>
              </FadeInSection>
            )}
          </div>
        </section>

        {/* ─── Shop by Category (editorial alternating rows) ────────── */}
        <section aria-label="Shop by Category" className="border-t border-[#EBEBEB]">
          {/* Section header */}
          <div className="px-6 pb-0 pt-24 lg:px-16 lg:pt-36">
            <div className="mx-auto max-w-screen-xl">
              <FadeInSection>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#1969B5]">Explore</p>
                <h2
                  className="mt-3 font-serif leading-none tracking-tight"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.5rem, 5vw, 5.5rem)',
                  }}
                >
                  Shop by Category
                </h2>
              </FadeInSection>
            </div>
          </div>

          {/* Alternating editorial rows */}
          {categories.map((cat, idx) => (
            <FadeInSection key={cat.slug} delay={idx * 60}>
              <Link
                href={`/category/${cat.slug}`}
                className={`group flex flex-col border-b border-[#EBEBEB] lg:flex-row ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Image */}
                <div className="relative h-[55vw] overflow-hidden bg-[#F0F0F0] lg:h-auto lg:w-1/2 lg:min-h-[480px]">
                  <Image
                    src={cat.image}
                    alt={`Taaron ${cat.name}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>

                {/* Text */}
                <div className="flex flex-col justify-center px-8 py-14 lg:w-1/2 lg:px-16 lg:py-20 xl:px-24">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-[#1969B5]">
                    {String(idx + 1).padStart(2, '0')} / {String(categories.length).padStart(2, '0')}
                  </p>
                  <h3
                    className="mt-4 font-serif leading-none tracking-tight text-[#1E2737]"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(2.5rem, 4vw, 5rem)',
                    }}
                  >
                    {cat.name}
                  </h3>
                  <div className="mt-6 h-px w-12 bg-[#1969B5] transition-all duration-500 group-hover:w-24" />
                  <p className="mt-6 max-w-xs text-sm leading-loose text-[#4B5C73]">
                    Premium leather craftsmanship for the discerning everyday.
                  </p>
                  <div className="mt-10 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#1E2737]">
                    Shop {cat.name}
                    <svg className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </FadeInSection>
          ))}
        </section>

        {/* ─── Why Taaron ───────────────────────────────────────────── */}
        <section aria-label="Why Taaron" className="bg-[#1E2737] px-6 py-24 lg:px-16 lg:py-36">
          <div className="mx-auto max-w-screen-xl">
            <FadeInSection>
              <div className="mb-20">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#1969B5]">Our Promise</p>
                <h2
                  className="mt-4 font-serif leading-none tracking-tight text-white"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.5rem, 5vw, 5.5rem)',
                  }}
                >
                  Built Different.
                </h2>
              </div>
            </FadeInSection>
            <div className="grid gap-16 md:grid-cols-3">
              {pillars.map((p, idx) => (
                <FadeInSection key={p.number} delay={idx * 120}>
                  <div className="group">
                    <p
                      className="font-serif leading-none text-[#1969B5]/20 transition-colors duration-500 group-hover:text-[#1969B5]/60"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(3rem, 5vw, 6rem)',
                      }}
                    >
                      {p.number}
                    </p>
                    <h3 className="mt-5 text-sm font-semibold uppercase tracking-widest text-white">{p.title}</h3>
                    <div className="mt-3 h-px w-8 bg-[#1969B5] transition-all duration-500 group-hover:w-16" />
                    <p className="mt-5 text-sm leading-loose text-[#7A8EA6]">{p.body}</p>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Full-bleed craft banner ──────────────────────────────── */}
        <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1800&q=90"
            alt="Taaron leather craft"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#1E2737]/60" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <FadeInSection>
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/50">Handcrafted in Bangladesh</p>
              <p
                className="mt-4 font-serif leading-tight text-white"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 5vw, 5rem)',
                }}
              >
                Every stitch. Every edge.<br />Every detail — intentional.
              </p>
              <Link
                href="/category/all"
                className="mt-10 inline-flex items-center gap-3 border border-white/30 px-10 py-3.5 text-[11px] uppercase tracking-[0.2em] text-white transition-all hover:border-white hover:bg-white hover:text-[#1E2737]"
              >
                Shop the Collection
              </Link>
            </FadeInSection>
          </div>
        </section>

        {/* ─── FAQ ──────────────────────────────────────────────────── */}
        <section aria-label="Frequently Asked Questions" id="faq" className="px-6 py-24 lg:px-16 lg:py-36">
          <div className="mx-auto max-w-screen-xl">
            <FadeInSection>
              <div className="mb-16 grid gap-8 lg:grid-cols-[1fr_2fr]">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-[#1969B5]">Help</p>
                  <h2
                    className="mt-4 font-serif leading-none tracking-tight"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(2.5rem, 4vw, 4.5rem)',
                    }}
                  >
                    Common<br />Questions
                  </h2>
                  <p className="mt-6 text-sm leading-relaxed text-[#4B5C73]">
                    Can&apos;t find your answer?{' '}
                    <Link href="/contact" className="text-[#1969B5] hover:underline">Contact us</Link>.
                  </p>
                </div>
                <div />
              </div>
            </FadeInSection>
            <dl className="divide-y divide-[#DDE3EB] lg:ml-auto lg:max-w-2xl">
              {faqs.map((faq, idx) => (
                <FadeInSection key={faq.q} delay={idx * 40}>
                  <div className="py-7">
                    <dt className="text-sm font-semibold text-[#1E2737]">{faq.q}</dt>
                    <dd className="mt-3 text-sm leading-loose text-[#4B5C73]">{faq.a}</dd>
                  </div>
                </FadeInSection>
              ))}
            </dl>
          </div>
        </section>

      </div>
    </>
  )
}
