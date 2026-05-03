import { createClient } from "@/lib/supabase/server";

const BASE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export async function GET() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, slug, name, description, price, compare_at_price, image_url, sku, category")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const items = (products ?? [])
    .map((p) => {
      const url = `${BASE_URL}/products/${p.slug ?? p.id}`;
      const image = p.image_url ?? "";
      const price = `${Number(p.price).toFixed(2)} BDT`;
      const salePrice = p.compare_at_price
        ? `${Number(p.price).toFixed(2)} BDT`
        : null;
      const retailPrice = p.compare_at_price
        ? `${Number(p.compare_at_price).toFixed(2)} BDT`
        : price;

      return `
    <item>
      <g:id>${p.id}</g:id>
      <g:title><![CDATA[${p.name}]]></g:title>
      <g:description><![CDATA[${p.description ?? p.name}]]></g:description>
      <g:link>${url}</g:link>
      <g:image_link>${image}</g:image_link>
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:price>${retailPrice}</g:price>
      ${salePrice ? `<g:sale_price>${salePrice}</g:sale_price>` : ""}
      ${p.sku ? `<g:mpn>${p.sku}</g:mpn>` : ""}
      ${p.category ? `<g:product_type><![CDATA[${p.category}]]></g:product_type>` : ""}
      <g:brand>Taaron</g:brand>
      <g:google_product_category>Apparel &amp; Accessories &gt; Handbags, Wallets &amp; Cases</g:google_product_category>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Taaron Product Feed</title>
    <link>${BASE_URL}</link>
    <description>Premium leather goods from Taaron</description>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
