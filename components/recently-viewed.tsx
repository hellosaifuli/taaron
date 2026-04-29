"use client";

import { useEffect, useState } from "react";
import { getViewed } from "@/components/view-tracker";
import { createClient } from "@/lib/supabase/client";
import ProductMasonry from "@/components/product-masonry";
import type { Product } from "@/app/actions/products";

function mapProducts(data: any[]): Product[] {
  return data.map((p) => ({
    ...p,
    color_variants: (p.product_variants ?? []).filter((v: any) => v.image_url),
  }));
}

const PRODUCT_SELECT =
  "id, slug, name, price, compare_at_price, image_url, thumbnail_url, product_variants(id, name, image_url)";

async function fetchFallback(excludeId?: string): Promise<Product[]> {
  const supabase = createClient();
  let q = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .eq("featured", false)
    .order("created_at", { ascending: false })
    .limit(12);
  if (excludeId) q = q.neq("id", excludeId);
  const { data } = await q;
  return mapProducts(data ?? []);
}

export default function RecentlyViewed({ currentId }: { currentId?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cleared, setCleared] = useState(false);
  const [fallback, setFallback] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      const history = getViewed().filter((p) => p.id !== currentId);
      if (!history.length) return;

      const ids = history.map((p) => p.id);
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("status", "active")
        .in("id", ids)
        .limit(12);

      if (!data?.length) return;

      const ordered = ids
        .map((id) => data.find((p: any) => p.id === id))
        .filter(Boolean) as any[];

      setProducts(mapProducts(ordered));
    }
    load();
  }, [currentId]);

  async function handleClear() {
    localStorage.removeItem("taaron_viewed");
    setProducts([]);
    setCleared(true);
    if (!fallback.length) {
      const fb = await fetchFallback(currentId);
      setFallback(fb);
    }
  }

  // Show nothing if no history and not cleared
  if (!products.length && !cleared) return null;

  const isShowingFallback = cleared || products.length === 0;
  const displayProducts = isShowingFallback ? fallback : products;

  if (!displayProducts.length) return null;

  return (
    <section className="bg-[#F7F4EF]">
      <div className="flex items-end justify-between px-2 py-6 lg:px-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#9B6F47]">
            {isShowingFallback ? "Discover" : "Continue Browsing"}
          </p>
          <h2
            className="mt-2 text-[#111111]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
              lineHeight: 1,
              letterSpacing: "-0.01em",
              fontWeight: 400,
            }}
          >
            {isShowingFallback ? "You May Also Like" : "Recently Viewed"}
          </h2>
        </div>
        {!isShowingFallback && (
          <button
            onClick={handleClear}
            className="text-[10px] uppercase tracking-widest text-[#C4BDB5] hover:text-[#9E9690]"
          >
            Clear
          </button>
        )}
      </div>
      <ProductMasonry initialProducts={displayProducts} disableInfiniteScroll />
    </section>
  );
}
