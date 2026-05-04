import BannerSlider from "@/components/banner-slider";
import ProductMasonry from "@/components/product-masonry";
import RecentlyViewed from "@/components/recently-viewed";
import PersonalizedProducts from "@/components/personalized-products";
import Script from "next/script";
import { getFeaturedProducts, getGridProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Taaron — Premium Leather Goods | Everyday Elegance",
  description:
    "Taaron crafts premium leather wallets, bags, and belts in Bangladesh. Artisanal craftsmanship, minimalist design, modern luxury. COD & bKash available.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Taaron — Premium Leather Goods",
    description:
      "Premium leather wallets, bags, and belts. Artisanal craftsmanship meets minimalist design.",
    type: "website",
  },
};

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Taaron",
  alternateName: "তারুণ",
  url: baseUrl,
  logo: {
    "@type": "ImageObject",
    url: `${baseUrl}/taaron-logo.png`,
    width: 1200,
    height: 630,
  },
  description:
    "Premium leather goods brand from Bangladesh. Artisanal craftsmanship, minimalist design.",
  areaServed: { "@type": "Country", name: "Bangladesh" },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "hello@taaron.bd",
    availableLanguage: ["English", "Bengali"],
    areaServed: "BD",
  },
  sameAs: [
    "https://www.facebook.com/taaron.bd",
    "https://www.instagram.com/taaron.bd",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Taaron",
  url: baseUrl,
  inLanguage: "en",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${baseUrl}/category/all?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default async function Home() {
  const [featuredProducts, products] = await Promise.all([
    getFeaturedProducts(),
    getGridProducts(),
  ]);

  return (
    <>
      <Script
        id="org-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <BannerSlider featuredProducts={featuredProducts} />
      <ProductMasonry initialProducts={products} hideEndMessage />
      <PersonalizedProducts />
      <RecentlyViewed />
    </>
  );
}
