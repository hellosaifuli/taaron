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
  color_variants: ColorVariant[];
}

export async function fetchProducts(
  offset: number,
  limit = 50,
): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(
      "id, slug, name, price, compare_at_price, image_url, thumbnail_url, product_variants(id, name, image_url)",
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
    color_variants: (p.product_variants ?? []).filter(
      (v: any) => v.image_url,
    ) as ColorVariant[],
  }));
}
