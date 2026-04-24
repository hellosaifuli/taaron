import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  const { data: orders } = await supabase
    .from('orders')
    .select(
      `
      id,
      order_number,
      status,
      payment_method,
      payment_status,
      total,
      created_at,
      order_items (
        quantity,
        price,
        products (
          id,
          name
        )
      )
    `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    shipped: 'bg-blue-50 text-blue-700 border-blue-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  }

  return (
    <div className="w-full">
      <header className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold">
            Taaron
          </Link>
          <nav className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <button className="text-sm hover:underline">Logout</button>
          </nav>
        </div>
      </header>

      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">My Orders</h1>
            <Link href="/" className="text-sm hover:underline">
              Continue shopping
            </Link>
          </div>

          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <div
                  key={order.id}
                  className="border border-gray-200 p-6 hover:border-gray-300"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-bold">{order.order_number}</h2>
                      <p className="mt-1 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        ৳{order.total.toLocaleString()}
                      </p>
                      <span
                        className={`mt-2 inline-block border px-3 py-1 text-xs font-medium ${statusColors[order.status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1 border-t border-gray-200 pt-4 text-sm text-gray-600">
                    {order.order_items.map((item: any, idx: number) => (
                      <p key={idx}>
                        {item.products.name} × {item.quantity}
                      </p>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-sm">
                    <div>
                      <p className="font-medium">Payment: {order.payment_method.toUpperCase()}</p>
                      <p className="text-gray-600">
                        Status:{' '}
                        {order.payment_status.charAt(0).toUpperCase() +
                          order.payment_status.slice(1)}
                      </p>
                    </div>
                    <Link
                      href={`/order-confirmation/${order.id}`}
                      className="font-medium hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded border border-gray-200 p-8 text-center">
              <p className="text-gray-600">No orders yet</p>
              <Link href="/" className="mt-4 inline-block font-medium hover:underline">
                Start shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
