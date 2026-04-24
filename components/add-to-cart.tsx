'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AddToCartProps {
  product: any
}

export default function AddToCart({ product }: AddToCartProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart.push({
      product_id: product.id,
      variant_id: selectedVariant,
      quantity,
      price: product.price,
      name: product.name,
      image_url: product.image_url,
    })
    localStorage.setItem('cart', JSON.stringify(cart))
    router.push('/checkout')
  }

  return (
    <div className="space-y-4">
      {product.product_variants && product.product_variants.length > 0 && (
        <div>
          <label className="block text-sm font-medium">Select Variant</label>
          <select
            value={selectedVariant || ''}
            onChange={(e) => setSelectedVariant(e.target.value)}
            className="mt-2 w-full border border-gray-300 px-3 py-2"
            required
          >
            <option value="">Choose a variant</option>
            {product.product_variants.map((variant: any) => (
              <option key={variant.id} value={variant.id}>
                {variant.name} (Stock: {variant.stock_quantity})
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium">Quantity</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="mt-2 w-full border border-gray-300 px-3 py-2"
        />
      </div>

      <button
        onClick={handleAddToCart}
        disabled={
          product.product_variants &&
          product.product_variants.length > 0 &&
          !selectedVariant
        }
        className="w-full border border-gray-300 bg-gray-900 px-4 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
      >
        Add to Cart - ৳{(product.price * quantity).toLocaleString()}
      </button>
    </div>
  )
}
