import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendOrderEmails } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";

// GET user's orders (auth required)
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
      id, order_number, status, payment_method, payment_status, total, created_at,
      order_items ( id, quantity, price, products ( id, name, image_url ) )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ orders });
}

// POST create order — guest checkout supported (user_id nullable)
export async function POST(request: NextRequest) {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  // Use admin client for inserts so guest orders bypass RLS
  const supabase = createAdminClient();

  const {
    items,
    payment_method,
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    shipping_city,
    shipping_postal_code,
  } = await request.json();

  if (
    !items?.length ||
    !customer_name ||
    !customer_phone ||
    !shipping_address ||
    !shipping_city
  ) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 },
    );
  }

  // Server-side price verification — includes variant price_adjustment
  const verifiedPrices = new Map<string, number>();
  let subtotal = 0;
  for (const item of items) {
    const { data: product } = await supabase
      .from("products")
      .select("price")
      .eq("id", item.product_id)
      .single();
    if (!product) continue;
    let unitPrice = product.price;
    if (item.variant_id) {
      const { data: variant } = await supabase
        .from("product_variants")
        .select("price_adjustment")
        .eq("id", item.variant_id)
        .single();
      if (variant) unitPrice += variant.price_adjustment;
    }
    verifiedPrices.set(`${item.product_id}:${item.variant_id ?? ""}`, unitPrice);
    subtotal += unitPrice * item.quantity;
  }

  const shipping_cost = subtotal > 3000 ? 0 : 100;
  const total = subtotal + shipping_cost;
  const order_number = `ORD-${Date.now()}`;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      order_number,
      payment_method,
      subtotal,
      shipping_cost,
      total,
      customer_name,
      customer_email: customer_email || null,
      customer_phone,
      shipping_address,
      shipping_city,
      shipping_postal_code: shipping_postal_code || null,
      status: "pending",
      payment_status: "pending",
    })
    .select()
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: orderError?.message ?? "Failed to create order." },
      { status: 400 },
    );
  }

  const orderId = order.id;

  for (const item of items) {
    const verifiedPrice =
      verifiedPrices.get(`${item.product_id}:${item.variant_id ?? ""}`) ??
      item.price;
    await supabase.from("order_items").insert({
      order_id: orderId,
      product_id: item.product_id,
      variant_id: item.variant_id || null,
      quantity: item.quantity,
      price: verifiedPrice,
    });
  }

  if (payment_method === "bkash") {
    await supabase.from("payments").insert({
      order_id: orderId,
      amount: total,
      payment_method: "bkash",
      status: "pending",
    });
  }

  // Fire-and-forget email notifications
  sendOrderEmails({
    order_number,
    order_id: orderId,
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    shipping_city,
    payment_method,
    items: items.map(
      (i: { name: string; quantity: number; price: number }) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
      }),
    ),
    subtotal,
    shipping_cost,
    total,
  });

  return NextResponse.json(order, { status: 201 });
}
