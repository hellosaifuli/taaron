import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface OrderConfirmationProps {
  params: Promise<{ id: string }>
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select(
      `
      id,
      order_number,
      status,
      payment_method,
      payment_status,
      subtotal,
      shipping_cost,
      total,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_city,
      created_at,
      order_items (
        quantity,
        price,
        products (
          id,
          name,
          image_url
        )
      )
    `
    )
    .eq('id', id)
    .single()

  if (!order) {
    notFound()
  }

  const statusSteps = ['pending', 'confirmed', 'shipped', 'delivered']
  const currentStepIndex = statusSteps.indexOf(order.status)

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold">
            Taaron
          </Link>
          <Link href="/dashboard" className="text-sm hover:underline">
            Back to orders
          </Link>
        </div>
      </header>

      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Order Confirmation */}
          <div className="rounded border border-green-200 bg-green-50 p-6">
            <h1 className="text-2xl font-bold text-green-900">
              ✓ Order Confirmed
            </h1>
            <p className="mt-2 text-green-700">{order.order_number}</p>
          </div>

          {/* Status Timeline */}
          <div className="mt-8">
            <h2 className="font-bold">Order Status</h2>
            <div className="mt-4 flex items-center justify-between gap-2">
              {statusSteps.map((step, idx) => (
                <div key={step} className="flex flex-1 items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full font-medium ${
                      idx <= currentStepIndex
                        ? 'bg-gray-900 text-white'
                        : 'border border-gray-300 text-gray-600'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  {idx < statusSteps.length - 1 && (
                    <div
                      className={`flex-1 border-t ${
                        idx < currentStepIndex ? 'border-gray-900' : 'border-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-sm text-gray-600">
              {statusSteps.map((step) => (
                <span key={step}>{step.charAt(0).toUpperCase() + step.slice(1)}</span>
              ))}
            </div>
          </div>

          {/* Order Details */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {/* Shipping */}
            <div className="rounded border border-gray-200 p-6">
              <h2 className="font-bold">Shipping Address</h2>
              <div className="mt-4 space-y-1 text-sm">
                <p>{order.customer_name}</p>
                <p>{order.shipping_address}</p>
                <p>{order.shipping_city}</p>
                <p>{order.customer_phone}</p>
                <p>{order.customer_email}</p>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded border border-gray-200 p-6">
              <h2 className="font-bold">Payment Information</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Method</span>
                  <span className="font-medium">
                    {order.payment_method.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="font-medium">
                    {order.payment_status.charAt(0).toUpperCase() +
                      order.payment_status.slice(1)}
                  </span>
                </div>
                {order.payment_method === 'cod' && (
                  <div className="mt-3 rounded border-l-4 border-blue-300 bg-blue-50 p-3 text-xs text-blue-700">
                    Please pay on delivery
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mt-8">
            <h2 className="font-bold">Order Items</h2>
            <div className="mt-4 space-y-3">
              {order.order_items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border border-gray-200 p-4"
                >
                  <div>
                    <p className="font-medium">{item.products.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-8 rounded border border-gray-200 p-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>৳{order.shipping_cost}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold">
                <span>Total</span>
                <span>৳{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 flex gap-4">
            <Link
              href="/dashboard"
              className="flex-1 border border-gray-300 px-4 py-3 text-center font-medium hover:bg-gray-50"
            >
              View All Orders
            </Link>
            <Link
              href="/"
              className="flex-1 border border-gray-300 bg-gray-900 px-4 py-3 text-center font-medium text-white hover:bg-gray-800"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
