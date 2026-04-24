import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET all products
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = (page - 1) * limit

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select(
      `
      id,
      name,
      description,
      price,
      sku,
      image_url,
      thumbnail_url,
      created_at,
      product_variants (
        id,
        name,
        sku,
        price_adjustment,
        stock_quantity,
        image_url
      )
    `
    )
    .eq('status', 'active')
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false })

  if (productsError) {
    return NextResponse.json({ error: productsError.message }, { status: 400 })
  }

  return NextResponse.json({
    products,
    page,
    limit,
  })
}

// POST create product (admin only)
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name, description, price, cost, sku, image_url, thumbnail_url } =
    await request.json()

  const { data, error } = await supabase
    .from('products')
    .insert({
      name,
      description,
      price,
      cost,
      sku,
      image_url,
      thumbnail_url,
    })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data[0], { status: 201 })
}
