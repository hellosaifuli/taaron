import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import FadeInSection from '@/components/fade-in-section'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'Your Taaron order has been placed successfully.',
  robots: { index: false, follow: false },
}

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

  const orderDate = new Date(order.created_at)
  const isDhaka = order.shipping_city?.toLowerCase().includes('dhaka')
  const deliveryDaysMin = isDhaka ? 1 : 3
  const deliveryDaysMax = isDhaka ? 2 : 5
  const deliveryEarliest = new Date(orderDate)
  deliveryEarliest.setDate(orderDate.getDate() + deliveryDaysMin)
  const deliveryLatest = new Date(orderDate)
  deliveryLatest.setDate(orderDate.getDate() + deliveryDaysMax)
  const fmt = (d: Date) => d.toLocaleDateString('en-BD', { day: 'numeric', month: 'short' })

  return (
    <div className="min-h-screen bg-[#F7F4EF] pt-24 pb-20">
      <div className="mx-auto max-w-2xl px-6 lg:px-8">

        {/* Confirmation header */}
        <FadeInSection from="up" className="mb-10">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#9B6F47]">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-medium text-[#111111]" style={{ fontFamily: 'var(--font-display)' }}>
                Order Confirmed
              </h1>
              <p className="mt-0.5 text-xs uppercase tracking-widest text-[#9E9690]">{order.order_number}</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-[#5C5652]">
            Thank you, <strong className="text-[#111111]">{order.customer_name}</strong>. Your order has been placed successfully.{' '}
            {order.payment_method === 'cod'
              ? 'Please prepare payment on delivery.'
              : "We'll confirm your bKash payment shortly."}
          </p>
        </FadeInSection>

        {/* Estimated delivery */}
        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <FadeInSection delay={100} from="up">
            <div className="mb-6 flex items-center gap-4 bg-[#FEF9EE] px-6 py-4">
              <svg className="h-5 w-5 flex-shrink-0 text-[#9B6F47]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#9B6F47]">Estimated Delivery</p>
                <p className="mt-0.5 text-sm font-medium text-[#111111]">
                  {fmt(deliveryEarliest)} – {fmt(deliveryLatest)}
                </p>
                <p className="text-xs text-[#9E9690]">
                  {isDhaka ? 'Within Dhaka: 1–2 business days' : 'Outside Dhaka: 3–5 business days'}
                </p>
              </div>
            </div>
          </FadeInSection>
        )}

        {/* Order status tracker */}
        <FadeInSection delay={160} from="up">
          <div className="mb-6 bg-white p-6">
            <p className="mb-6 text-[10px] uppercase tracking-[0.4em] text-[#9E9690]">Order Status</p>
            <div className="flex items-center">
              {statusSteps.map((step, idx) => (
                <div key={step} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-7 w-7 items-center justify-center text-xs font-medium ${
                      idx <= currentStepIndex
                        ? 'bg-[#111111] text-white'
                        : 'border border-[#E5DFD6] text-[#9E9690]'
                    }`}>
                      {idx < currentStepIndex ? (
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : idx + 1}
                    </div>
                    <span className="mt-2 text-[9px] uppercase tracking-wider text-[#9E9690] capitalize">
                      {step}
                    </span>
                  </div>
                  {idx < statusSteps.length - 1 && (
                    <div className={`mb-4 flex-1 border-t ${idx < currentStepIndex ? 'border-[#9B6F47]' : 'border-[#E5DFD6]'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>

        {/* Details grid */}
        <FadeInSection delay={220} from="up">
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div className="bg-white p-6">
              <p className="mb-4 text-[10px] uppercase tracking-[0.4em] text-[#9E9690]">Shipping To</p>
              <div className="space-y-1 text-sm text-[#5C5652]">
                <p className="font-medium text-[#111111]">{order.customer_name}</p>
                <p>{order.shipping_address}</p>
                <p>{order.shipping_city}</p>
                <p>{order.customer_phone}</p>
                {order.customer_email && <p>{order.customer_email}</p>}
              </div>
            </div>

            <div className="bg-white p-6">
              <p className="mb-4 text-[10px] uppercase tracking-[0.4em] text-[#9E9690]">Payment</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#9E9690]">Method</span>
                  <span className="font-medium text-[#111111]">
                    {order.payment_method === 'cod' ? 'Cash on Delivery' : 'bKash'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9E9690]">Status</span>
                  <span className={`font-medium ${order.payment_status === 'paid' ? 'text-green-600' : 'text-[#9B6F47]'}`}>
                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                  </span>
                </div>
                {order.payment_method === 'cod' && (
                  <p className="mt-2 border-l-2 border-[#9B6F47] pl-3 text-xs text-[#5C5652]">
                    Please have exact amount ready on delivery.
                  </p>
                )}
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* Items + totals */}
        <FadeInSection delay={280} from="up">
          <div className="mb-8 bg-white p-6">
            <p className="mb-6 text-[10px] uppercase tracking-[0.4em] text-[#9E9690]">Items</p>
            <div className="divide-y divide-[#E5DFD6]">
              {order.order_items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between py-4 first:pt-0">
                  <div>
                    <p className="text-sm font-medium text-[#111111]">{item.products?.name || 'Product'}</p>
                    <p className="text-xs text-[#9E9690]">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm tabular-nums text-[#111111]">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t border-[#E5DFD6] pt-4 text-sm">
              <div className="flex justify-between text-[#5C5652]">
                <span>Subtotal</span>
                <span className="tabular-nums">৳{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#5C5652]">
                <span>Shipping</span>
                <span className="tabular-nums">
                  {order.shipping_cost === 0 ? <span className="text-[#9B6F47]">Free</span> : `৳${order.shipping_cost}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#E5DFD6] pt-3 font-semibold text-[#111111]">
                <span>Total</span>
                <span className="tabular-nums">৳{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* CTAs */}
        <FadeInSection delay={340} from="up">
          <div className="flex gap-4">
            <Link
              href="/"
              className="flex-1 bg-[#111111] px-6 py-3.5 text-center text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-[#9B6F47]"
            >
              Continue Shopping
            </Link>
            <Link
              href="/dashboard"
              className="flex-1 border border-[#E5DFD6] px-6 py-3.5 text-center text-[11px] uppercase tracking-widest text-[#5C5652] transition-colors hover:border-[#111111] hover:text-[#111111]"
            >
              View Orders
            </Link>
          </div>
        </FadeInSection>

      </div>
    </div>
  )
}
