import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

const categoryMeta: Record<string, { name: string; description: string; image: string }> = {
  'all': {
    name: 'All Products',
    description: 'The complete Taaron collection — premium leather goods crafted for everyday elegance.',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1800&q=90',
  },
  'bags': {
    name: 'Bags & Backpacks',
    description: 'Full-grain leather bags built for the modern professional. Structure, substance, style.',
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=1800&q=90',
  },
  'wallets': {
    name: 'Wallets',
    description: 'Slim, refined, built to last. Wallets that get better with every day of use.',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594785?w=1800&q=90',
  },
  'belts': {
    name: 'Belts',
    description: 'Precision-cut leather belts with solid brass hardware. The finishing detail.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1800&q=90',
  },
  'cardholder': {
    name: 'Card Holders',
    description: 'Minimalist card carriers for the essentials. Compact, clean, effortless.',
    image: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=1800&q=90',
  },
  'ladies': {
    name: 'Ladies Bags',
    description: 'Elegant leather bags designed with a feminine sensibility. Timeless, not trendy.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1800&q=90',
  },
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const meta = categoryMeta[slug]
  if (!meta) return {}
  return {
    title: `${meta.name} — Taaron`,
    description: meta.description,
  }
}

export const dynamic = 'force-dynamic'

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const meta = categoryMeta[slug]
  if (!meta) notFound()

  const supabase = await createClient()

  // Filter by category column if it exists, otherwise show all active products
  const query = supabase
    .from('products')
    .select('id, name, price, image_url, thumbnail_url')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const { data: products } = slug === 'all'
    ? await query
    : await query.eq('category', slug)

  // Fallback: if slug filter returns nothing, show all
  const { data: allProducts } = (!products?.length && slug !== 'all')
    ? await supabase.from('products').select('id, name, price, image_url, thumbnail_url').eq('status', 'active').order('created_at', { ascending: false })
    : { data: null }

  const displayProducts = products?.length ? products : (allProducts ?? [])

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1E2737]">

      {/* Hero */}
      <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <Image
          src={meta.image}
          alt={meta.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E2737]/80 via-[#1E2737]/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 lg:px-16 lg:pb-16">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/50">Taaron / Collection</p>
          <h1
            className="mt-3 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {meta.name}
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">{meta.description}</p>
        </div>
      </div>

      {/* Products */}
      <div className="mx-auto max-w-screen-xl px-6 py-16 lg:px-12 lg:py-20">
        <div className="mb-8 flex items-center justify-between border-b border-[#DDE3EB] pb-5">
          <p className="text-xs uppercase tracking-widest text-[#7A8EA6]">
            {displayProducts.length} {displayProducts.length === 1 ? 'Product' : 'Products'}
          </p>
          <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-[#7A8EA6]">
            {Object.entries(categoryMeta).filter(([k]) => k !== slug).slice(0, 4).map(([k, v]) => (
              <Link key={k} href={`/category/${k}`} className="transition-colors hover:text-[#1E2737]">
                {v.name.split(' ')[0]}
              </Link>
            ))}
          </div>
        </div>

        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {displayProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group block border border-[#F6F6F6] bg-white">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#F0F0F0]">
                  {product.image_url || product.thumbnail_url ? (
                    <Image
                      src={product.image_url || product.thumbnail_url || ''}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-[#7A8EA6]">—</div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[#1E2737]/90 py-3 text-center text-[10px] uppercase tracking-widest text-white transition-transform duration-300 group-hover:translate-y-0">
                    View Product
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-[#1E2737]">{product.name}</h3>
                  <p className="mt-0.5 text-sm text-[#1969B5]">৳{product.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center">
            <p className="text-sm text-[#7A8EA6]">No products in this category yet.</p>
            <Link href="/category/all" className="mt-4 inline-block text-[11px] uppercase tracking-widest text-[#1969B5] underline-offset-4 hover:underline">
              View all products
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
