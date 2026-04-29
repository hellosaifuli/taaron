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

  if (!phone || !apiKey) {
    console.warn("[WhatsApp] CALLMEBOT_PHONE or CALLMEBOT_API_KEY not set — skipping notification.");
    return;
  }

  const itemLines = order.items
    .map((i) => `- ${i.name} x${i.quantity} = BDT ${(i.price * i.quantity).toLocaleString()}`)
    .join("\n");

  const text = [
    `New Order: ${order.order_number}`,
    ``,
    `Customer: ${order.customer_name}`,
    `Phone: ${order.customer_phone}`,
    `Address: ${order.shipping_address}, ${order.shipping_city}`,
    `Payment: ${order.payment_method === "bkash" ? "bKash" : "Cash on Delivery"}`,
    ``,
    `Items:`,
    itemLines,
    ``,
    `Subtotal: BDT ${order.subtotal.toLocaleString()}`,
    `Shipping: ${order.shipping_cost > 0 ? `BDT ${order.shipping_cost}` : "Free"}`,
    `Total: BDT ${order.total.toLocaleString()}`,
  ].join("\n");

  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(text)}&apikey=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`[WhatsApp] CallMeBot error ${res.status}:`, await res.text());
    }
  } catch (err) {
    console.error("[WhatsApp] Failed to send notification:", err);
  }
}
