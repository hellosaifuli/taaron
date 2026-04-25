import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import AddToCart from '@/components/add-to-cart'
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

  const mainImage = allImages[0]

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

        {/* ── Editorial split: image left | info right ─────────────── */}
        <div className="lg:flex lg:min-h-screen">

          {/* Gallery — full-bleed left panel, sticky on desktop */}
          <div className="relative lg:sticky lg:top-0 lg:h-screen lg:w-[58%] lg:flex-shrink-0 lg:overflow-hidden">

            {/* Main image */}
            <div className="relative w-full overflow-hidden bg-[#EDE9E3]" style={{ aspectRatio: '4/5', maxHeight: '85vh' }}>
              {mainImage ? (
                <Image
                  src={mainImage.url}
                  alt={mainImage.alt || product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-[#9E9690]">
                  No image
                </div>
              )}

              {/* Gradient fade to cream at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F7F4EF] to-transparent lg:hidden" />

              {/* Breadcrumb overlay */}
              <nav aria-label="Breadcrumb" className="absolute top-24 left-6 lg:top-8 lg:left-8 flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#111111]/50 mix-blend-multiply">
                <Link href="/" className="transition-colors hover:text-[#111111]">Home</Link>
                <span>/</span>
                <Link href="/category/all" className="transition-colors hover:text-[#111111]">Shop</Link>
                <span>/</span>
                <span className="text-[#111111]/30">{product.name}</span>
              </nav>

              {/* Image count */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/30 px-2.5 py-1 text-[10px] uppercase tracking-widest text-white backdrop-blur-sm">
                  1 / {allImages.length}
                </div>
              )}
            </div>

            {/* Thumbnail strip — desktop only */}
            {allImages.length > 1 && (
              <div className="hidden lg:flex gap-1.5 bg-[#F7F4EF] p-3">
                {allImages.slice(0, 6).map((img, i) => (
                  <div key={i} className="relative h-16 flex-1 overflow-hidden bg-[#EDE9E3]">
                    <Image
                      src={img.url}
                      alt={img.alt || product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right panel: product info ─────────────────────────── */}
          <div className="flex flex-col px-6 pb-24 pt-10 lg:flex-1 lg:overflow-y-auto lg:px-14 lg:pt-28 lg:pb-20">

            {/* SKU label */}
            {product.sku && (
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#9B6F47]">
                SKU: {product.sku}
              </p>
            )}

            {/* Product name — big editorial */}
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

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <p
                className="text-[#111111]"
                style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 500 }}
              >
                ৳{product.price.toLocaleString()}
              </p>
              <span className="text-xs uppercase tracking-wider text-[#9E9690]">BDT</span>
            </div>

            {/* Add to cart */}
            <div className="mt-8">
              <AddToCart product={product} />
            </div>

            {/* Divider */}
            <div className="my-8 h-px bg-[#E5DFD6]" />

            {/* Accordion */}
            <ProductAccordion items={sections} />

            {/* Thumbnail strip — mobile only */}
            {allImages.length > 1 && (
              <div className="mt-8 flex gap-2 overflow-x-auto pb-2 lg:hidden">
                {allImages.map((img, i) => (
                  <div key={i} className="relative h-20 w-20 flex-shrink-0 overflow-hidden bg-[#EDE9E3]">
                    <Image src={img.url} alt={img.alt || product.name} fill className="object-cover" sizes="80px" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Related products — full bleed ───────────────────────── */}
        <RelatedProducts currentId={id} />
      </div>
    </>
  )
}
