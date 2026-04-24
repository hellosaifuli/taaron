import { createClient } from '@/lib/supabase/server'
import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000'

const staticRoutes: MetadataRoute.Sitemap = [
  { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
  { url: `${baseUrl}/auth`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  { url: `${baseUrl}/dashboard`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
]

const categoryRoutes: MetadataRoute.Sitemap = [
  'bags', 'belts', 'wallets', 'cardholder', 'ladies', 'new-arrivals'
].map((slug) => ({
  url: `${baseUrl}/?category=${slug}`,
  lastModified: new Date(),
  changeFrequency: 'weekly' as const,
  priority: 0.8,
}))

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('id, updated_at')
    .eq('status', 'active')

  const productRoutes: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${baseUrl}/products/${p.id}`,
    lastModified: new Date(p.updated_at ?? Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}
