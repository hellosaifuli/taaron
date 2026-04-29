"use client";

import { useEffect, useState } from "react";
import { getViewed } from "@/components/view-tracker";
import { createClient } from "@/lib/supabase/client";
import ProductMasonry from "@/components/product-masonry";
import type { Product } from "@/app/actions/products";

export default function PersonalizedProducts({
  currentId = "",
  currentCategory = null,
}: {
  currentId?: string;
  currentCategory?: string | null;
}) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      const history = getViewed().filter((p) => p.id !== currentId);
      const cats = [
        currentCategory,
        ...history.map((p) => p.category),
      ].filter((c): c is string => Boolean(c));
      const uniqueCats = [...new Set(cats)];
      if (!uniqueCats.length) return;

      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select(
          "id, slug, name, price, compare_at_price, image_url, thumbnail_url, product_variants(id, name, image_url)",
        )
        .eq("status", "active")
        .in("category", uniqueCats)
        .neq("id", currentId)
        .order("created_at", { ascending: false })
        .limit(12);

      if (!data?.length) return;

      const priorityCat = uniqueCats[0];
      const sorted = [...data].sort((a: any, b: any) => {
        if (a.category === priorityCat && b.category !== priorityCat) return -1;
        if (b.category === priorityCat && a.category !== priorityCat) return 1;
        return 0;
      });

      setProducts(
        sorted.map((p: any) => ({
          ...p,
          color_variants: (p.product_variants ?? []).filter(
            (v: any) => v.image_url,
          ),
        })),
      );
    }
    load();
  }, [currentId, currentCategory]);

  if (!products.length) return null;

  return (
    <section className="bg-[#F7F4EF]">
      <div className="px-2 py-6 lg:px-3">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#9B6F47]">
          Based on your browsing
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
          Picked for You
        </h2>
      </div>
      <ProductMasonry initialProducts={products} disableInfiniteScroll />
    </section>
  );
}
