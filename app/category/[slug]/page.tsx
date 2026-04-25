import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
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

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const meta = categoryMeta[slug]
  if (!meta) return {}
  return { title: `${meta.name} — Taaron`, description: meta.description }
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

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#111111]">

      {/* ── Banner — gradient, no image ──────────────────────── */}
      <div
        className="relative flex flex-col justify-end overflow-hidden px-6 pb-8 pt-24 lg:px-16 lg:pb-10 lg:pt-28"
        style={{
          background: 'linear-gradient(135deg, #1A1210 0%, #3B2415 55%, #9B6F47 100%)',
          minHeight: '35vh',
        }}
      >
        {/* Subtle texture layer */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #C4A070 0%, transparent 60%)' }} />

        <div className="relative">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/45">Taaron / Collection</p>
          <h1
            className="mt-2 text-white"
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
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">{meta.description}</p>
        </div>
      </div>

      {/* ── Product count bar ────────────────────────────────── */}
      <div className="border-b border-[#E5DFD6] px-6 py-4 lg:px-12">
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
