"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { createClient } from "@/lib/supabase/client";
import { fbEvent } from "@/lib/fb-pixel";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

async function getRecaptchaToken(): Promise<string | null> {
  if (!RECAPTCHA_SITE_KEY) return null;
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !(window as any).grecaptcha) {
      resolve(null);
      return;
    }
    (window as any).grecaptcha.ready(() => {
      (window as any).grecaptcha
        .execute(RECAPTCHA_SITE_KEY, { action: "checkout" })
        .then(resolve)
        .catch(() => resolve(null));
    });
  });
}

const BD_DISTRICTS: { name: string; postal: string }[] = [
  // Dhaka Division
  { name: "Dhaka", postal: "1000" },
  { name: "Gazipur", postal: "1700" },
  { name: "Narayanganj", postal: "1400" },
  { name: "Narsingdi", postal: "1600" },
  { name: "Manikganj", postal: "1800" },
  { name: "Munshiganj", postal: "1500" },
  { name: "Rajbari", postal: "7700" },
  { name: "Shariatpur", postal: "8000" },
  { name: "Faridpur", postal: "7800" },
  { name: "Madaripur", postal: "7900" },
  { name: "Gopalganj", postal: "8100" },
  // Chittagong Division
  { name: "Chattogram", postal: "4000" },
  { name: "Cox's Bazar", postal: "4700" },
  { name: "Rangamati", postal: "4500" },
  { name: "Bandarban", postal: "4600" },
  { name: "Khagrachhari", postal: "4400" },
  { name: "Feni", postal: "3900" },
  { name: "Noakhali", postal: "3800" },
  { name: "Lakshmipur", postal: "3700" },
  { name: "Cumilla", postal: "3500" },
  { name: "Brahmanbaria", postal: "3400" },
  { name: "Chandpur", postal: "3600" },
  // Sylhet Division
  { name: "Sylhet", postal: "3100" },
  { name: "Moulvibazar", postal: "3200" },
  { name: "Habiganj", postal: "3300" },
  { name: "Sunamganj", postal: "3000" },
  // Rajshahi Division
  { name: "Rajshahi", postal: "6000" },
  { name: "Natore", postal: "6400" },
  { name: "Naogaon", postal: "6500" },
  { name: "Chapai Nawabganj", postal: "6300" },
  { name: "Pabna", postal: "6600" },
  { name: "Sirajganj", postal: "6700" },
  { name: "Bogura", postal: "5800" },
  { name: "Joypurhat", postal: "5900" },
  // Khulna Division
  { name: "Khulna", postal: "9000" },
  { name: "Jashore", postal: "7400" },
  { name: "Satkhira", postal: "9400" },
  { name: "Bagerhat", postal: "9300" },
  { name: "Narail", postal: "7500" },
  { name: "Magura", postal: "7600" },
  { name: "Jhenaidah", postal: "7300" },
  { name: "Kushtia", postal: "7000" },
  { name: "Chuadanga", postal: "7200" },
  { name: "Meherpur", postal: "7100" },
  // Barishal Division
  { name: "Barishal", postal: "8200" },
  { name: "Patuakhali", postal: "8600" },
  { name: "Bhola", postal: "8300" },
  { name: "Pirojpur", postal: "8500" },
  { name: "Jhalokathi", postal: "8400" },
  { name: "Barguna", postal: "8700" },
  // Rangpur Division
  { name: "Rangpur", postal: "5400" },
  { name: "Dinajpur", postal: "5200" },
  { name: "Thakurgaon", postal: "5100" },
  { name: "Panchagarh", postal: "5000" },
  { name: "Nilphamari", postal: "5300" },
  { name: "Lalmonirhat", postal: "5500" },
  { name: "Kurigram", postal: "5600" },
  { name: "Gaibandha", postal: "5700" },
  // Mymensingh Division
  { name: "Mymensingh", postal: "2200" },
  { name: "Netrokona", postal: "2400" },
  { name: "Kishoreganj", postal: "2300" },
  { name: "Jamalpur", postal: "2000" },
  { name: "Sherpur", postal: "2100" },
  { name: "Tangail", postal: "1900" },
];

function validatePhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  // Accept: 01XXXXXXXXX (11 digits) or +8801XXXXXXXXX or 8801XXXXXXXXX
  if (!/^(\+?880|0)1[3-9]\d{8}$/.test(cleaned)) {
    return "Enter a valid BD number: 01XXXXXXXXX or +8801XXXXXXXXX";
  }
  return "";
}

function validatePostalCode(code: string): string {
  if (code && !/^\d{4}$/.test(code.trim())) {
    return "Postal code must be 4 digits";
  }
  return "";
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, removeItem: removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
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

  useEffect(() => {
    if (items.length > 0) {
      fbEvent("InitiateCheckout", {
        content_ids: items.map((i) => i.product_id),
        content_type: "product",
        num_items: items.reduce((s, i) => s + i.quantity, 0),
        value: items.reduce((s, i) => s + i.price * i.quantity, 0),
        currency: "BDT",
      });
    }
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
    const { name, value } = e.target;
    if (name === "shipping_city") {
      const district = BD_DISTRICTS.find((d) => d.name === value);
      setFormData((prev) => ({
        ...prev,
        shipping_city: value,
        shipping_postal_code: district ? district.postal : prev.shipping_postal_code,
      }));
      setFieldErrors((prev) => ({ ...prev, shipping_city: "" }));
      return;
    }
    setFormData({ ...formData, [name]: value });
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "customer_phone" && value) {
      setFieldErrors((prev) => ({ ...prev, customer_phone: validatePhone(value) }));
    }
    if (name === "shipping_postal_code" && value) {
      setFieldErrors((prev) => ({ ...prev, shipping_postal_code: validatePostalCode(value) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate before submit
    const phoneErr = validatePhone(formData.customer_phone);
    const postalErr = validatePostalCode(formData.shipping_postal_code);
    if (phoneErr || postalErr) {
      setFieldErrors({ customer_phone: phoneErr, shipping_postal_code: postalErr });
      return;
    }
    setLoading(true);
    setError("");
    try {
      const recaptcha_token = await getRecaptchaToken();
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          payment_method: paymentMethod,
          ...formData,
          recaptcha_token,
        }),
      });
      let data: { id?: string; error?: string } = {};
      try {
        data = await response.json();
      } catch {
        setError("Server returned an unexpected response. Please try again.");
        return;
      }
      if (!response.ok) {
        setError(data.error || "Failed to create order");
      } else {
        clearCart();
        router.push(`/order-confirmation/${data.id}`);
      }
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F7F4EF]">
        {/* Top gradient strip */}
        <div
          className="flex-shrink-0 pt-12 pb-12 px-6 lg:px-16"
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
              className="mt-8 rounded-sm bg-[#111111] px-10 py-4 text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-[#9B6F47]"
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
      {RECAPTCHA_SITE_KEY && (
        <Script src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`} />
      )}
      {/* Banner header */}
      <div
        className="relative flex flex-col justify-end overflow-hidden px-6 pb-10 pt-12 lg:px-16 lg:pb-12 lg:pt-20"
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
                  <label htmlFor="customer_name" className="block text-[10px] uppercase tracking-widest text-[#5C5652]">
                    Full Name *
                  </label>
                  <input
                    id="customer_name"
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
                  <label htmlFor="customer_email" className="block text-[10px] uppercase tracking-widest text-[#5C5652]">
                    Email
                  </label>
                  <input
                    id="customer_email"
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="mt-2 w-full border-0 border-b border-[#B8AFA5] bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-[#B8AFA5] focus:border-[#9B6F47]"
                  />
                </div>
                <div>
                  <label htmlFor="customer_phone" className="block text-[10px] uppercase tracking-widest text-[#5C5652]">
                    Phone *
                  </label>
                  <input
                    id="customer_phone"
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    placeholder="01XXXXXXXXX"
                    className={`mt-2 w-full border-0 border-b bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-[#B8AFA5] focus:border-[#9B6F47] ${fieldErrors.customer_phone ? "border-red-400" : "border-[#B8AFA5]"}`}
                  />
                  {fieldErrors.customer_phone && (
                    <p className="mt-1 text-[11px] text-red-500">{fieldErrors.customer_phone}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="shipping_address" className="block text-[10px] uppercase tracking-widest text-[#5C5652]">
                    Address *
                  </label>
                  <textarea
                    id="shipping_address"
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
                  <label htmlFor="shipping_city" className="block text-[10px] uppercase tracking-widest text-[#5C5652]">
                    City / District *
                  </label>
                  <select
                    id="shipping_city"
                    name="shipping_city"
                    value={formData.shipping_city}
                    onChange={handleChange}
                    required
                    className={`mt-2 w-full border-0 border-b bg-transparent py-3 text-sm outline-none transition-colors focus:border-[#9B6F47] ${formData.shipping_city ? "text-[#111111]" : "text-[#B8AFA5]"} ${fieldErrors.shipping_city ? "border-red-400" : "border-[#B8AFA5]"}`}
                  >
                    <option value="" disabled>Select district</option>
                    {BD_DISTRICTS.map((d) => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                  {fieldErrors.shipping_city && (
                    <p className="mt-1 text-[11px] text-red-500">{fieldErrors.shipping_city}</p>
                  )}
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
                    onBlur={handleBlur}
                    placeholder="4 digits"
                    maxLength={4}
                    className={`mt-2 w-full border-0 border-b bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-[#B8AFA5] focus:border-[#9B6F47] ${fieldErrors.shipping_postal_code ? "border-red-400" : "border-[#B8AFA5]"}`}
                  />
                  {fieldErrors.shipping_postal_code && (
                    <p className="mt-1 text-[11px] text-red-500">{fieldErrors.shipping_postal_code}</p>
                  )}
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
                  className={`flex cursor-pointer items-center gap-4 rounded-sm px-5 py-4 transition-all duration-200 ${paymentMethod === "cod" ? "bg-[#111111] text-white" : "bg-white text-[#111111] hover:bg-[#EDE9E3]"}`}
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
                  className={`flex cursor-pointer items-center gap-4 rounded-sm px-5 py-4 transition-all duration-200 ${paymentMethod === "bkash" ? "bg-[#111111] text-white" : "bg-white text-[#111111] hover:bg-[#EDE9E3]"}`}
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
                      <strong className="text-[#111111]">01648-817191</strong>{" "}
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
              className="w-full rounded-sm bg-[#111111] py-4 text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-[#9B6F47] disabled:opacity-60"
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
