import { createClient } from '@/lib/supabase/server'
import AddToCart from '@/components/add-to-cart'
import RelatedProducts from '@/components/related-products'
import ProductAccordion from '@/components/product-accordion'
import ProductGallery from '@/components/product-gallery'
import FadeInSection from '@/components/fade-in-section'
import { notFound } from 'next/navigation'
import Script from 'next/script'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000'

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('name, description, price, image_url')
    .eq('id', id)
    .single()

  if (!product) return {}

  return {
    title: `${product.name} — Taaron`,
    description: product.description || `Buy ${product.name} from Taaron. Premium leather goods in Bangladesh. COD & bKash available.`,
    openGraph: {
      title: `${product.name} | Taaron`,
      description: product.description || `Premium leather ${product.name} by Taaron.`,
      images: product.image_url ? [{ url: product.image_url, alt: product.name }] : [],
    },
    alternates: { canonical: `/products/${id}` },
  }
}

const accordionSections = (description: string | null) => [
  {
    title: 'Description',
    content: description || 'A premium leather product crafted with artisanal care and precision.',
  },
  {
    title: 'Materials & Care',
    content: 'Full-grain or top-grain leather. Apply leather conditioner every 3–6 months. Wipe clean with a dry cloth. Keep away from direct sunlight and moisture.',
  },
  {
    title: 'Shipping & Returns',
    content: 'Dhaka: 1–2 business days. Outside Dhaka: 3–5 business days. 30-day returns on unused items in original condition.',
  },
]

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: product }, { data: extraImages }] = await Promise.all([
    supabase
      .from('products')
      .select(`
        id, name, description, price, sku, image_url, thumbnail_url, status,
        product_variants (id, name, sku, price_adjustment, stock_quantity, image_url)
      `)
      .eq('id', id)
      .eq('status', 'active')
      .single(),
    supabase
      .from('product_images')
      .select('url, alt, position')
      .eq('product_id', id)
      .order('position'),
  ])

  if (!product) notFound()

  const allImages = [
    ...(product.image_url ? [{ url: product.image_url, alt: product.name }] : []),
    ...(extraImages ?? []).map((img) => ({ url: img.url, alt: img.alt || product.name })),
  ]

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    url: `${baseUrl}/products/${id}`,
    inLanguage: 'en',
    image: allImages.map((i) => i.url),
    brand: { '@type': 'Brand', name: 'Taaron' },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/products/${id}`,
      priceCurrency: 'BDT',
      price: product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      areaServed: { '@type': 'Country', name: 'Bangladesh' },
      seller: { '@type': 'Organization', name: 'Taaron', url: baseUrl },
    },
  }

  const sections = accordionSections(product.description)

  return (
    <>
      <Script id="product-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      <div className="min-h-screen bg-[#F7F4EF] text-[#111111]">

        {/* ── Editorial split: image left | info right ─────────────── */}
        <div className="lg:flex lg:min-h-screen">

          <ProductGallery images={allImages} productName={product.name} />

          {/* ── Right panel: product info ─────────────────────────── */}
          <div className="flex flex-col px-6 pb-24 pt-10 lg:flex-1 lg:overflow-y-auto lg:px-14 lg:pt-28 lg:pb-20">

            <FadeInSection from="right">
              {product.sku && (
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#9B6F47]">
                  SKU: {product.sku}
                </p>
              )}
              <h1
                className="mt-3 leading-tight text-[#111111]"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                }}
              >
                {product.name}
              </h1>
            </FadeInSection>

            <FadeInSection delay={120} from="right">
              <div className="mt-6 flex items-baseline gap-3">
                <p
                  className="text-[#111111]"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 500 }}
                >
                  ৳{product.price.toLocaleString()}
                </p>
                <span className="text-xs uppercase tracking-wider text-[#9E9690]">BDT</span>
              </div>
            </FadeInSection>

            <FadeInSection delay={200} from="right" className="mt-8">
              <AddToCart product={product} />
            </FadeInSection>


            <FadeInSection delay={280} from="up">
              <ProductAccordion items={sections} />
            </FadeInSection>

          </div>
        </div>

        {/* ── Related products — full bleed ───────────────────────── */}
        <RelatedProducts currentId={id} />
      </div>
    </>
  )
}
