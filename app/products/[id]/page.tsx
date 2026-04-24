import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import AddToCart from '@/components/add-to-cart'
import { notFound } from 'next/navigation'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select(
      `
      id,
      name,
      description,
      price,
      sku,
      image_url,
      status,
      product_variants (
        id,
        name,
        sku,
        price_adjustment,
        stock_quantity,
        image_url
      )
    `
    )
    .eq('id', id)
    .eq('status', 'active')
    .single()

  if (error || !product) {
    notFound()
  }

  return (
    <div className="w-full bg-white">
      {/* Header */}
      <header className="border-b border-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="text-lg font-semibold tracking-wider">
              TAARON
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-sm hover:text-gray-600">
                Account
              </Link>
              <Link href="/checkout" className="text-sm hover:text-gray-600">
                Cart
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Product */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
          ← Back
        </Link>

        <div className="mt-8 grid gap-12 sm:grid-cols-2">
          {/* Image */}
          <div className="bg-gray-50">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                width={600}
                height={600}
                className="w-full"
              />
            ) : (
              <div className="aspect-square flex items-center justify-center bg-gray-200 text-gray-400">
                No image
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-light">{product.name}</h1>
            <p className="mt-6 text-2xl font-semibold">
              Tk {product.price.toLocaleString()}
            </p>

            {product.description && (
              <div className="mt-8 border-t border-gray-200 pt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wide">Description</h2>
                <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {product.product_variants && product.product_variants.length > 0 && (
              <div className="mt-8 border-t border-gray-200 pt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wide">Choose Variant</h2>
                <div className="mt-4 space-y-2">
                  {product.product_variants.map((variant: any) => (
                    <label
                      key={variant.id}
                      className="flex cursor-pointer items-center gap-3 border border-gray-200 p-4 hover:bg-gray-50"
                    >
                      <input type="radio" name="variant" className="h-4 w-4" />
                      <div>
                        <p className="font-medium">{variant.name}</p>
                        <p className="text-xs text-gray-500">
                          {variant.stock_quantity > 0 ? `In stock (${variant.stock_quantity})` : 'Out of stock'}
                        </p>
                      </div>
                      {variant.price_adjustment > 0 && (
                        <p className="ml-auto text-sm font-medium">
                          +Tk {variant.price_adjustment.toLocaleString()}
                        </p>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <AddToCart product={product} />
            </div>

            <div className="mt-8 space-y-3 border-t border-gray-200 pt-8 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <span className="text-lg">✓</span> Free shipping nationwide
              </p>
              <p className="flex items-center gap-2">
                <span className="text-lg">✓</span> COD & bKash available
              </p>
              <p className="flex items-center gap-2">
                <span className="text-lg">✓</span> 100% authentic leather
              </p>
              <p className="flex items-center gap-2">
                <span className="text-lg">✓</span> 30-day returns
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-900 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="font-semibold">Company</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/" className="hover:text-gray-900">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-gray-900">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Help</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/" className="hover:text-gray-900">
                    Shipping
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-gray-900">
                    Returns
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Follow Us</h3>
              <div className="mt-4 flex gap-4 text-sm">
                <a href="#" className="hover:text-gray-600">
                  Facebook
                </a>
                <a href="#" className="hover:text-gray-600">
                  Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-xs text-gray-600">
            <p>&copy; 2024 Taaron. Shine with Every Step.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
