'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/header'

interface CartItem {
  product_id: string
  variant_id: string | null
  quantity: number
  price: number
  name: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
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

  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      setCart(JSON.parse(stored))
    }
  }, [])

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 50
  const total = subtotal + shipping

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
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
          items: cart,
          payment_method: paymentMethod,
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create order')
      } else {
        localStorage.removeItem('cart')
        router.push(`/order-confirmation/${data.id}`)
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center px-4 py-16">
          <div className="text-center">
            <p className="text-gray-600">Your cart is empty</p>
            <Link href="/" className="mt-4 inline-block font-medium hover:text-gray-600">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-light">Checkout</h1>

        <div className="mt-8 grid gap-12 lg:grid-cols-3">
          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 p-6">
              <h2 className="font-semibold">Order Summary</h2>
              <div className="mt-6 space-y-3 border-t border-gray-200 pt-6">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>
                      {item.name} ×{item.quantity}
                    </span>
                    <span>Tk {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-2 border-t border-gray-200 pt-6 font-medium">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>Tk {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>Tk {shipping}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-4 text-lg">
                  <span>Total</span>
                  <span>Tk {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
            {error && (
              <div className="border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <h2 className="font-semibold">Shipping Address</h2>
              <div className="mt-6 space-y-4">
                <input
                  type="text"
                  name="customer_name"
                  placeholder="Full Name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  required
                />
                <input
                  type="email"
                  name="customer_email"
                  placeholder="Email"
                  value={formData.customer_email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  required
                />
                <input
                  type="tel"
                  name="customer_phone"
                  placeholder="Phone Number"
                  value={formData.customer_phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  required
                />
                <textarea
                  name="shipping_address"
                  placeholder="Address"
                  value={formData.shipping_address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shipping_address: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  rows={3}
                  required
                />
                <input
                  type="text"
                  name="shipping_city"
                  placeholder="City"
                  value={formData.shipping_city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  required
                />
                <input
                  type="text"
                  name="shipping_postal_code"
                  placeholder="Postal Code"
                  value={formData.shipping_postal_code}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>
            </div>

            <div>
              <h2 className="font-semibold">Payment Method</h2>
              <div className="mt-6 space-y-3">
                <label className="flex cursor-pointer items-center gap-4 border border-gray-200 p-4 hover:bg-gray-50">
                  <input
                    type="radio"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'bkash')}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">Cash on Delivery (COD)</span>
                </label>
                <label className="flex cursor-pointer items-center gap-4 border border-gray-200 p-4 hover:bg-gray-50">
                  <input
                    type="radio"
                    value="bkash"
                    checked={paymentMethod === 'bkash'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'bkash')}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">bKash Mobile Payment</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full border-2 border-gray-900 bg-gray-900 px-6 py-3 font-medium text-white hover:bg-white hover:text-gray-900 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
