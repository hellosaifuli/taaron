"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getViewed } from "@/components/view-tracker";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/app/actions/products";

export default function PersonalizedProducts({
  currentId,
  currentCategory,
}: {
  currentId: string;
  currentCategory: string | null;
}) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      const history = getViewed().filter((p) => p.id !== currentId);

      // Collect categories from history + current product, deduplicated
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

      // Sort: same category as most recently viewed first
      const priorityCat = uniqueCats[0];
      const sorted = [...data].sort((a: any, b: any) => {
        if (a.category === priorityCat && b.category !== priorityCat) return -1;
        if (b.category === priorityCat && a.category !== priorityCat) return 1;
        return 0;
      });

      const mapped: Product[] = sorted.map((p: any) => ({
        ...p,
        color_variants: (p.product_variants ?? []).filter(
          (v: any) => v.image_url,
        ),
      }));

      setProducts(mapped);
    }

    load();
  }, [currentId, currentCategory]);

  if (!products.length) return null;

  return (
    <section className="bg-[#F7F4EF] px-6 pb-16 lg:px-12">
      <div className="mx-auto max-w-screen-xl">
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#9B6F47]">
            Based on your browsing
          </p>
          <h2
            className="mt-2 text-[#111111]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
              fontWeight: 400,
              letterSpacing: "-0.01em",
            }}
          >
            Picked for You
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => {
            const isOnSale =
              p.compare_at_price != null && p.compare_at_price > p.price;
            return (
              <Link
                key={p.id}
                href={`/products/${p.slug ?? p.id}`}
                className="group relative block overflow-hidden bg-[#EDE9E3]"
              >
                <div className="relative aspect-[3/4]">
                  {p.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#EDE9E3] text-[#9E9690] text-sm">
                      —
                    </div>
                  )}
                  {isOnSale && (
                    <div className="absolute left-2 top-2 bg-red-500 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-white">
                      -{Math.round((1 - p.price / p.compare_at_price!) * 100)}%
                    </div>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="truncate text-[12px] font-medium text-[#1E2737]">
                    {p.name}
                  </p>
                  <div className="mt-0.5 flex items-baseline gap-2">
                    {isOnSale && (
                      <span className="text-[11px] text-[#C4BDB5] line-through">
                        ৳{p.compare_at_price!.toLocaleString()}
                      </span>
                    )}
                    <span className="text-[12px] text-[#9B6F47]">
                      ৳{p.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
