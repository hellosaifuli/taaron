import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Script from 'next/script'
import { notFound } from 'next/navigation'
import ProductMasonry from '@/components/product-masonry'
import type { Product } from '@/app/actions/products'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

const categoryMeta: Record<string, { name: string; description: string }> = {
  all:        { name: 'All Products',    description: 'The complete Taaron collection — premium leather goods crafted for everyday elegance.' },
  bags:       { name: 'Bags & Backpacks', description: 'Full-grain leather bags built for the modern professional. Structure, substance, style.' },
  wallets:    { name: 'Wallets',         description: 'Slim, refined, built to last. Wallets that get better with every day of use.' },
  belts:      { name: 'Belts',           description: 'Precision-cut leather belts with solid brass hardware. The finishing detail.' },
  cardholder: { name: 'Card Holders',    description: 'Minimalist card carriers for the essentials. Compact, clean, effortless.' },
  ladies:     { name: 'Ladies Bags',     description: 'Elegant leather bags designed with a feminine sensibility. Timeless, not trendy.' },
}

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000'

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const meta = categoryMeta[slug]
  if (!meta) return {}
  return {
    title: meta.name,
    description: meta.description,
    alternates: { canonical: `${baseUrl}/category/${slug}` },
    openGraph: {
      title: meta.name,
      description: meta.description,
      url: `${baseUrl}/category/${slug}`,
      siteName: 'Taaron',
      images: [{ url: `${baseUrl}/taaron-logo.png`, width: 1200, height: 630, alt: `Taaron ${meta.name}` }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.name,
      description: meta.description,
      images: [`${baseUrl}/taaron-logo.png`],
    },
  }
}

export const dynamic = 'force-dynamic'

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const meta = categoryMeta[slug]
  if (!meta) notFound()

  const supabase = await createClient()

  const query = supabase
    .from('products')
    .select('id, name, price, image_url, thumbnail_url')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(50)

  const { data: products } = slug === 'all'
    ? await query
    : await query.eq('category', slug)

  const { data: fallback } = (!products?.length && slug !== 'all')
    ? await supabase.from('products').select('id, name, price, image_url, thumbnail_url').eq('status', 'active').order('created_at', { ascending: false }).limit(50)
    : { data: null }

  const displayProducts = (products?.length ? products : (fallback ?? [])) as Product[]

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${meta.name} — Taaron`,
    description: meta.description,
    url: `${baseUrl}/category/${slug}`,
    numberOfItems: displayProducts.length,
    hasPart: displayProducts.slice(0, 10).map((p) => ({
      '@type': 'Product',
      name: p.name,
      offers: { '@type': 'Offer', price: p.price, priceCurrency: 'BDT', availability: 'https://schema.org/InStock' },
    })),
  }

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#111111]">
      <Script id="collection-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      {/* ── Banner — gradient, no image ──────────────────────── */}
      <div
        className="relative flex flex-col justify-end overflow-hidden px-6 pb-8 pt-24 lg:px-16 lg:pb-10 lg:pt-28"
        style={{
          background: 'linear-gradient(135deg, #F0EDE7 0%, #E2D9CC 50%, #D4BFA0 100%)',
          minHeight: '22vh',
        }}
      >
        {/* Subtle texture layer */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #F7F4EF 0%, transparent 60%)' }} />

        <div className="relative">
          <h1
            className="mt-2 text-[#111111]"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 4.5rem)',
              lineHeight: '1.05',
              letterSpacing: '-0.01em',
              fontWeight: 400,
            }}
          >
            {meta.name}
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#5C5652]">{meta.description}</p>
        </div>
      </div>

      {/* ── Product count bar ────────────────────────────────── */}
      <div className="px-6 py-4 lg:px-12">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#9E9690]">
          {displayProducts.length} {displayProducts.length === 1 ? 'Product' : 'Products'}
        </p>
      </div>

      {/* ── Products — masonry grid ───────────────────────────── */}
      {displayProducts.length > 0 ? (
        <ProductMasonry initialProducts={displayProducts} />
      ) : (
        <div className="py-32 text-center">
          <p className="text-sm text-[#9E9690]">No products in this category yet.</p>
          <Link
            href="/category/all"
            className="mt-6 inline-block bg-[#111111] px-8 py-3 text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-[#9B6F47]"
          >
            View All Products
          </Link>
        </div>
      )}

    </div>
  )
}
