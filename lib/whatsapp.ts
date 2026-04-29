interface OrderNotification {
  order_number: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  payment_method: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  shipping_cost: number;
  total: number;
}

export async function notifyWhatsApp(order: OrderNotification) {
  const phone = process.env.CALLMEBOT_PHONE;
  const apiKey = process.env.CALLMEBOT_API_KEY;

  if (!phone || !apiKey) return; // silently skip if not configured

  const itemLines = order.items
    .map((i) => `  • ${i.name} x${i.quantity} — ৳${(i.price * i.quantity).toLocaleString()}`)
    .join("%0A");

  const message = [
    `🛍️ New Order — ${order.order_number}`,
    ``,
    `👤 ${order.customer_name}`,
    `📞 ${order.customer_phone}`,
    `📍 ${order.shipping_address}, ${order.shipping_city}`,
    `💳 ${order.payment_method === "bkash" ? "bKash" : "Cash on Delivery"}`,
    ``,
    `🧾 Items:`,
    itemLines,
    ``,
    `Subtotal: ৳${order.subtotal.toLocaleString()}`,
    order.shipping_cost > 0 ? `Shipping: ৳${order.shipping_cost}` : `Shipping: Free`,
    `*Total: ৳${order.total.toLocaleString()}*`,
  ]
    .join("%0A")
    .replace(/ /g, "%20")
    .replace(/—/g, "-")
    .replace(/•/g, "*")
    .replace(/🛍️|👤|📞|📍|💳|🧾/g, (e) => encodeURIComponent(e));

  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${message}&apikey=${apiKey}`;

  try {
    await fetch(url);
  } catch {
    // fire-and-forget — never block order creation
  }
}
