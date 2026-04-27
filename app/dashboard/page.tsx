import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import FadeInSection from "@/components/fade-in-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  description: "View and manage your Taaron orders.",
  robots: { index: false, follow: false },
};

const STATUS_STYLES: Record<
  string,
  { pill: string; bar: string; label: string }
> = {
  pending: {
    pill: "bg-[#FEF9EE] text-[#9B6F47] border-[#E5DFD6]",
    bar: "w-1/4 bg-[#9B6F47]",
    label: "Order Placed",
  },
  confirmed: {
    pill: "bg-[#EDE9E3] text-[#5C5652] border-[#E5DFD6]",
    bar: "w-2/4 bg-[#111111]",
    label: "Confirmed",
  },
  shipped: {
    pill: "bg-[#EDE9E3] text-[#111111] border-[#E5DFD6]",
    bar: "w-3/4 bg-[#111111]",
    label: "Shipped",
  },
  delivered: {
    pill: "bg-[#111111] text-white border-[#111111]",
    bar: "w-full bg-[#9B6F47]",
    label: "Delivered",
  },
  cancelled: {
    pill: "bg-red-50 text-red-600 border-red-200",
    bar: "w-0 bg-red-400",
    label: "Cancelled",
  },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      id, order_number, status, payment_method, payment_status, total, created_at,
      order_items ( quantity, price, products ( id, name, image_url ) )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const initials = (user.email ?? "U").slice(0, 2).toUpperCase();
  const totalSpent = orders?.reduce((s, o) => s + (o.total ?? 0), 0) ?? 0;
  const orderCount = orders?.length ?? 0;

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#111111]">
      {/* ── Hero banner ─────────────────────────────────────── */}
      <div
        className="relative overflow-hidden px-6 pb-12 pt-28 lg:px-16 lg:pb-16 lg:pt-32"
        style={{
          background:
            "linear-gradient(135deg, #F0EDE7 0%, #E2D9CC 50%, #D4BFA0 100%)",
          minHeight: "32vh",
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 50%, #F7F4EF 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-screen-lg">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            {/* Avatar + greeting */}
            <div className="flex items-center gap-5">
              <div
                className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[#111111] text-lg font-medium text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {initials}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#9B6F47]">
                  Welcome back
                </p>
                <h1
                  className="mt-1 text-[#111111]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.1,
                  }}
                >
                  {user.email?.split("@")[0]}
                </h1>
                <p className="mt-1 text-xs text-[#5C5652]">{user.email}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <p
                  className="text-2xl font-medium text-[#111111]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {orderCount}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-[#9E9690]">
                  Orders
                </p>
              </div>
              <div className="text-center">
                <p
                  className="text-2xl font-medium text-[#111111]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  ৳{totalSpent.toLocaleString()}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-[#9E9690]">
                  Total Spent
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Nav strip ───────────────────────────────────────── */}
      <div className="border-b border-[#E5DFD6] bg-white px-6 lg:px-16">
        <div className="mx-auto flex max-w-screen-lg items-center justify-between py-3">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#9E9690]">
            My Orders
          </p>
          <div className="flex gap-6 text-[11px] uppercase tracking-widest text-[#5C5652]">
            <Link href="/" className="transition-colors hover:text-[#9B6F47]">
              Shop
            </Link>
            <form action="/api/auth/sign-out" method="POST">
              <button
                type="submit"
                className="transition-colors hover:text-[#9B6F47]"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Orders ──────────────────────────────────────────── */}
      <div className="mx-auto max-w-screen-lg px-6 py-12 lg:px-16">
        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order: any, i: number) => {
              const style = STATUS_STYLES[order.status] ?? {
                pill: "bg-[#FEF9EE] text-[#9B6F47] border-[#E5DFD6]",
                bar: "w-1/4 bg-[#9B6F47]",
                label: "Pending",
              };
              return (
                <FadeInSection key={order.id} delay={i * 60} from="up">
                  <div className="group bg-white transition-all duration-200 hover:shadow-sm">
                    {/* Progress bar */}
                    <div className="h-0.5 w-full bg-[#E5DFD6]">
                      <div
                        className={`h-full transition-all duration-700 ${style.bar}`}
                      />
                    </div>

                    <div className="p-6">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h2 className="font-medium text-[#111111]">
                              {order.order_number}
                            </h2>
                            <span
                              className={`border px-2.5 py-0.5 text-[9px] uppercase tracking-wider ${style.pill}`}
                            >
                              {style.label}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-[#9E9690]">
                            {new Date(order.created_at).toLocaleDateString(
                              "en-BD",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                        <p
                          className="flex-shrink-0 text-xl font-medium text-[#111111]"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          ৳{order.total.toLocaleString()}
                        </p>
                      </div>

                      {/* Items */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {order.order_items.map((item: any, idx: number) => (
                          <span
                            key={idx}
                            className="border border-[#E5DFD6] px-3 py-1.5 text-xs text-[#5C5652]"
                          >
                            {item.products?.name ?? "Product"} × {item.quantity}
                          </span>
                        ))}
                      </div>

                      {/* Bottom row */}
                      <div className="mt-5 flex items-center justify-between border-t border-[#E5DFD6] pt-4">
                        <div className="flex items-center gap-3 text-xs text-[#9E9690]">
                          <span className="uppercase tracking-wider">
                            {order.payment_method === "cod"
                              ? "Cash on Delivery"
                              : "bKash"}
                          </span>
                          <span>·</span>
                          <span
                            className={`capitalize ${order.payment_status === "paid" ? "text-green-600" : "text-[#9B6F47]"}`}
                          >
                            {order.payment_status}
                          </span>
                        </div>
                        <Link
                          href={`/order-confirmation/${order.id}`}
                          className="text-[11px] uppercase tracking-widest text-[#111111] transition-colors hover:text-[#9B6F47]"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                </FadeInSection>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <FadeInSection from="up">
            <div className="flex flex-col items-center py-24 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#EDE9E3]">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <rect
                    x="4"
                    y="10"
                    width="28"
                    height="20"
                    rx="2"
                    stroke="#9B6F47"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 10V8a6 6 0 0 1 12 0v2"
                    stroke="#9B6F47"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="18"
                    cy="20"
                    r="2.5"
                    stroke="#9B6F47"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <h2
                className="text-xl font-medium text-[#111111]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                No orders yet
              </h2>
              <p className="mt-2 max-w-xs text-sm text-[#5C5652]">
                Your order history will appear here. Start exploring Taaron's
                leather collection.
              </p>
              <Link
                href="/category/all"
                className="mt-8 bg-[#111111] px-10 py-4 text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-[#9B6F47]"
              >
                Shop the Collection
              </Link>

              <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Wallets", slug: "wallets" },
                  { label: "Bags", slug: "bags" },
                  { label: "Belts", slug: "belts" },
                  { label: "Card Holders", slug: "cardholder" },
                ].map(({ label, slug }) => (
                  <Link
                    key={slug}
                    href={`/category/${slug}`}
                    className="border border-[#E5DFD6] px-4 py-4 text-[11px] uppercase tracking-widest text-[#5C5652] transition-all hover:border-[#9B6F47] hover:text-[#9B6F47]"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </FadeInSection>
        )}
      </div>
    </div>
  );
}
