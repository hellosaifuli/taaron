"use server";
import { createClient } from "@/lib/supabase/server";

export interface ColorVariant {
  id: string;
  name: string;
  image_url: string;
}

export interface Product {
  id: string;
  slug: string | null;
  name: string;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  thumbnail_url: string | null;
  category: string | null;
  color_variants: ColorVariant[];
}

const categoryPriority: Record<string, number> = {
  bags: 1,
  ladies: 2,
  wallets: 3,
  belts: 4,
  cardholder: 5,
};

export function sortByCategory(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const pa = categoryPriority[a.category ?? ""] ?? 99;
    const pb = categoryPriority[b.category ?? ""] ?? 99;
    return pa !== pb ? pa - pb : 0;
  });
}

export async function fetchProducts(
  offset: number,
  limit = 50,
): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(
      "id, slug, name, price, compare_at_price, image_url, thumbnail_url, category, product_variants(id, name, image_url)",
    )
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return ((data as any[]) ?? []).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    compare_at_price: p.compare_at_price,
    image_url: p.image_url,
    thumbnail_url: p.thumbnail_url,
    category: p.category ?? null,
    color_variants: (p.product_variants ?? []).filter(
      (v: any) => v.image_url,
    ) as ColorVariant[],
  }));
}
