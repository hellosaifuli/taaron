"use client";

import { useEffect, useState } from "react";
import { getViewed } from "@/components/view-tracker";
import { createClient } from "@/lib/supabase/client";
import ProductMasonry from "@/components/product-masonry";
import type { Product } from "@/app/actions/products";

export default function RecentlyViewed({ currentId }: { currentId?: string }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      const history = getViewed().filter((p) => p.id !== currentId);
      if (!history.length) return;

      const ids = history.map((p) => p.id);
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select(
          "id, slug, name, price, compare_at_price, image_url, thumbnail_url, product_variants(id, name, image_url)",
        )
        .eq("status", "active")
        .in("id", ids)
        .limit(12);

      if (!data?.length) return;

      // Preserve localStorage order (most recent first)
      const ordered = ids
        .map((id) => data.find((p: any) => p.id === id))
        .filter(Boolean) as any[];

      setProducts(
        ordered.map((p) => ({
          ...p,
          color_variants: (p.product_variants ?? []).filter(
            (v: any) => v.image_url,
          ),
        })),
      );
    }
    load();
  }, [currentId]);

  if (!products.length) return null;

  return (
    <section className="bg-[#F7F4EF]">
      <div className="mx-auto flex max-w-screen-xl items-end justify-between px-6 py-8 lg:px-12">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#9B6F47]">
            Continue Browsing
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
            Recently Viewed
          </h2>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("taaron_viewed");
            setProducts([]);
          }}
          className="text-[10px] uppercase tracking-widest text-[#C4BDB5] hover:text-[#9E9690]"
        >
          Clear
        </button>
      </div>
      <ProductMasonry initialProducts={products} disableInfiniteScroll />
    </section>
  );
}
