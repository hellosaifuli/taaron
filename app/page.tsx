import { createClient } from '@/lib/supabase/server'
import BannerSlider from '@/components/banner-slider'
import ProductMasonry from '@/components/product-masonry'
import Script from 'next/script'
import type { Product } from '@/app/actions/products'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Taaron — Premium Leather Goods | Everyday Elegance',
  description:
    'Taaron crafts premium leather wallets, bags, and belts in Bangladesh. Artisanal craftsmanship, minimalist design, modern luxury. COD & bKash available.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Taaron — Premium Leather Goods',
    description: 'Premium leather wallets, bags, and belts. Artisanal craftsmanship meets minimalist design.',
    type: 'website',
  },
}

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000'

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Taaron',
  alternateName: 'তারণ',
  url: baseUrl,
  logo: `${baseUrl}/taaron-logo.png`,
  description: 'Premium leather goods brand from Bangladesh.',
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Taaron',
  url: baseUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${baseUrl}/?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

export default async function Home() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('id, name, price, image_url, thumbnail_url')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(50)

  const products = (data as Product[] | null) ?? []

  return (
    <>
      <Script id="org-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <Script id="website-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />

      <BannerSlider />
      <ProductMasonry initialProducts={products} />
    </>
  )
}
