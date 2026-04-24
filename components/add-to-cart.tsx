'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/cart-provider'
import { toast } from 'sonner'

interface AddToCartProps {
  product: {
    id: string
    name: string
    price: number
    image_url?: string | null
    product_variants?: { id: string; name: string; price_adjustment: number; stock_quantity: number }[]
  }
}

export default function AddToCart({ product }: AddToCartProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)

  const variants = product.product_variants ?? []
  const needsVariant = variants.length > 0 && !selectedVariant

  const selectedVariantData = variants.find((v) => v.id === selectedVariant)
  const finalPrice = product.price + (selectedVariantData?.price_adjustment ?? 0)

  const handleAdd = () => {
    if (needsVariant) {
      toast.error('Please select a variant first.')
      return
    }
    addItem({
      product_id: product.id,
      variant_id: selectedVariant,
      quantity,
      price: finalPrice,
      name: product.name + (selectedVariantData ? ` — ${selectedVariantData.name}` : ''),
      image_url: product.image_url,
    })
    toast.success(`${product.name} added to cart`, {
      action: { label: 'View Cart', onClick: () => router.push('/checkout') },
    })
  }

  const handleBuyNow = () => {
    if (needsVariant) {
      toast.error('Please select a variant first.')
      return
    }
    addItem({
      product_id: product.id,
      variant_id: selectedVariant,
      quantity,
      price: finalPrice,
      name: product.name + (selectedVariantData ? ` — ${selectedVariantData.name}` : ''),
      image_url: product.image_url,
    })
    router.push('/checkout')
  }

  return (
    <div className="space-y-5">
      {/* Variant selector */}
      {variants.length > 0 && (
        <div>
          <p className="mb-3 text-[11px] uppercase tracking-[0.15em] text-[#7A8EA6]">
            Select Variant
          </p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v.id)}
                className={`border px-4 py-2 text-xs tracking-wide transition-all duration-150 ${
                  selectedVariant === v.id
                    ? 'border-[#1E2737] bg-[#1E2737] text-white'
                    : 'border-[#DDE3EB] text-[#334155] hover:border-[#1E2737]'
                }`}
              >
                {v.name}
                {v.price_adjustment > 0 && (
                  <span className="ml-1 text-[#1969B5]">+৳{v.price_adjustment}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity stepper */}
      <div>
        <p className="mb-3 text-[11px] uppercase tracking-[0.15em] text-[#7A8EA6]">Quantity</p>
        <div className="flex h-11 w-32 items-center border border-[#DDE3EB]">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-full w-11 items-center justify-center text-[#4B5C73] transition-colors hover:bg-[#EEF2F7] hover:text-[#1E2737]"
            aria-label="Decrease quantity"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
          </button>
          <span className="flex-1 text-center text-sm font-medium tabular-nums">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-full w-11 items-center justify-center text-[#4B5C73] transition-colors hover:bg-[#EEF2F7] hover:text-[#1E2737]"
            aria-label="Increase quantity"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={handleAdd}
          className="flex-1 bg-[#1E2737] px-6 py-3.5 text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-[#1969B5]"
        >
          Add to Cart — ৳{(finalPrice * quantity).toLocaleString()}
        </button>
        <button
          onClick={handleBuyNow}
          className="border border-[#1E2737] px-6 py-3.5 text-[11px] uppercase tracking-widest text-[#1E2737] transition-colors hover:bg-[#1E2737] hover:text-white"
        >
          Buy Now
        </button>
      </div>
    </div>
  )
}
