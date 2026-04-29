"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getViewed, type ViewedProduct } from "@/components/view-tracker";

export default function RecentlyViewed({
  currentId,
}: {
  currentId?: string;
}) {
  const [items, setItems] = useState<ViewedProduct[]>([]);

  useEffect(() => {
    const viewed = getViewed().filter((p) => p.id !== currentId);
    setItems(viewed.slice(0, 8));
  }, [currentId]);

  if (!items.length) return null;

  return (
    <section className="bg-[#F7F4EF] px-4 pb-4 lg:px-6">
      <div className="mx-auto max-w-screen-xl">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#9B6F47]">
            Continue Browsing
          </p>
          <button
            onClick={() => {
              localStorage.removeItem("taaron_viewed");
              setItems([]);
            }}
            className="text-[9px] uppercase tracking-widest text-[#C4BDB5] hover:text-[#9E9690]"
          >
            Clear
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {items.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.slug ?? p.id}`}
              className="group flex-shrink-0"
            >
              <div className="relative h-28 w-24 overflow-hidden bg-[#EDE9E3]">
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] text-[#9E9690]">
                    —
                  </div>
                )}
              </div>
              <p className="mt-1.5 max-w-[96px] truncate text-[11px] leading-tight text-[#1E2737]">
                {p.name}
              </p>
              <p className="text-[10px] text-[#9B6F47]">
                ৳{p.price.toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
