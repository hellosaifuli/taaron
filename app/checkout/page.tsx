'use client'

import { useCart } from '@/components/cart-provider'
import { TrashIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart, removeItem: removeFromCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash'>('cod')
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_postal_code: '',
  })

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 3000 ? 0 : 100
  const total = subtotal + shipping

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const removeItem = (index: number) => {
    removeFromCart(index)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          payment_method: paymentMethod,
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create order')
      } else {
        clearCart()
        router.push(`/order-confirmation/${data.id}`)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#F7F4EF] px-4 text-center">
        <div className="h-px w-12 bg-[#9B6F47]" />
        <p className="text-sm text-[#5C5652]">Your cart is empty.</p>
        <Link
          href="/"
          className="bg-[#111111] px-8 py-3 text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-[#9B6F47]"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F4EF] pt-24 pb-20">
      <div className="mx-auto max-w-screen-xl px-6 lg:px-12">

        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-3xl font-medium lg:text-4xl" style={{ fontFamily: 'var(--font-display)' }}>
            Checkout
          </h1>
          <div className="mt-3 h-px w-12 bg-[#9B6F47]" />
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-16 xl:grid-cols-[1fr_440px]">

          {/* ── Form — order-2 on mobile so summary shows first ── */}
          <form onSubmit={handleSubmit} className="order-2 space-y-10 lg:order-1">

            {error && (
              <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Shipping */}
            <section>
              <h2 className="mb-6 text-[11px] font-semibold uppercase tracking-widest text-[#111111]">
                Shipping Information
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-[#9E9690]">Full Name *</label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full border border-[#E5DFD6] bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#CBD5E1] focus:border-[#111111]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-[#9E9690]">Email</label>
                  <input
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full border border-[#E5DFD6] bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#CBD5E1] focus:border-[#111111]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-[#9E9690]">Phone *</label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    required
                    placeholder="+880 1XXXXXXXXX"
                    className="w-full border border-[#E5DFD6] bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#CBD5E1] focus:border-[#111111]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-[#9E9690]">Address *</label>
                  <textarea
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="House, Road, Area"
                    className="w-full border border-[#E5DFD6] bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#CBD5E1] focus:border-[#111111]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-[#9E9690]">City *</label>
                  <input
                    type="text"
                    name="shipping_city"
                    value={formData.shipping_city}
                    onChange={handleChange}
                    required
                    placeholder="Dhaka"
                    className="w-full border border-[#E5DFD6] bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#CBD5E1] focus:border-[#111111]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-[#9E9690]">Postal Code</label>
                  <input
                    type="text"
                    name="shipping_postal_code"
                    value={formData.shipping_postal_code}
                    onChange={handleChange}
                    placeholder="1200"
                    className="w-full border border-[#E5DFD6] bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#CBD5E1] focus:border-[#111111]"
                  />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section>
              <h2 className="mb-6 text-[11px] font-semibold uppercase tracking-widest text-[#111111]">
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className={`flex cursor-pointer items-center gap-4 border px-5 py-4 transition-colors ${paymentMethod === 'cod' ? 'border-[#1E2737] bg-white' : 'border-[#E5DFD6] hover:border-[#7A8EA6]'}`}>
                  <input
                    type="radio"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'bkash')}
                    className="h-4 w-4 accent-[#111111]"
                  />
                  <div>
                    <p className="text-sm font-medium text-[#111111]">Cash on Delivery (COD)</p>
                    <p className="text-xs text-[#9E9690]">Pay when your order arrives</p>
                  </div>
                </label>
                <label className={`flex cursor-pointer items-center gap-4 border px-5 py-4 transition-colors ${paymentMethod === 'bkash' ? 'border-[#1E2737] bg-white' : 'border-[#E5DFD6] hover:border-[#7A8EA6]'}`}>
                  <input
                    type="radio"
                    value="bkash"
                    checked={paymentMethod === 'bkash'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'bkash')}
                    className="h-4 w-4 accent-[#111111]"
                  />
                  <div>
                    <p className="text-sm font-medium text-[#111111]">bKash Mobile Payment</p>
                    <p className="text-xs text-[#9E9690]">Pay securely with bKash</p>
                  </div>
                </label>
              </div>
            </section>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111111] py-4 text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-[#9B6F47] disabled:opacity-60"
            >
              {loading ? 'Placing Order…' : `Place Order — ৳${total.toLocaleString()}`}
            </button>
          </form>

          {/* ── Order Summary — order-1 on mobile so it shows first ── */}
          <aside className="order-1 h-fit border border-[#E5DFD6] bg-white p-6 lg:order-2 lg:sticky lg:top-24">
            <h2 className="mb-6 text-[11px] font-semibold uppercase tracking-widest text-[#111111]">
              Order Summary
            </h2>

            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  {item.image_url ? (
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden bg-[#EDE9E3]">
                      <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="64px" />
                    </div>
                  ) : (
                    <div className="h-16 w-16 flex-shrink-0 bg-[#EDE9E3]" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-[#111111]">{item.name}</p>
                    <p className="text-xs text-[#9E9690]">Qty: {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#111111] tabular-nums">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="ml-1 flex h-6 w-6 items-center justify-center rounded hover:bg-red-50 transition-colors"
                      aria-label="Remove item"
                    >
                      <TrashIcon className="h-4 w-4 text-red-600 hover:text-red-700" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-[#E5DFD6] pt-6 text-sm">
              <div className="flex justify-between text-[#5C5652]">
                <span>Subtotal</span>
                <span className="tabular-nums">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#5C5652]">
                <span>Shipping</span>
                <span className="tabular-nums">
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `৳${shipping}`
                  )}
                </span>
              </div>
              {shipping === 0 && (
                <p className="text-[10px] text-green-600 uppercase tracking-wider">
                  Free shipping applied (orders over ৳3,000)
                </p>
              )}
              <div className="flex justify-between border-t border-[#E5DFD6] pt-4 text-base font-semibold text-[#111111]">
                <span>Total</span>
                <span className="tabular-nums">৳{total.toLocaleString()}</span>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  )
}
