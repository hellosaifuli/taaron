import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createProduct, deleteProduct, toggleStatus } from './actions'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@taaron.bd'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Admin — Products' }

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) redirect('/auth')

  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, sku, status, image_url, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#F4F0E6] pt-20">
      <div className="mx-auto max-w-screen-xl px-6 py-12 lg:px-12">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#B8962E]">Admin</p>
            <h1 className="mt-1 font-serif text-3xl font-medium" style={{ fontFamily: 'var(--font-serif)' }}>
              Products
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[11px] uppercase tracking-widest text-[#6B6561] hover:text-[#1C1C1C]">
              ← Store
            </Link>
          </div>
        </div>

        <div className="mt-1 h-px w-16 bg-[#B8962E]" />

        {/* Add Product Form */}
        <section className="mt-12 border border-[#E0DAD0] bg-white p-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#1C1C1C]">Add New Product</h2>
          <form action={createProduct} className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#9A9080]">Name *</label>
              <input name="name" required className="mt-2 w-full border border-[#E0DAD0] bg-[#F4F0E6] px-3 py-2.5 text-sm outline-none focus:border-[#1C1C1C]" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#9A9080]">Price (৳) *</label>
              <input name="price" type="number" step="0.01" required className="mt-2 w-full border border-[#E0DAD0] bg-[#F4F0E6] px-3 py-2.5 text-sm outline-none focus:border-[#1C1C1C]" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#9A9080]">Cost (৳)</label>
              <input name="cost" type="number" step="0.01" className="mt-2 w-full border border-[#E0DAD0] bg-[#F4F0E6] px-3 py-2.5 text-sm outline-none focus:border-[#1C1C1C]" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#9A9080]">SKU</label>
              <input name="sku" className="mt-2 w-full border border-[#E0DAD0] bg-[#F4F0E6] px-3 py-2.5 text-sm outline-none focus:border-[#1C1C1C]" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#9A9080]">Status</label>
              <select name="status" className="mt-2 w-full border border-[#E0DAD0] bg-[#F4F0E6] px-3 py-2.5 text-sm outline-none focus:border-[#1C1C1C]">
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#9A9080]">Main Image URL</label>
              <input name="image_url" type="url" placeholder="https://..." className="mt-2 w-full border border-[#E0DAD0] bg-[#F4F0E6] px-3 py-2.5 text-sm outline-none focus:border-[#1C1C1C]" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] uppercase tracking-widest text-[#9A9080]">Description</label>
              <textarea name="description" rows={3} className="mt-2 w-full border border-[#E0DAD0] bg-[#F4F0E6] px-3 py-2.5 text-sm outline-none focus:border-[#1C1C1C]" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] uppercase tracking-widest text-[#9A9080]">
                Extra Image URLs <span className="normal-case text-[#9A9080]">(one per line)</span>
              </label>
              <textarea name="extra_images" rows={3} placeholder="https://image1.com&#10;https://image2.com" className="mt-2 w-full border border-[#E0DAD0] bg-[#F4F0E6] px-3 py-2.5 text-sm outline-none focus:border-[#1C1C1C]" />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="w-full bg-[#1C1C1C] px-6 py-3 text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-[#B8962E]">
                Create Product
              </button>
            </div>
          </form>
        </section>

        {/* Products Table */}
        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#1C1C1C]">
            All Products <span className="font-normal text-[#9A9080]">({products?.length ?? 0})</span>
          </h2>

          <div className="mt-4 divide-y divide-[#E0DAD0] border border-[#E0DAD0] bg-white">
            {!products?.length ? (
              <p className="px-6 py-8 text-sm text-[#9A9080]">No products yet.</p>
            ) : (
              products.map((p) => (
                <div key={p.id} className="flex items-center gap-4 px-6 py-4">
                  {/* Thumbnail */}
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden bg-[#EDE8DD]">
                    {p.image_url ? (
                      <Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="56px" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-[#9A9080]">—</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-[#1C1C1C]">{p.name}</p>
                    <p className="text-xs text-[#9A9080]">
                      ৳{p.price.toLocaleString()}
                      {p.sku && <span className="ml-3">SKU: {p.sku}</span>}
                    </p>
                  </div>

                  {/* Status badge */}
                  <span className={`hidden flex-shrink-0 px-2 py-0.5 text-[10px] uppercase tracking-wider sm:block ${p.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-[#EDE8DD] text-[#9A9080]'}`}>
                    {p.status}
                  </span>

                  {/* Actions */}
                  <div className="flex flex-shrink-0 items-center gap-3">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-[11px] uppercase tracking-widest text-[#6B6561] hover:text-[#1C1C1C]"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/products/${p.id}`}
                      target="_blank"
                      className="text-[11px] uppercase tracking-widest text-[#6B6561] hover:text-[#1C1C1C]"
                    >
                      View
                    </Link>
                    <form action={async () => { 'use server'; await toggleStatus(p.id, p.status) }}>
                      <button type="submit" className="text-[11px] uppercase tracking-widest text-[#B8962E] hover:text-[#1C1C1C]">
                        {p.status === 'active' ? 'Unpublish' : 'Publish'}
                      </button>
                    </form>
                    <form action={async () => { 'use server'; await deleteProduct(p.id) }}>
                      <button
                        type="submit"
                        className="text-[11px] uppercase tracking-widest text-red-400 hover:text-red-600"
                        onClick={undefined}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
