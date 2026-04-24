import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'

interface RelatedProductsProps {
  currentId: string
}

export default async function RelatedProducts({ currentId }: RelatedProductsProps) {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, image_url, thumbnail_url')
    .eq('status', 'active')
    .neq('id', currentId)
    .limit(4)
    .order('created_at', { ascending: false })

  if (!products?.length) return null

  return (
    <section className="border-t border-[#EBEBEB] bg-[#FAFAFA] px-6 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-screen-xl">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#1969B5]">Discover</p>
            <h2 className="mt-2 font-serif text-2xl font-medium lg:text-3xl" style={{ fontFamily: 'var(--font-display)' }}>
              You May Also Like
            </h2>
          </div>
          <Link href="/" className="hidden text-[11px] uppercase tracking-widest text-[#4B5C73] underline-offset-4 hover:underline sm:block">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group block border border-[#F6F6F6] bg-white">
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
                <h3 className="truncate text-sm font-medium text-[#1E2737]">{product.name}</h3>
                <p className="mt-0.5 text-sm text-[#1969B5]">৳{product.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
