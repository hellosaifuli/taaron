"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { createClient } from "@/lib/supabase/client";

const shopLinks = [
  { label: "All Products", href: "/category/all" },
  { label: "Bags", href: "/category/bags" },
  { label: "Wallets", href: "/category/wallets" },
  { label: "Belts", href: "/category/belts" },
  { label: "Card Holders", href: "/category/cardholder" },
  { label: "Ladies", href: "/category/ladies" },
];

export default function LuxuryNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const { count } = useCart();
  const [user, setUser] = useState<{ email: string; name: string } | null>(
    null,
  );
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const name = user.user_metadata?.full_name || user.email || "";
        setUser({ email: user.email ?? "", name });
      } else {
        setUser(null);
      }
    });
  }, [pathname]);

  // Close shop dropdown on outside click
  useEffect(() => {
    if (!shopOpen) return;
    const handler = () => setShopOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [shopOpen]);

  // Close shop dropdown on navigation
  useEffect(() => { setShopOpen(false); }, [pathname]);

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const name =
          session.user.user_metadata?.full_name || session.user.email || "";
        setUser({ email: session.user.email ?? "", name });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        {/* ── Desktop pill ─────────────────────────────────────── */}
        <nav className="hidden lg:flex items-center gap-7 rounded-full border border-[#E5DFD6] bg-[#F2EFE8]/95 px-8 py-2.5 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-[12px] tracking-wide text-[#111111] transition-colors hover:text-[#9B6F47]"
            >
              Home
            </Link>
            <div className="group relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShopOpen((o) => !o); }}
                className="flex items-center gap-1 text-[12px] tracking-wide text-[#111111] transition-colors hover:text-[#9B6F47]"
              >
                Shop
                <svg
                  className={`h-2.5 w-2.5 transition-transform duration-200 ${shopOpen ? "rotate-180" : "group-hover:rotate-180"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className={`absolute left-0 top-full pt-3 transition-all duration-200 ${shopOpen ? "visible opacity-100" : "invisible opacity-0 group-hover:visible group-hover:opacity-100"}`}>
                <div className="min-w-[170px] rounded-2xl border border-[#E5DFD6] bg-[#F2EFE8] py-2 shadow-lg">
                  {shopLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-5 py-2.5 text-[12px] tracking-wide text-[#111111] transition-colors hover:text-[#9B6F47]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="h-4 w-px bg-[#E5DFD6]" />
          <Link
            href="/"
            className="text-[13px] font-medium uppercase text-[#111111] transition-colors hover:text-[#9B6F47]"
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "0.16em",
            }}
          >
            Taaron
          </Link>
          <div className="h-4 w-px bg-[#E5DFD6]" />
          <div className="flex items-center gap-6">
            {user ? (
              <Link
                href="/dashboard"
                className="text-[12px] tracking-wide text-[#111111] transition-colors hover:text-[#9B6F47]"
                title={user.email}
              >
                My Orders
              </Link>
            ) : (
              <Link
                href="/auth"
                className="text-[12px] tracking-wide text-[#111111] transition-colors hover:text-[#9B6F47]"
              >
                Account
              </Link>
            )}

            <Link
              href="/checkout"
              className="text-[12px] tracking-wide text-[#111111] transition-colors hover:text-[#9B6F47]"
            >
              {count > 0 ? `Cart (${count})` : "Cart"}
            </Link>
          </div>
        </nav>

        {/* ── Mobile pill ──────────────────────────────────────── */}
        <div className="flex w-full items-center justify-between rounded-full border border-[#E5DFD6] bg-[#F2EFE8]/95 px-5 py-3 shadow-sm backdrop-blur-md lg:hidden">
          <Link
            href="/"
            className="text-[13px] font-medium uppercase text-[#111111]"
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "0.14em",
            }}
          >
            Taaron
          </Link>
          <div className="flex items-center gap-4">
            {user && (
              <Link
                href="/dashboard"
                className="text-[12px] tracking-wide text-[#111111]"
                title={user.email}
              >
                My Orders
              </Link>
            )}
            <Link
              href="/checkout"
              className="relative flex items-center gap-1.5 text-[12px] tracking-wide text-[#111111]"
              aria-label="Cart"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
                />
              </svg>
              {count > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#9B6F47] text-[9px] font-semibold text-white">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#E5DFD6]"
              aria-label="Toggle menu"
            >
              <svg
                className="h-5 w-5 text-[#111111]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-[#F7F4EF] pt-[72px] lg:hidden">
          {/* Signed-in greeting */}
          {user && (
            <div className="mx-6 mt-4 rounded-2xl border border-[#E5DFD6] bg-white px-5 py-4">
              <p className="truncate text-sm font-medium text-[#111111]">
                {user.name}
              </p>
              <p className="truncate text-[11px] text-[#9E9690]">
                {user.email}
              </p>
            </div>
          )}

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto px-6 py-2">
            <Link
              href="/"
              className="flex items-center border-b border-[#E5DFD6] py-5 text-[13px] uppercase tracking-widest text-[#111111]"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>

            <div className="border-b border-[#E5DFD6] py-5">
              <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#9E9690]">
                Shop
              </p>
              {shopLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center py-3 text-[15px] text-[#111111] active:text-[#9B6F47]"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center py-5 text-[13px] uppercase tracking-widest text-[#111111]"
                onClick={() => setMobileOpen(false)}
              >
                My Orders
              </Link>
            ) : (
              <Link
                href="/auth"
                className="flex items-center py-5 text-[13px] uppercase tracking-widest text-[#111111]"
                onClick={() => setMobileOpen(false)}
              >
                Account
              </Link>
            )}
          </nav>

          {/* Contact info at bottom */}
          <div className="flex-shrink-0 space-y-2 px-4 pb-8 pt-2">
            <div className="rounded-full border border-[#E5DFD6] bg-white px-6 py-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#9E9690]">
                WhatsApp / Phone
              </p>
              <a
                href="https://wa.me/8801920585212"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-[17px] font-medium text-[#111111]"
              >
                +880 1920-585212
              </a>
              <p className="mt-0.5 text-[11px] text-[#9B6F47]">
                Sun – Thu, 10am – 7pm BST
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
