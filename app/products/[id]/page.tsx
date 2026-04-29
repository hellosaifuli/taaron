import { createClient } from "@/lib/supabase/server";
import ProductViewer from "@/components/product-viewer";
import RelatedProducts from "@/components/related-products";
import ProductAccordion from "@/components/product-accordion";
import FadeInSection from "@/components/fade-in-section";
import ViewTracker from "@/components/view-tracker";
import PersonalizedProducts from "@/components/personalized-products";
import RecentlyViewed from "@/components/recently-viewed";
import { notFound } from "next/navigation";
import Script from "next/script";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  let { data: product } = await supabase
    .from("products")
    .select("name, description, price, image_url")
    .eq("slug", id)
    .maybeSingle();

  if (!product) {
    const { data } = await supabase
      .from("products")
      .select("name, description, price, image_url")
      .eq("id", id)
      .maybeSingle();
    product = data;
  }

  if (!product) return {};

  return {
    title: `${product.name} — Taaron`,
    description:
      product.description ||
      `Buy ${product.name} from Taaron. Premium leather goods in Bangladesh. COD & bKash available.`,
    openGraph: {
      title: `${product.name} | Taaron`,
      description:
        product.description || `Premium leather ${product.name} by Taaron.`,
      images: product.image_url
        ? [{ url: product.image_url, alt: product.name }]
        : [],
    },
    alternates: { canonical: `/products/${id}` },
  };
}

const accordionSections = (description: string | null) => [
  {
    title: "Description",
    content:
      description ||
      "A premium leather product crafted with artisanal care and precision.",
  },
  {
    title: "Materials & Care",
    content:
      "Full-grain or top-grain leather. Apply leather conditioner every 3–6 months. Wipe clean with a dry cloth. Keep away from direct sunlight and moisture.",
  },
  {
    title: "Shipping & Returns",
    content:
      "Dhaka: 1–2 business days. Outside Dhaka: 3–5 business days. 30-day returns on unused items in original condition.",
  },
];

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Support both slug-based and ID-based URLs for backward compatibility
  const productSelect = `
    id, slug, name, description, price, compare_at_price, sku, image_url, thumbnail_url, status,
    product_variants (id, name, sku, price_adjustment, stock_quantity, image_url)
  `;

  // Try slug first, fall back to UUID id
  let { data: product } = await supabase
    .from("products")
    .select(productSelect)
    .eq("slug", id)
    .eq("status", "active")
    .maybeSingle();

  if (!product) {
    const { data } = await supabase
      .from("products")
      .select(productSelect)
      .eq("id", id)
      .eq("status", "active")
      .maybeSingle();
    product = data;
  }

  const { data: extraImages } = await supabase
    .from("product_images")
    .select("url, alt, position")
    .eq("product_id", product?.id ?? id)
    .order("position");

  if (!product) notFound();

  const allImages = [
    ...(product.image_url
      ? [{ url: product.image_url, alt: product.name }]
      : []),
    ...(extraImages ?? []).map((img) => ({
      url: img.url,
      alt: img.alt || product.name,
    })),
  ];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    url: `${baseUrl}/products/${id}`,
    inLanguage: "en",
    image: allImages.map((i) => i.url),
    brand: { "@type": "Brand", name: "Taaron" },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/products/${id}`,
      priceCurrency: "BDT",
      price: product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      areaServed: { "@type": "Country", name: "Bangladesh" },
      seller: { "@type": "Organization", name: "Taaron", url: baseUrl },
    },
  };

  const sections = accordionSections(product.description);

  return (
    <>
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="min-h-screen bg-[#F7F4EF] text-[#111111]">
        {/* ── Editorial split: image left | info right ─────────────── */}
        <div className="lg:flex lg:min-h-screen">
          <ProductViewer
            images={allImages}
            productName={product.name}
            product={product}
          >
            {/* Static right-panel content — server rendered, passed as children */}
            <FadeInSection from="right">
              {product.sku && (
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#9B6F47]">
                  SKU: {product.sku}
                </p>
              )}
              <h1
                className="mt-3 leading-tight text-[#111111]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                }}
              >
                {product.name}
              </h1>
            </FadeInSection>

            <FadeInSection delay={120} from="right">
              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                {product.compare_at_price != null &&
                  product.compare_at_price > product.price && (
                    <>
                      <span
                        className="text-[#9E9690] line-through"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.25rem",
                          fontWeight: 400,
                        }}
                      >
                        ৳{product.compare_at_price.toLocaleString()}
                      </span>
                      <span className="rounded bg-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
                        -{Math.round((1 - product.price / product.compare_at_price) * 100)}% OFF
                      </span>
                    </>
                  )}
                <p
                  className="text-[#111111]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.75rem",
                    fontWeight: 500,
                  }}
                >
                  ৳{product.price.toLocaleString()}
                </p>
                <span className="text-xs uppercase tracking-wider text-[#9E9690]">
                  BDT
                </span>
              </div>
            </FadeInSection>

            <FadeInSection delay={280} from="up">
              <ProductAccordion items={sections} />
            </FadeInSection>
          </ProductViewer>
        </div>

        {/* ── Personalized: based on browsing history ─────────────── */}
        <PersonalizedProducts
          currentId={product.id}
          currentCategory={(product as any).category ?? null}
        />

        {/* ── Recently viewed strip ────────────────────────────────── */}
        <RecentlyViewed currentId={product.id} />

        {/* ── Related products — full bleed ───────────────────────── */}
        <RelatedProducts currentId={id} />

        {/* Track this view in localStorage */}
        <ViewTracker
          product={{
            id: product.id,
            slug: (product as any).slug ?? null,
            name: product.name,
            category: (product as any).category ?? null,
            image_url: product.image_url ?? null,
            price: product.price,
          }}
        />
      </div>
    </>
  );
}
