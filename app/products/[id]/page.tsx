import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import AddToCart from '@/components/add-to-cart'
import ProductGallery from '@/components/product-gallery'
import RelatedProducts from '@/components/related-products'
import ProductAccordion from '@/components/product-accordion'
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

const trustItems = [
  { icon: '✦', text: 'Free shipping on orders over ৳3,000' },
  { icon: '✦', text: 'COD & bKash accepted' },
  { icon: '✦', text: '100% genuine full-grain leather' },
  { icon: '✦', text: '30-day hassle-free returns' },
]

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
    image: allImages.map((i) => i.url),
    brand: { '@type': 'Brand', name: 'Taaron' },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/products/${id}`,
      priceCurrency: 'BDT',
      price: product.price,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Taaron' },
    },
  }

  const sections = accordionSections(product.description)

  return (
    <>
      <Script id="product-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      <div className="min-h-screen bg-[#F7F4EF] text-[#111111]">
        <div className="mx-auto max-w-screen-xl px-4 pt-20 pb-24 lg:px-12 lg:pt-28 lg:pb-0">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-10 flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#9E9690]">
            <Link href="/" className="transition-colors hover:text-[#111111]">Home</Link>
            <span>/</span>
            <Link href="/" className="transition-colors hover:text-[#111111]">Shop</Link>
            <span>/</span>
            <span className="text-[#111111]">{product.name}</span>
          </nav>

          {/* Main product grid */}
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-24">
            {/* Gallery — sticky on desktop */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ProductGallery images={allImages} productName={product.name} />
            </div>

            {/* Right panel */}
            <div className="flex flex-col pb-16">
              {product.sku && (
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#9B6F47]">SKU: {product.sku}</p>
              )}

              <h1
                className="mt-3 font-serif text-3xl font-medium leading-tight lg:text-4xl xl:text-5xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {product.name}
              </h1>

              <div className="mt-5 flex items-baseline gap-3">
                <p className="font-serif text-2xl font-medium" style={{ fontFamily: 'var(--font-display)' }}>
                  ৳{product.price.toLocaleString()}
                </p>
                <span className="text-xs uppercase tracking-wider text-[#9E9690]">BDT</span>
              </div>

              <div className="mt-3 h-px w-12 bg-[#9B6F47]" />

              {/* Add to cart */}
              <div className="mt-8">
                <AddToCart product={product} />
              </div>

              {/* Trust signals */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                {trustItems.map((item) => (
                  <div key={item.text} className="flex items-start gap-2 text-xs text-[#5C5652]">
                    <span className="mt-0.5 text-[#9B6F47] text-[8px]">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>

              {/* Animated accordion sections */}
              <div className="mt-10">
                <ProductAccordion items={sections} />
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        <RelatedProducts currentId={id} />
      </div>
    </>
  )
}
