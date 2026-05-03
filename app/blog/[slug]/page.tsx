import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { posts, getPost, formatDate } from "@/lib/blog";
import FadeInSection from "@/components/fade-in-section";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${baseUrl}/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${baseUrl}/blog/${slug}`,
      siteName: "Taaron",
      images: [
        {
          url: `${baseUrl}/taaron-logo.png`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [`${baseUrl}/taaron-logo.png`],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = posts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 2);
  const fallbackRelated = posts.filter((p) => p.slug !== slug).slice(0, 2);
  const relatedPosts = related.length >= 2 ? related : fallbackRelated;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "Taaron", url: baseUrl },
    publisher: {
      "@type": "Organization",
      name: "Taaron",
      logo: { "@type": "ImageObject", url: `${baseUrl}/taaron-logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${baseUrl}/blog/${slug}` },
    inLanguage: "en",
    about: { "@type": "Thing", name: "Leather Goods" },
  };

  return (
    <>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="min-h-screen bg-[#F7F4EF] text-[#111111]">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <div
          className="relative flex flex-col justify-end overflow-hidden px-6 pb-12 pt-12 lg:px-16 lg:pb-16 lg:pt-20"
          style={{
            background:
              "linear-gradient(135deg, #2C1F14 0%, #5C3D22 45%, #9B6F47 100%)",
            minHeight: "42vh",
          }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 70%, #F7F4EF 0%, transparent 55%)",
            }}
          />
          <div className="relative mx-auto w-full max-w-screen-lg">
            <FadeInSection from="up">
              <Link
                href="/blog"
                className="mb-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/60 transition-colors hover:text-white"
              >
                ← Journal
              </Link>
              <span className="block text-[9px] uppercase tracking-[0.35em] text-[#C4A882]">
                {post.category}
              </span>
              <h1
                className="mt-3 text-white"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.8rem, 4.5vw, 3.6rem)",
                  lineHeight: "1.1",
                  letterSpacing: "-0.01em",
                  fontWeight: 400,
                }}
              >
                {post.title}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-white/50">
                <span>{formatDate(post.date)}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
            </FadeInSection>
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────────── */}
        <div className="mx-auto max-w-screen-lg px-6 py-16 lg:grid lg:grid-cols-[1fr_300px] lg:gap-16 lg:px-16 lg:py-20">
          {/* Article body */}
          <article>
            <FadeInSection from="up">
              <p
                className="mb-10 text-base leading-[1.9] text-[#5C5652]"
                style={{ fontSize: "1.05rem" }}
              >
                {post.excerpt}
              </p>
            </FadeInSection>

            {(post.sections ?? []).map((section, i) => (
              <FadeInSection key={i} delay={i * 40} from="up">
                <div className="mb-8">
                  {section.heading && (
                    <h2
                      className="mb-4 text-[#111111]"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(1.25rem, 2.5vw, 1.6rem)",
                        fontWeight: 400,
                        lineHeight: "1.25",
                      }}
                    >
                      {section.heading}
                    </h2>
                  )}
                  <p
                    className="leading-[1.9] text-[#5C5652]"
                    style={{ fontSize: "0.975rem" }}
                  >
                    {section.body}
                  </p>
                </div>
              </FadeInSection>
            ))}

            {/* Tags */}
            <FadeInSection
              from="up"
              className="mt-12 border-t border-[#E5DFD6] pt-8"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest text-[#9E9690]">
                  Category
                </span>
                <span className="border border-[#E5DFD6] px-3 py-1 text-[10px] uppercase tracking-widest text-[#5C5652]">
                  {post.category}
                </span>
              </div>
            </FadeInSection>
          </article>

          {/* ── Sidebar ────────────────────────────────────────── */}
          <aside className="mt-16 lg:mt-0">
            {/* Shop CTA */}
            <FadeInSection from="right" className="sticky top-28">
              <div className="mb-8 bg-[#111111] p-8">
                <p className="text-[9px] uppercase tracking-widest text-[#9E9690]">
                  Taaron
                </p>
                <p
                  className="mt-3 text-white"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.3rem",
                    fontWeight: 400,
                    lineHeight: "1.3",
                  }}
                >
                  Premium leather goods made for Bangladesh
                </p>
                <p className="mt-3 text-xs leading-relaxed text-[#9E9690]">
                  Full-grain leather. COD & bKash. Delivered across Bangladesh.
                </p>
                <Link
                  href="/category/all"
                  className="mt-6 block bg-[#9B6F47] px-6 py-3 text-center text-[10px] uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-[#111111]"
                >
                  Shop Now
                </Link>
              </div>

              {/* Related */}
              {relatedPosts.length > 0 && (
                <div>
                  <p className="mb-4 text-[10px] uppercase tracking-[0.35em] text-[#9E9690]">
                    More Articles
                  </p>
                  <div className="space-y-px bg-[#E5DFD6]">
                    {relatedPosts.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/blog/${p.slug}`}
                        className="group block bg-white p-5 transition-colors hover:bg-[#FEF9EE]"
                      >
                        <p className="text-[9px] uppercase tracking-widest text-[#9B6F47]">
                          {p.category}
                        </p>
                        <p
                          className="mt-2 text-sm leading-snug text-[#111111] transition-colors group-hover:text-[#9B6F47]"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {p.title}
                        </p>
                        <p className="mt-1.5 text-xs text-[#9E9690]">
                          {p.readTime}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </FadeInSection>
          </aside>
        </div>

        {/* ── Bottom CTA ───────────────────────────────────────── */}
        <section className="border-t border-[#E5DFD6] bg-white px-6 py-16 lg:px-16">
          <FadeInSection from="up">
            <div className="mx-auto max-w-screen-lg flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#9E9690]">
                  Explore the collection
                </p>
                <p
                  className="mt-2 text-[#111111]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.4rem, 3vw, 2rem)",
                    fontWeight: 400,
                  }}
                >
                  Leather goods built to last a lifetime
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/category/all"
                  className="bg-[#111111] px-8 py-3 text-[10px] uppercase tracking-widest text-white transition-colors hover:bg-[#9B6F47] whitespace-nowrap"
                >
                  Shop All
                </Link>
                <Link
                  href="/blog"
                  className="border border-[#E5DFD6] px-8 py-3 text-[10px] uppercase tracking-widest text-[#5C5652] transition-colors hover:border-[#111111] hover:text-[#111111] whitespace-nowrap"
                >
                  More Articles
                </Link>
              </div>
            </div>
          </FadeInSection>
        </section>
      </div>
    </>
  );
}
