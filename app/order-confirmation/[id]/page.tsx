import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface OrderConfirmationProps {
  params: Promise<{ id: string }>
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select(`
      id, order_number, status, payment_method, payment_status,
      subtotal, shipping_cost, total,
      customer_name, customer_email, customer_phone,
      shipping_address, shipping_city, created_at,
      order_items (
        quantity, price,
        products ( id, name, image_url )
      )
    `)
    .eq('id', id)
    .single()

  if (!order) notFound()

  const statusSteps = ['pending', 'confirmed', 'shipped', 'delivered']
  const currentStepIndex = statusSteps.indexOf(order.status)

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-6 lg:px-12">

        {/* Confirmation header */}
        <div className="mb-10 border border-[#DDE3EB] bg-white p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#1E2737]">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h1 className="font-serif text-2xl font-medium text-[#1E2737]" style={{ fontFamily: 'var(--font-display)' }}>
                Order Confirmed
              </h1>
              <p className="mt-0.5 text-sm text-[#7A8EA6]">{order.order_number}</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-[#4B5C73]">
            Thank you, <strong>{order.customer_name}</strong>. Your order has been placed successfully.
            {order.payment_method === 'cod'
              ? ' Please prepare payment on delivery.'
              : ' We\'ll confirm your bKash payment shortly.'}
          </p>
        </div>

        {/* Order status */}
        <div className="mb-6 border border-[#DDE3EB] bg-white p-6">
          <h2 className="mb-6 text-[11px] font-semibold uppercase tracking-widest text-[#1E2737]">Order Status</h2>
          <div className="flex items-center">
            {statusSteps.map((step, idx) => (
              <div key={step} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div className={`flex h-8 w-8 items-center justify-center text-xs font-medium ${
                    idx <= currentStepIndex
                      ? 'bg-[#1E2737] text-white'
                      : 'border border-[#DDE3EB] text-[#7A8EA6]'
                  }`}>
                    {idx < currentStepIndex ? (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : idx + 1}
                  </div>
                  <span className="mt-2 text-[10px] uppercase tracking-wider text-[#7A8EA6]">
                    {step}
                  </span>
                </div>
                {idx < statusSteps.length - 1 && (
                  <div className={`mb-4 flex-1 border-t ${idx < currentStepIndex ? 'border-[#1E2737]' : 'border-[#DDE3EB]'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Details grid */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="border border-[#DDE3EB] bg-white p-6">
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-[#1E2737]">Shipping To</h2>
            <div className="space-y-1 text-sm text-[#4B5C73]">
              <p className="font-medium text-[#1E2737]">{order.customer_name}</p>
              <p>{order.shipping_address}</p>
              <p>{order.shipping_city}</p>
              <p>{order.customer_phone}</p>
              {order.customer_email && <p>{order.customer_email}</p>}
            </div>
          </div>

          <div className="border border-[#DDE3EB] bg-white p-6">
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-[#1E2737]">Payment</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#7A8EA6]">Method</span>
                <span className="font-medium text-[#1E2737]">
                  {order.payment_method === 'cod' ? 'Cash on Delivery' : 'bKash'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A8EA6]">Status</span>
                <span className={`font-medium ${order.payment_status === 'paid' ? 'text-green-600' : 'text-[#1969B5]'}`}>
                  {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                </span>
              </div>
              {order.payment_method === 'cod' && (
                <p className="mt-2 border-l-2 border-[#1969B5] pl-3 text-xs text-[#4B5C73]">
                  Please have exact amount ready on delivery.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Items + totals */}
        <div className="border border-[#DDE3EB] bg-white p-6">
          <h2 className="mb-6 text-[11px] font-semibold uppercase tracking-widest text-[#1E2737]">Items</h2>
          <div className="divide-y divide-[#DDE3EB]">
            {order.order_items.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-medium text-[#1E2737]">{item.products?.name || 'Product'}</p>
                  <p className="text-xs text-[#7A8EA6]">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm tabular-nums text-[#1E2737]">
                  ৳{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-[#DDE3EB] pt-4 text-sm">
            <div className="flex justify-between text-[#4B5C73]">
              <span>Subtotal</span>
              <span className="tabular-nums">৳{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#4B5C73]">
              <span>Shipping</span>
              <span className="tabular-nums">৳{order.shipping_cost}</span>
            </div>
            <div className="flex justify-between border-t border-[#DDE3EB] pt-3 text-base font-semibold text-[#1E2737]">
              <span>Total</span>
              <span className="tabular-nums">৳{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex gap-4">
          <Link
            href="/"
            className="flex-1 bg-[#1E2737] px-6 py-3.5 text-center text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-[#1969B5]"
          >
            Continue Shopping
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 border border-[#DDE3EB] px-6 py-3.5 text-center text-[11px] uppercase tracking-widest text-[#4B5C73] transition-colors hover:border-[#1E2737] hover:text-[#1E2737]"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  )
}
