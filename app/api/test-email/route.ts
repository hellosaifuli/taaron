import { sendOrderEmails } from '@/lib/email'
import { NextResponse } from 'next/server'

export async function GET() {
  await sendOrderEmails({
    order_number: 'ORD-TEST-001',
    order_id: 'test-id',
    customer_name: 'Saiful Islam',
    customer_email: 'taaron.store@gmail.com',
    customer_phone: '+880 1920-585212',
    shipping_address: 'House 12, Road 5, Dhanmondi',
    shipping_city: 'Dhaka',
    payment_method: 'cod',
    items: [
      { name: 'Premium Leather Wallet', quantity: 1, price: 1800 },
      { name: 'Leather Belt — Brown', quantity: 2, price: 1200 },
    ],
    subtotal: 4200,
    shipping_cost: 0,
    total: 4200,
  })

  return NextResponse.json({ ok: true, message: 'Test emails sent to taaron.store@gmail.com' })
}
