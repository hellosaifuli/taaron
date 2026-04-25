import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const STATUS_STYLES: Record<string, string> = {
  pending:   'border-[#E5DFD6] bg-[#FEF9EE] text-[#9B6F47]',
  confirmed: 'border-[#E5DFD6] bg-[#EDE9E3] text-[#5C5652]',
  shipped:   'border-[#E5DFD6] bg-[#EDE9E3] text-[#5C5652]',
  delivered: 'border-[#E5DFD6] bg-[#EDE9E3] text-[#111111]',
  cancelled: 'border-red-200 bg-red-50 text-red-700',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id, order_number, status, payment_method, payment_status, total, created_at,
      order_items ( quantity, price, products ( id, name ) )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      <div className="mx-auto max-w-screen-lg px-6 pt-28 pb-20 lg:px-12">

        {/* Header */}
        <div className="mb-12 flex items-end justify-between border-b border-[#E5DFD6] pb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: '#9B6F47' }}>Account</p>
            <h1
              className="mt-3 text-[#111111]"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                lineHeight: '1',
                letterSpacing: '-0.01em',
                fontWeight: 400,
              }}
            >
              My Orders
            </h1>
          </div>
          <div className="mb-1 flex items-center gap-6 text-[11px] uppercase tracking-widest text-[#5C5652]">
            <span className="hidden sm:block">{user.email}</span>
            <Link href="/" className="transition-colors hover:text-[#111111]">Shop</Link>
            <form action="/api/auth/sign-out" method="POST">
              <button type="submit" className="transition-colors hover:text-[#111111]">Sign Out</button>
            </form>
          </div>
        </div>

        {/* Orders */}
        {orders && orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((order: any) => (
              <div
                key={order.id}
                className="border border-[#E5DFD6] bg-white p-6 transition-colors hover:border-[#111111]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#9E9690]">Order</p>
                    <h2 className="mt-1 font-medium text-[#111111]">{order.order_number}</h2>
                    <p className="mt-1 text-xs text-[#9E9690]">
                      {new Date(order.created_at).toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="font-medium text-[#111111]"
                      style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}
                    >
                      ৳{order.total.toLocaleString()}
                    </p>
                    <span
                      className={`mt-2 inline-block border px-3 py-1 text-[10px] uppercase tracking-wider ${STATUS_STYLES[order.status] ?? 'border-[#E5DFD6] bg-[#EDE9E3] text-[#5C5652]'}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-1 border-t border-[#E5DFD6] pt-4">
                  {order.order_items.map((item: any, idx: number) => (
                    <p key={idx} className="text-sm text-[#5C5652]">
                      {item.products?.name ?? 'Product'} × {item.quantity}
                    </p>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#E5DFD6] pt-4 text-xs">
                  <div className="text-[#9E9690]">
                    <span className="uppercase tracking-wider">{order.payment_method}</span>
                    {' · '}
                    <span className="capitalize">{order.payment_status}</span>
                  </div>
                  <Link
                    href={`/order-confirmation/${order.id}`}
                    className="text-[11px] uppercase tracking-widest text-[#111111] underline-offset-4 hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-[#E5DFD6] bg-white px-8 py-20 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#9E9690]">Nothing here yet</p>
            <p className="mt-4 text-sm text-[#5C5652]">Your orders will appear here once you place one.</p>
            <Link
              href="/"
              className="mt-8 inline-block bg-[#111111] px-8 py-3 text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-[#9B6F47]"
            >
              Start Shopping
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
