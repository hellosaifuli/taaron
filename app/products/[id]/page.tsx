import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import AddToCart from '@/components/add-to-cart'
import LuxuryNav from '@/components/luxury-nav'
import ProductGallery from '@/components/product-gallery'
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

  // Build ordered image list: main image first, then extra images
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

  return (
    <>
      <Script id="product-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      <div className="min-h-screen bg-[#F4F0E6] text-[#1C1C1C]">
        <LuxuryNav />

        <div className="mx-auto max-w-screen-xl px-6 pt-28 pb-20 lg:px-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-10 flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#9A9080]">
            <Link href="/" className="transition-colors hover:text-[#1C1C1C]">Home</Link>
            <span>/</span>
            <Link href="/?category=all" className="transition-colors hover:text-[#1C1C1C]">Shop</Link>
            <span>/</span>
            <span className="text-[#1C1C1C]">{product.name}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Gallery */}
            <ProductGallery images={allImages} productName={product.name} />

            {/* Details */}
            <div className="flex flex-col">
              {product.sku && (
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#B8962E]">SKU: {product.sku}</p>
              )}

              <h1 className="mt-3 font-serif text-4xl font-medium leading-tight lg:text-5xl" style={{ fontFamily: 'var(--font-serif)' }}>
                {product.name}
              </h1>

              <div className="mt-6 flex items-baseline gap-3">
                <p className="font-serif text-3xl font-medium text-[#1C1C1C]" style={{ fontFamily: 'var(--font-serif)' }}>
                  ৳{product.price.toLocaleString()}
                </p>
              </div>

              <div className="mt-2 h-px w-16 bg-[#B8962E]" />

              {product.description && (
                <p className="mt-8 text-sm leading-loose text-[#6B6561]">{product.description}</p>
              )}

              {/* Variants */}
              {product.product_variants && product.product_variants.length > 0 && (
                <div className="mt-8">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-[#9A9080]">Choose Variant</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.product_variants.map((v: any) => (
                      <label
                        key={v.id}
                        className="group relative cursor-pointer"
                      >
                        <input type="radio" name="variant" value={v.id} className="peer sr-only" />
                        <div className="border border-[#E0DAD0] px-4 py-2 text-xs tracking-wide transition-all peer-checked:border-[#1C1C1C] peer-checked:bg-[#1C1C1C] peer-checked:text-white hover:border-[#1C1C1C]">
                          {v.name}
                          {v.price_adjustment > 0 && <span className="ml-1 text-[#B8962E]">+৳{v.price_adjustment}</span>}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to cart */}
              <div className="mt-8">
                <AddToCart product={product} />
              </div>

              {/* Trust signals */}
              <div className="mt-10 space-y-3 border-t border-[#E0DAD0] pt-8">
                {[
                  'Free shipping on orders over ৳3,000',
                  'COD & bKash accepted',
                  '100% genuine full-grain leather',
                  '30-day hassle-free returns',
                  'Handcrafted in Bangladesh',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-[#6B6561]">
                    <div className="h-px w-4 bg-[#B8962E]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-[#e8e9e2]">
          <div className="relative px-8 pt-16 pb-8">
            <p className="max-w-xs text-sm leading-relaxed text-[#1e2235]/70">
              At Taaron, We create luxurious, durable leather wallets, bags, and belts so you carry confidence and style without the heavy price tag.
            </p>
            <div className="mt-8 flex items-center justify-center pb-8">
              <Image src="/taaron-logo.png" alt="Taaron" width={1200} height={220} className="w-full max-w-5xl object-contain" />
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-[#1e2235]/10 px-8 py-4">
            <p className="text-xs text-[#1e2235]/60">© 2026 Taaron (তারণ)</p>
            <div className="flex items-center gap-4">
              {['Facebook', 'Instagram', 'YouTube', 'TikTok'].map((s) => (
                <a key={s} href="#" aria-label={`Taaron on ${s}`} className="text-xs text-[#1e2235]/50 transition-colors hover:text-[#1e2235]">{s}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
