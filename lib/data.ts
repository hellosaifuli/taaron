import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { sortByCategory } from "@/app/actions/products";
import type { Product } from "@/app/actions/products";

const PRODUCT_SELECT =
  "id, slug, name, price, compare_at_price, image_url, thumbnail_url, category, product_variants(id, name, image_url)";

const PRODUCT_DETAIL_SELECT = `
  id, slug, name, description, price, compare_at_price, sku, image_url, thumbnail_url, status,
  product_variants (id, name, sku, price_adjustment, stock_quantity, image_url)
`;

function mapProducts(raw: any[]): Product[] {
  return raw.map((p) => ({
    ...p,
    color_variants: (p.product_variants ?? []).filter((v: any) => v.image_url),
  }));
}

export const getFeaturedProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("status", "active")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(3);
    return mapProducts(data ?? []);
  },
  ["featured-products"],
  { revalidate: 60, tags: ["products"] },
);

export const getGridProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("status", "active")
      .eq("featured", false)
      .order("created_at", { ascending: false })
      .limit(50);
    return sortByCategory(mapProducts(data ?? []));
  },
  ["grid-products"],
  { revalidate: 60, tags: ["products"] },
);

export const getCategoryProducts = unstable_cache(
  async (slug: string, query?: string): Promise<Product[]> => {
    const supabase = createAdminClient();
    let q = supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(50);
    if (slug !== "all") q = q.eq("category", slug);
    if (query?.trim()) q = q.ilike("name", `%${query.trim()}%`);
    const { data } = await q;
    const mapped = mapProducts(data ?? []);
    return slug === "all" ? sortByCategory(mapped) : mapped;
  },
  ["category-products"],
  { revalidate: 60, tags: ["products"] },
);

export const getProduct = unstable_cache(
  async (id: string) => {
    const supabase = createAdminClient();
    let { data: product } = await supabase
      .from("products")
      .select(PRODUCT_DETAIL_SELECT)
      .eq("slug", id)
      .eq("status", "active")
      .maybeSingle();
    if (!product) {
      const { data } = await supabase
        .from("products")
        .select(PRODUCT_DETAIL_SELECT)
        .eq("id", id)
        .eq("status", "active")
        .maybeSingle();
      product = data;
    }
    return product;
  },
  ["product"],
  { revalidate: 300, tags: ["products"] },
);

export const getProductImages = unstable_cache(
  async (productId: string) => {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("product_images")
      .select("url, alt, position")
      .eq("product_id", productId)
      .order("position");
    return data ?? [];
  },
  ["product-images"],
  { revalidate: 300, tags: ["products"] },
);
