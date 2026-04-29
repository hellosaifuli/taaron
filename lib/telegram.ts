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

export async function notifyTelegram(order: OrderNotification) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("[Telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set.");
    return;
  }

  const itemLines = order.items
    .map((i) => `  • ${i.name} ×${i.quantity} — ৳${(i.price * i.quantity).toLocaleString()}`)
    .join("\n");

  const text = `🛍️ <b>New Order — ${order.order_number}</b>

👤 <b>${order.customer_name}</b>
📞 ${order.customer_phone}
📍 ${order.shipping_address}, ${order.shipping_city}
💳 ${order.payment_method === "bkash" ? "bKash" : "Cash on Delivery"}

🧾 <b>Items:</b>
${itemLines}

Subtotal: ৳${order.subtotal.toLocaleString()}
Shipping: ${order.shipping_cost > 0 ? `৳${order.shipping_cost}` : "Free"}
<b>Total: ৳${order.total.toLocaleString()}</b>`;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
        }),
      },
    );
    if (!res.ok) {
      console.error("[Telegram] Error:", await res.text());
    }
  } catch (err) {
    console.error("[Telegram] Failed to send:", err);
  }
}
