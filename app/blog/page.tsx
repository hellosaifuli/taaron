import Link from 'next/link'
import { posts, formatDate } from '@/lib/blog'
import FadeInSection from '@/components/fade-in-section'
import type { Metadata } from 'next'

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000'

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Leather care guides, style advice, and stories from Taaron — premium leather goods from Bangladesh.',
  alternates: { canonical: `${baseUrl}/blog` },
  openGraph: {
    title: 'Journal — Taaron',
    description: 'Leather care guides, buying advice, and brand stories from Taaron.',
    url: `${baseUrl}/blog`,
    siteName: 'Taaron',
    images: [{ url: `${baseUrl}/taaron-logo.png`, width: 1200, height: 630, alt: 'Taaron Journal' }],
    type: 'website',
  },
}

const CATEGORY_COLORS: Record<string, string> = {
  'Care & Maintenance': 'bg-[#FEF9EE] text-[#9B6F47]',
  'Leather Education': 'bg-[#EDE9E3] text-[#5C5652]',
  'Style & Lifestyle': 'bg-[#F0EDE7] text-[#111111]',
}

export default function BlogPage() {
  const [featured, ...rest] = posts
  if (!featured) return null

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#111111]">

      {/* ── Header ───────────────────────────────────────────────── */}
      <div
        className="relative flex flex-col justify-end overflow-hidden px-6 pb-10 pt-28 lg:px-16 lg:pb-14 lg:pt-32"
        style={{
          background: 'linear-gradient(135deg, #F0EDE7 0%, #E2D9CC 50%, #D4BFA0 100%)',
          minHeight: '28vh',
        }}
      >
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #F7F4EF 0%, transparent 60%)' }} />
        <div className="relative mx-auto w-full max-w-screen-xl">
          <FadeInSection from="up">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#9B6F47]">Taaron</p>
            <h1
              className="mt-2 text-[#111111]"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
                lineHeight: '1.05',
                letterSpacing: '-0.01em',
                fontWeight: 400,
              }}
            >
              Journal
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#5C5652]">
              Leather care guides, buying advice, and stories about craft — from the people who make it.
            </p>
          </FadeInSection>
        </div>
      </div>

      <div className="mx-auto max-w-screen-xl px-6 py-16 lg:px-16 lg:py-20">

        {/* ── Featured post ─────────────────────────────────────── */}
        <FadeInSection from="up">
          <Link href={`/blog/${featured.slug}`} className="group mb-16 block">
            <div className="grid gap-0 lg:grid-cols-[1.4fr_1fr]">
              {/* Cover */}
              <div
                className="flex items-end p-10 lg:min-h-[420px]"
                style={{
                  background: 'linear-gradient(135deg, #2C1F14 0%, #5C3D22 40%, #9B6F47 100%)',
                }}
              >
                <div>
                  <span className={`inline-block px-3 py-1 text-[9px] uppercase tracking-widest ${CATEGORY_COLORS[featured.category] ?? 'bg-[#EDE9E3] text-[#5C5652]'}`}>
                    {featured.category}
                  </span>
                  <h2
                    className="mt-4 text-white"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                      lineHeight: '1.15',
                      fontWeight: 400,
                    }}
                  >
                    {featured.title}
                  </h2>
                </div>
              </div>
              {/* Info */}
              <div className="flex flex-col justify-between bg-white p-10">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#9E9690]">Featured</p>
                  <p className="mt-5 text-sm leading-relaxed text-[#5C5652]">{featured.excerpt}</p>
                </div>
                <div className="mt-8">
                  <div className="mb-6 flex items-center gap-4 text-xs text-[#9E9690]">
                    <span>{formatDate(featured.date)}</span>
                    <span>·</span>
                    <span>{featured.readTime}</span>
                  </div>
                  <span className="text-[11px] uppercase tracking-widest text-[#111111] underline-offset-4 transition-colors group-hover:text-[#9B6F47]">
                    Read Article →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </FadeInSection>

        {/* ── Rest of posts grid ────────────────────────────────── */}
        <div className="border-t border-[#E5DFD6] pt-16">
          <FadeInSection from="up">
            <p className="mb-10 text-[10px] uppercase tracking-[0.4em] text-[#9E9690]">All Articles</p>
          </FadeInSection>
          <div className="grid gap-px bg-[#E5DFD6] sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <FadeInSection key={post.slug} delay={i * 70} from="up">
                <Link href={`/blog/${post.slug}`} className="group flex flex-col bg-white p-8 transition-colors hover:bg-[#FEF9EE]">
                  <span className={`self-start px-2.5 py-1 text-[9px] uppercase tracking-widest ${CATEGORY_COLORS[post.category] ?? 'bg-[#EDE9E3] text-[#5C5652]'}`}>
                    {post.category}
                  </span>
                  <h2
                    className="mt-5 flex-1 leading-snug text-[#111111] transition-colors group-hover:text-[#9B6F47]"
                    style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 400 }}
                  >
                    {post.title}
                  </h2>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#5C5652]">{post.excerpt}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-[#E5DFD6] pt-4 text-xs text-[#9E9690]">
                    <span>{formatDate(post.date)}</span>
                    <span>{post.readTime}</span>
                  </div>
                </Link>
              </FadeInSection>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
