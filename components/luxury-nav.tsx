"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { count } = useCart();
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!shopOpen) return;
    const handler = () => setShopOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [shopOpen]);

  useEffect(() => { setShopOpen(false); }, [pathname]);
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const name = session.user.user_metadata?.full_name || session.user.email || "";
        setUser({ email: session.user.email ?? "", name });
      } else {
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Focus search input when overlay opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/category/all?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* ── Top header (desktop only on mobile) ────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        {/* Desktop pill */}
        <nav className="hidden lg:flex items-center gap-7 rounded-full border border-[#E5DFD6] bg-[#F2EFE8]/95 px-8 py-2.5 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-[12px] tracking-wide text-[#111111] transition-colors hover:text-[#9B6F47]">
              Home
            </Link>
            <div className="group relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShopOpen((o) => !o); }}
                className="flex items-center gap-1 text-[12px] tracking-wide text-[#111111] transition-colors hover:text-[#9B6F47]"
              >
                Shop
                <svg className={`h-2.5 w-2.5 transition-transform duration-200 ${shopOpen ? "rotate-180" : "group-hover:rotate-180"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`absolute left-0 top-full pt-3 transition-all duration-200 ${shopOpen ? "visible opacity-100" : "invisible opacity-0 group-hover:visible group-hover:opacity-100"}`}>
                <div className="min-w-[170px] rounded-2xl border border-[#E5DFD6] bg-[#F2EFE8] py-2 shadow-lg">
                  {shopLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="block px-5 py-2.5 text-[12px] tracking-wide text-[#111111] transition-colors hover:text-[#9B6F47]">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="h-4 w-px bg-[#E5DFD6]" />
          <Link href="/" className="text-[13px] font-medium uppercase text-[#111111] transition-colors hover:text-[#9B6F47]" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.16em" }}>
            Taaron
          </Link>
          <div className="h-4 w-px bg-[#E5DFD6]" />
          <div className="flex items-center gap-6">
            {user ? (
              <Link href="/dashboard" className="text-[12px] tracking-wide text-[#111111] transition-colors hover:text-[#9B6F47]" title={user.email}>
                My Orders
              </Link>
            ) : (
              <Link href="/auth" className="text-[12px] tracking-wide text-[#111111] transition-colors hover:text-[#9B6F47]">
                Account
              </Link>
            )}
            <Link href="/checkout" className="text-[12px] tracking-wide text-[#111111] transition-colors hover:text-[#9B6F47]">
              {count > 0 ? `Cart (${count})` : "Cart"}
            </Link>
          </div>
        </nav>

      </header>

      {/* ── Mobile bottom nav ──────────────────────────────────────── */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 px-3 lg:hidden"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 8px)" }}
      >
        <nav className="flex items-center justify-around rounded-full border border-[#E5DFD6] bg-[#F2EFE8]/95 px-2 py-2.5 shadow-sm backdrop-blur-md">

          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex flex-col items-center gap-1 px-5"
            aria-label="Search"
          >
            <svg className="h-[18px] w-[18px] text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <span className="text-[8px] uppercase tracking-[0.15em] text-[#9E9690]">Search</span>
          </button>

          {/* Home */}
          <Link href="/" className="flex flex-col items-center gap-1 px-5" aria-label="Home">
            <svg className="h-[18px] w-[18px] text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span className="text-[8px] uppercase tracking-[0.15em] text-[#9E9690]">Home</span>
          </Link>

          {/* Cart */}
          <Link href="/checkout" className="relative flex flex-col items-center gap-1 px-5" aria-label="Cart">
            <div className="relative">
              <svg className="h-[18px] w-[18px] text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
              </svg>
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#9B6F47] text-[9px] font-semibold text-white">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </div>
            <span className="text-[8px] uppercase tracking-[0.15em] text-[#9E9690]">Cart</span>
          </Link>

          {/* Menu */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col items-center gap-1 px-5"
            aria-label="Menu"
          >
            <svg className="h-[18px] w-[18px] text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              )}
            </svg>
            <span className="text-[8px] uppercase tracking-[0.15em] text-[#9E9690]">Menu</span>
          </button>

        </nav>
      </div>

      {/* ── Search overlay (mobile) ────────────────────────────────── */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end lg:hidden">
          {/* Tap backdrop to dismiss */}
          <div
            className="flex-1"
            onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
          />

          {/* Bottom sheet */}
          <div className="bg-[#F7F4EF]" style={{ paddingBottom: "calc(max(env(safe-area-inset-bottom), 8px) + 60px)" }}>
            {/* Search row */}
            <div className="flex items-center gap-3 border-b border-[#E5DFD6] px-4 py-4">
              <svg className="h-5 w-5 flex-shrink-0 text-[#9E9690]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <form onSubmit={handleSearch} className="flex-1">
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  className="w-full bg-transparent text-[15px] text-[#111111] placeholder-[#9E9690] outline-none"
                />
              </form>
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                className="text-[13px] tracking-wide text-[#9B6F47]"
              >
                Cancel
              </button>
            </div>

            {/* Browse pills */}
            <div className="px-5 py-5">
              <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#9E9690]">Browse</p>
              <div className="flex flex-wrap gap-2">
                {shopLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSearchOpen(false)}
                    className="rounded-full border border-[#E5DFD6] bg-white px-4 py-2 text-[12px] tracking-wide text-[#111111] active:bg-[#E5DFD6]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile drawer ─────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-[#F7F4EF] pt-4 lg:hidden" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 60px)" }}>
          {user && (
            <div className="mx-6 mt-4 rounded-2xl border border-[#E5DFD6] bg-white px-5 py-4">
              <p className="truncate text-sm font-medium text-[#111111]">{user.name}</p>
              <p className="truncate text-[11px] text-[#9E9690]">{user.email}</p>
            </div>
          )}

          <nav className="flex-1 overflow-y-auto px-6 py-2">
            <Link href="/" className="flex items-center border-b border-[#E5DFD6] py-5 text-[13px] uppercase tracking-widest text-[#111111]" onClick={() => setMobileOpen(false)}>
              Home
            </Link>

            <div className="border-b border-[#E5DFD6] py-5">
              <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#9E9690]">Shop</p>
              {shopLinks.map((link) => (
                <Link key={link.href} href={link.href} className="flex items-center py-3 text-[15px] text-[#111111] active:text-[#9B6F47]" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </div>

            {user ? (
              <Link href="/dashboard" className="flex items-center py-5 text-[13px] uppercase tracking-widest text-[#111111]" onClick={() => setMobileOpen(false)}>
                My Orders
              </Link>
            ) : (
              <Link href="/auth" className="flex items-center py-5 text-[13px] uppercase tracking-widest text-[#111111]" onClick={() => setMobileOpen(false)}>
                Account
              </Link>
            )}
          </nav>

          <div className="flex-shrink-0 space-y-2 px-4 pb-4 pt-2">
            <div className="rounded-full border border-[#E5DFD6] bg-white px-6 py-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#9E9690]">WhatsApp / Phone</p>
              <a href="https://wa.me/8801920585212" target="_blank" rel="noopener noreferrer" className="mt-1 block text-[17px] font-medium text-[#111111]">
                +880 1920-585212
              </a>
              <p className="mt-0.5 text-[11px] text-[#9B6F47]">Sun – Thu, 10am – 7pm BST</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
