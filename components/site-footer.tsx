import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="flex flex-col bg-[#F7F4EF]">

      {/* ── TAARON — watermark aligned with content ───────────────── */}
      <div className="mx-auto w-full max-w-screen-xl px-6 py-8 lg:px-12">
        <svg
          viewBox="0 0 1000 190"
          className="w-auto h-auto"
          aria-hidden
          preserveAspectRatio="xMidYMid meet"
        >
          <text
            x="0"
            y="172"
            fill="#111111"
            fontSize="190"
            fontFamily="'Playfair Display', Georgia, serif"
            fontWeight="400"
            opacity="0.055"
          >
            TAARON
          </text>
        </svg>
      </div>

      {/* ── Bottom bar — copyright + links ───────────────────────── */}
      <div className="px-6 py-5 lg:px-12">
        <div className="flex flex-col items-center gap-4 text-[11px] uppercase tracking-widest text-[#5C5652] sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Taaron তারণ</span>
          <div className="flex items-center gap-5">
            <Link href="/category/all" className="transition-colors hover:text-[#111111]">Shop</Link>
            <Link href="/contact" className="transition-colors hover:text-[#111111]">Contact</Link>
            <Link href="/returns" className="transition-colors hover:text-[#111111]">Returns</Link>
            <Link href="/auth" className="transition-colors hover:text-[#111111]">Account</Link>
          </div>
          <span className="text-[#9E9690]">COD & bKash · Bangladesh</span>
        </div>
      </div>

    </footer>
  )
}
