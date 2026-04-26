import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET user's orders
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: orders, error } = await supabase
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
        id,
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
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ orders })
}

// POST create order
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Please sign in to place an order.', code: 'UNAUTHENTICATED' }, { status: 401 })
  }

  const {
    items,
    payment_method,
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    shipping_city,
    shipping_postal_code,
  } = await request.json()

  // Calculate total
  let subtotal = 0
  for (const item of items) {
    const { data: product } = await supabase
      .from('products')
      .select('price')
      .eq('id', item.product_id)
      .single()

    if (product) {
      subtotal += product.price * item.quantity
    }
  }

  const shipping_cost = subtotal > 3000 ? 0 : 100
  const total = subtotal + shipping_cost

  // Generate order number
  const order_number = `ORD-${Date.now()}`

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      order_number,
      payment_method,
      subtotal,
      shipping_cost,
      total,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_city,
      shipping_postal_code,
      status: 'pending',
      payment_status: 'pending',
    })
    .select()
    .single()

  if (orderError || !order) {
    return NextResponse.json({ error: orderError?.message ?? 'Failed to create order.' }, { status: 400 })
  }

  const orderId = order.id

  // Add order items
  for (const item of items) {
    await supabase.from('order_items').insert({
      order_id: orderId,
      product_id: item.product_id,
      variant_id: item.variant_id || null,
      quantity: item.quantity,
      price: item.price,
    })
  }

  // Create payment record
  if (payment_method === 'bkash') {
    await supabase.from('payments').insert({
      order_id: orderId,
      amount: total,
      payment_method: 'bkash',
      status: 'pending',
    })
  }

  return NextResponse.json(order, { status: 201 })
}
