import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="flex flex-col bg-[#F7F4EF]">

      {/* ── TAARON — full-width watermark ────────────────────────────── */}
      <div className="w-full py-8">
        <svg
          viewBox="0 0 1000 190"
          className="w-full h-auto"
          aria-hidden
          preserveAspectRatio="none"
        >
          <text
            x="0"
            y="172"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
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
        <div className="mx-auto max-w-screen-xl">
          <div className="flex flex-col items-center gap-4 text-[11px] uppercase tracking-widest text-[#5C5652] sm:flex-row sm:justify-between">
            <span>© {new Date().getFullYear()} Taaron তারুণ</span>
            <div className="flex items-center gap-5">
              <Link href="/category/all" className="transition-colors hover:text-[#111111]">Shop</Link>
              <Link href="/blog" className="transition-colors hover:text-[#111111]">Journal</Link>
              <Link href="/contact" className="transition-colors hover:text-[#111111]">Contact</Link>
              <Link href="/returns" className="transition-colors hover:text-[#111111]">Returns</Link>
              <Link href="/auth" className="transition-colors hover:text-[#111111]">Account</Link>
            </div>
            <span className="text-[#9E9690]">COD & bKash · Bangladesh</span>
          </div>
        </div>
      </div>

    </footer>
  )
}
