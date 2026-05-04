import { Resend } from "resend";

const STORE_EMAIL = "taaron.store@gmail.com";
const STORE_NAME = "Taaron";
const FROM = `${STORE_NAME} <orders@taaron.store>`;

interface OrderEmailData {
  order_number: string;
  order_id: string;
  customer_name: string;
  customer_email?: string | null;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  payment_method: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  shipping_cost: number;
  total: number;
}

function ownerEmailHtml(o: OrderEmailData): string {
  const itemRows = o.items
    .map(
      (i) =>
        `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #E5DFD6;font-size:14px;color:#111">${i.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #E5DFD6;font-size:14px;color:#111;text-align:center">${i.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #E5DFD6;font-size:14px;color:#111;text-align:right">৳${(i.price * i.quantity).toLocaleString()}</td>
    </tr>`,
    )
    .join("");

  return `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F7F4EF;font-family:system-ui,sans-serif">
<div style="max-width:560px;margin:40px auto;background:#fff;padding:40px">
  <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.3em;color:#9B6F47;margin:0 0 8px">New Order</p>
  <h1 style="font-size:28px;font-weight:400;color:#111;margin:0 0 4px">${o.order_number}</h1>
  <p style="font-size:13px;color:#5C5652;margin:0 0 32px">${new Date().toLocaleString("en-BD", { timeZone: "Asia/Dhaka" })} BST</p>

  <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
    <thead>
      <tr>
        <th style="text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#9E9690;padding-bottom:8px;border-bottom:1px solid #E5DFD6">Item</th>
        <th style="text-align:center;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#9E9690;padding-bottom:8px;border-bottom:1px solid #E5DFD6">Qty</th>
        <th style="text-align:right;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#9E9690;padding-bottom:8px;border-bottom:1px solid #E5DFD6">Price</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>

  <div style="border-top:1px solid #E5DFD6;padding-top:16px;margin-bottom:32px">
    <div style="display:flex;justify-content:space-between;font-size:13px;color:#5C5652;margin-bottom:6px">
      <span>Subtotal</span><span>৳${o.subtotal.toLocaleString()}</span>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:13px;color:#5C5652;margin-bottom:10px">
      <span>Shipping</span><span>${o.shipping_cost === 0 ? "Free" : `৳${o.shipping_cost}`}</span>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:600;color:#111">
      <span>Total</span><span>৳${o.total.toLocaleString()}</span>
    </div>
  </div>

  <div style="background:#F7F4EF;padding:20px;margin-bottom:24px">
    <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#9E9690;margin:0 0 12px">Customer</p>
    <p style="font-size:14px;font-weight:500;color:#111;margin:0 0 4px">${o.customer_name}</p>
    <p style="font-size:13px;color:#5C5652;margin:0 0 2px">${o.customer_phone}</p>
    ${o.customer_email ? `<p style="font-size:13px;color:#5C5652;margin:0 0 2px">${o.customer_email}</p>` : ""}
    <p style="font-size:13px;color:#5C5652;margin:8px 0 0">${o.shipping_address}, ${o.shipping_city}</p>
  </div>

  <div style="background:${o.payment_method === "cod" ? "#FEF9EE" : "#F0F7F0"};padding:16px;display:flex;align-items:center;gap:12px">
    <div>
      <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#9E9690;margin:0 0 4px">Payment</p>
      <p style="font-size:14px;font-weight:500;color:#111;margin:0">${o.payment_method === "cod" ? "Cash on Delivery" : "bKash"}</p>
    </div>
  </div>
</div>
</body></html>`;
}

function customerEmailHtml(o: OrderEmailData): string {
  const itemRows = o.items
    .map(
      (i) =>
        `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #E5DFD6;font-size:14px;color:#111">${i.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #E5DFD6;font-size:14px;color:#111;text-align:right">৳${(i.price * i.quantity).toLocaleString()}</td>
    </tr>`,
    )
    .join("");

  return `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F7F4EF;font-family:system-ui,sans-serif">
<div style="max-width:560px;margin:40px auto;background:#fff;padding:40px">
  <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.3em;color:#9B6F47;margin:0 0 8px">Taaron</p>
  <h1 style="font-size:24px;font-weight:400;color:#111;margin:0 0 8px">Order Confirmed</h1>
  <p style="font-size:13px;color:#5C5652;margin:0 0 32px">Thank you, ${o.customer_name}. We've received your order.</p>

  <div style="background:#F7F4EF;padding:16px 20px;margin-bottom:28px">
    <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#9E9690;margin:0 0 4px">Order Number</p>
    <p style="font-size:16px;font-weight:500;color:#111;margin:0">${o.order_number}</p>
  </div>

  <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
    <tbody>${itemRows}</tbody>
  </table>

  <div style="border-top:1px solid #E5DFD6;padding-top:16px;margin-bottom:32px">
    <div style="display:flex;justify-content:space-between;font-size:13px;color:#5C5652;margin-bottom:6px">
      <span>Shipping</span><span>${o.shipping_cost === 0 ? "Free" : `৳${o.shipping_cost}`}</span>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:600;color:#111">
      <span>Total</span><span>৳${o.total.toLocaleString()}</span>
    </div>
  </div>

  <p style="font-size:14px;color:#5C5652;line-height:1.6;margin:0 0 24px">
    ${
      o.payment_method === "cod"
        ? "Please prepare exact amount on delivery. Dhaka: 1–2 days · Outside Dhaka: 3–5 days."
        : "We will confirm your bKash payment and process your order shortly."
    }
  </p>

  <p style="font-size:13px;color:#9E9690;margin:0">Questions? WhatsApp us: <a href="https://wa.me/8801648817191" style="color:#9B6F47">+880 1648-817191</a></p>
</div>
</body></html>`;
}

export async function sendOrderEmails(data: OrderEmailData) {
  if (!process.env.RESEND_API_KEY) return;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const emails: Promise<unknown>[] = [
    resend.emails.send({
      from: FROM,
      to: [STORE_EMAIL],
      subject: `New Order ${data.order_number} — ৳${data.total.toLocaleString()} (${data.payment_method.toUpperCase()})`,
      html: ownerEmailHtml(data),
    }),
  ];

  if (data.customer_email) {
    emails.push(
      resend.emails.send({
        from: FROM,
        to: [data.customer_email],
        subject: `Order Confirmed — ${data.order_number} | Taaron`,
        html: customerEmailHtml(data),
      }),
    );
  }

  await Promise.allSettled(emails);
}
