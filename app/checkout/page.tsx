"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, removeItem: removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash">("cod");
  const [isGuest, setIsGuest] = useState(true);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
    shipping_city: "",
    shipping_postal_code: "",
  });

  // Pre-fill email if the user is already signed in
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setIsGuest(false);
        setFormData((prev) => ({ ...prev, customer_email: user.email ?? "" }));
      }
    });
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 3000 ? 0 : 100;
  const total = subtotal + shipping;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          payment_method: paymentMethod,
          ...formData,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to create order");
      } else {
        clearCart();
        router.push(`/order-confirmation/${data.id}`);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F7F4EF]">
        {/* Top gradient strip */}
        <div
          className="flex-shrink-0 pt-28 pb-12 px-6 lg:px-16"
          style={{
            background:
              "linear-gradient(135deg, #F0EDE7 0%, #E2D9CC 50%, #D4BFA0 100%)",
            minHeight: "30vh",
          }}
        >
          <div className="mx-auto max-w-screen-xl flex flex-col items-center text-center">
            {/* Leather stitch icon */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="4"
                  y="12"
                  width="32"
                  height="20"
                  rx="2"
                  stroke="#9B6F47"
                  strokeWidth="1.5"
                />
                <path
                  d="M4 18h32"
                  stroke="#9B6F47"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <path
                  d="M14 8l2 4M20 8v4M26 8l-2 4"
                  stroke="#9B6F47"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle
                  cx="20"
                  cy="24"
                  r="3"
                  stroke="#9B6F47"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#9B6F47] mb-3">
              Your Cart
            </p>
            <h1
              className="text-[#111111]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontWeight: 400,
                letterSpacing: "-0.01em",
                lineHeight: 1.1,
              }}
            >
              Nothing here yet
            </h1>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#5C5652]">
              Your bag is empty. Explore our leather goods — crafted for
              everyday elegance.
            </p>
            <Link
              href="/"
              className="mt-8 bg-[#111111] px-10 py-4 text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-[#9B6F47]"
            >
              Shop the Collection
            </Link>
          </div>
        </div>

        {/* Category quick links */}
        <div className="mx-auto w-full max-w-screen-xl px-6 py-14 lg:px-16">
          <p className="mb-8 text-[10px] uppercase tracking-[0.4em] text-[#9E9690]">
            Browse Categories
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: "Wallets", href: "/category/wallets" },
              { label: "Bags", href: "/category/bags" },
              { label: "Belts", href: "/category/belts" },
              { label: "Card Holders", href: "/category/cardholder" },
              { label: "Ladies Bags", href: "/category/ladies" },
              { label: "All Products", href: "/category/all" },
            ].map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group border border-[#E5DFD6] px-4 py-5 text-center transition-all duration-200 hover:border-[#9B6F47] hover:bg-white"
              >
                <span className="text-[11px] uppercase tracking-widest text-[#5C5652] transition-colors group-hover:text-[#9B6F47]">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#111111]">
      {/* Banner header */}
      <div
        className="relative flex flex-col justify-end overflow-hidden px-6 pb-10 pt-28 lg:px-16 lg:pb-12 lg:pt-32"
        style={{
          background:
            "linear-gradient(135deg, #F0EDE7 0%, #E2D9CC 50%, #D4BFA0 100%)",
          minHeight: "24vh",
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 50%, #F7F4EF 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-screen-xl w-full">
          <h1
            className="text-[#111111]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
              lineHeight: "1.05",
              letterSpacing: "-0.01em",
              fontWeight: 400,
            }}
          >
            Checkout
          </h1>
          <p className="mt-2 text-sm text-[#5C5652]">
            {items.length} {items.length === 1 ? "item" : "items"} · ৳
            {total.toLocaleString()} total
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-screen-xl px-6 py-14 lg:px-16 lg:py-18">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-20 xl:grid-cols-[1fr_420px]">
          {/* Form */}
          <form onSubmit={handleSubmit} className="order-2 lg:order-1">
            {/* Guest sign-in nudge */}
            {isGuest && (
              <div className="mb-8 flex items-center justify-between border border-[#E5DFD6] bg-white px-5 py-4">
                <p className="text-sm text-[#5C5652]">
                  Have an account?{" "}
                  <Link
                    href="/auth?redirect=/checkout"
                    className="font-medium text-[#9B6F47] hover:underline"
                  >
                    Sign in
                  </Link>{" "}
                  to track your orders.
                </p>
                <span className="ml-4 flex-shrink-0 text-[10px] uppercase tracking-widest text-[#9E9690]">
                  Optional
                </span>
              </div>
            )}

            {error && (
              <div className="mb-8 border-l-2 border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Shipping */}
            <div className="mb-10">
              <p className="mb-6 text-[10px] uppercase tracking-[0.4em] text-[#9E9690]">
                Shipping Information
              </p>
              <div className="grid gap-8 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase tracking-widest text-[#5C5652]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="mt-2 w-full border-0 border-b border-[#B8AFA5] bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-[#B8AFA5] focus:border-[#9B6F47]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#5C5652]">
                    Email
                  </label>
                  <input
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="mt-2 w-full border-0 border-b border-[#B8AFA5] bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-[#B8AFA5] focus:border-[#9B6F47]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#5C5652]">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    required
                    placeholder="+880 1XXXXXXXXX"
                    className="mt-2 w-full border-0 border-b border-[#B8AFA5] bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-[#B8AFA5] focus:border-[#9B6F47]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase tracking-widest text-[#5C5652]">
                    Address *
                  </label>
                  <textarea
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleChange}
                    required
                    rows={2}
                    placeholder="House, Road, Area"
                    className="mt-2 w-full resize-none border-0 border-b border-[#B8AFA5] bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-[#B8AFA5] focus:border-[#9B6F47]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#5C5652]">
                    City *
                  </label>
                  <input
                    type="text"
                    name="shipping_city"
                    value={formData.shipping_city}
                    onChange={handleChange}
                    required
                    placeholder="Dhaka"
                    className="mt-2 w-full border-0 border-b border-[#B8AFA5] bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-[#B8AFA5] focus:border-[#9B6F47]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#5C5652]">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="shipping_postal_code"
                    value={formData.shipping_postal_code}
                    onChange={handleChange}
                    placeholder="1200"
                    className="mt-2 w-full border-0 border-b border-[#B8AFA5] bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-[#B8AFA5] focus:border-[#9B6F47]"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="mb-10">
              <p className="mb-6 text-[10px] uppercase tracking-[0.4em] text-[#9E9690]">
                Payment Method
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <label
                  className={`flex cursor-pointer items-center gap-4 px-5 py-4 transition-all duration-200 ${paymentMethod === "cod" ? "bg-[#111111] text-white" : "bg-white text-[#111111] hover:bg-[#EDE9E3]"}`}
                >
                  <input
                    type="radio"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as "cod" | "bkash")
                    }
                    className="h-3.5 w-3.5 accent-[#9B6F47]"
                  />
                  <div>
                    <p className="text-sm font-medium">Cash on Delivery</p>
                    <p
                      className={`text-xs ${paymentMethod === "cod" ? "text-white/60" : "text-[#9E9690]"}`}
                    >
                      Pay when your order arrives
                    </p>
                  </div>
                </label>
                <label
                  className={`flex cursor-pointer items-center gap-4 px-5 py-4 transition-all duration-200 ${paymentMethod === "bkash" ? "bg-[#111111] text-white" : "bg-white text-[#111111] hover:bg-[#EDE9E3]"}`}
                >
                  <input
                    type="radio"
                    value="bkash"
                    checked={paymentMethod === "bkash"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as "cod" | "bkash")
                    }
                    className="h-3.5 w-3.5 accent-[#9B6F47]"
                  />
                  <div>
                    <p className="text-sm font-medium">bKash</p>
                    <p
                      className={`text-xs ${paymentMethod === "bkash" ? "text-white/60" : "text-[#9E9690]"}`}
                    >
                      Pay via bKash mobile transfer
                    </p>
                  </div>
                </label>
              </div>

              {/* bKash payment instructions */}
              {paymentMethod === "bkash" && (
                <div className="mt-4 border-l-2 border-[#9B6F47] bg-[#FEF9EE] px-4 py-4 text-sm">
                  <p className="mb-2 text-[10px] uppercase tracking-widest text-[#9B6F47]">
                    bKash Payment Instructions
                  </p>
                  <ol
                    className="space-y-1.5 text-[#5C5652]"
                    style={{ listStyleType: "decimal", paddingLeft: "1.1rem" }}
                  >
                    <li>Place your order using the button below.</li>
                    <li>
                      Send{" "}
                      <strong className="text-[#111111]">
                        ৳{total.toLocaleString()}
                      </strong>{" "}
                      to bKash number{" "}
                      <strong className="text-[#111111]">01920-585212</strong>{" "}
                      (Send Money).
                    </li>
                    <li>Use your order number as the reference.</li>
                    <li>
                      We will confirm your order once payment is received.
                    </li>
                  </ol>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111111] py-4 text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-[#9B6F47] disabled:opacity-60"
            >
              {loading
                ? "Placing Order…"
                : `Place Order — ৳${total.toLocaleString()}`}
            </button>

            <p className="mt-4 text-center text-[11px] text-[#9E9690]">
              By placing an order you agree to our{" "}
              <Link href="/returns" className="underline hover:text-[#111111]">
                returns policy
              </Link>
              .
            </p>
          </form>

          {/* Order Summary */}
          <aside className="order-1 lg:order-2 lg:sticky lg:top-24 h-fit min-w-0">
            <p className="mb-6 text-[10px] uppercase tracking-[0.4em] text-[#9E9690]">
              Order Summary
            </p>

            <div className="divide-y divide-[#E5DFD6]">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 py-4 first:pt-0"
                >
                  {item.image_url ? (
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden bg-[#EDE9E3]">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 flex-shrink-0 bg-[#EDE9E3]" />
                  )}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product_id}`}
                      className="line-clamp-2 text-sm font-medium text-[#111111] hover:text-[#9B6F47] transition-colors"
                    >
                      {item.name ?? "Product"}
                    </Link>
                    <p className="mt-0.5 text-xs text-[#9E9690]">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <p className="text-sm font-medium text-[#111111] tabular-nums">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeFromCart(idx)}
                      className="flex h-6 w-6 items-center justify-center text-[#9E9690] transition-colors hover:text-[#111111]"
                      aria-label="Remove item"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Free shipping progress bar */}
            {shipping > 0 && (
              <div className="mt-5 rounded-sm bg-white px-4 py-3">
                <div className="mb-2 flex justify-between text-[10px] uppercase tracking-wider text-[#5C5652]">
                  <span>Free shipping progress</span>
                  <span className="text-[#9B6F47]">
                    ৳{(3000 - subtotal).toLocaleString()} away
                  </span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-[#E5DFD6]">
                  <div
                    className="h-full rounded-full bg-[#9B6F47] transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (subtotal / 3000) * 100)}%`,
                    }}
                  />
                </div>
                <p className="mt-1.5 text-[10px] text-[#9E9690]">
                  Free shipping on orders over ৳3,000
                </p>
              </div>
            )}

            <div className="mt-4 space-y-3 border-t border-[#E5DFD6] pt-5 text-sm">
              <div className="flex justify-between text-[#5C5652]">
                <span>Subtotal</span>
                <span className="tabular-nums">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[#5C5652]">
                <span>Shipping</span>
                <span className="tabular-nums">
                  {shipping === 0 ? (
                    <span className="text-[#9B6F47]">Free</span>
                  ) : (
                    `৳${shipping}`
                  )}
                </span>
              </div>
              {shipping === 0 && (
                <p className="text-[10px] uppercase tracking-wider text-[#9B6F47]">
                  Free shipping applied
                </p>
              )}
              <div className="flex justify-between border-t border-[#E5DFD6] pt-4 font-semibold text-[#111111]">
                <span>Total</span>
                <span className="tabular-nums">৳{total.toLocaleString()}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
