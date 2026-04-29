"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { fetchProducts, type Product } from "@/app/actions/products";
import StitchImage from "@/components/stitch-image";

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
  "https://images.unsplash.com/photo-1627123424574-724758594785?w=800&q=80",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
  "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80",
];

const PATTERN = [
  { lg: "lg:col-span-6", aspect: "lg:aspect-[4/5]", oval: false },
  { lg: "lg:col-span-4", aspect: "lg:aspect-square", oval: true },
  { lg: "lg:col-span-3", aspect: "lg:aspect-[3/4]", oval: false },
  { lg: "lg:col-span-4", aspect: "lg:aspect-[3/5]", oval: false },
  { lg: "lg:col-span-3", aspect: "lg:aspect-[3/4]", oval: false },
  { lg: "lg:col-span-6", aspect: "lg:aspect-[4/3]", oval: false },
  { lg: "lg:col-span-4", aspect: "lg:aspect-[3/4]", oval: false },
];

function MasonryCard({ product, idx }: { product: Product; idx: number }) {
  const pat = PATTERN[idx % 7]!;
  const [activeVariantImg, setActiveVariantImg] = useState<string | null>(null);

  const baseImg =
    product.image_url ??
    product.thumbnail_url ??
    PLACEHOLDER_IMAGES[idx % PLACEHOLDER_IMAGES.length]!;

  const colorVariants = product.color_variants ?? [];
  const isOnSale =
    product.compare_at_price != null &&
    product.compare_at_price > product.price;
  const discountPct = isOnSale
    ? Math.round((1 - product.price / product.compare_at_price!) * 100)
    : 0;

  const href = `/products/${product.slug ?? product.id}`;

  return (
    <Link
      href={href}
      data-card
      className={[
        "masonry-card group relative block overflow-hidden bg-[#EDE9E3]",
        "aspect-[3/4]",
        pat.lg,
        pat.aspect,
        pat.oval ? "lg:rounded-full" : "",
      ].join(" ")}
    >
      {/* Base image */}
      <StitchImage
        src={baseImg}
        alt={product.name}
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 1024px) 100vw, 40vw"
      />

      {/* Variant image overlay — fades in on swatch hover */}
      {activeVariantImg && (
        <div className="absolute inset-0 z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeVariantImg}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Sale badge — always visible */}
      {isOnSale && (
        <div className="absolute left-3 top-3 z-20 bg-red-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
          -{discountPct}%
        </div>
      )}

      {/* Hover overlay: name + price + color swatches */}
      <div className="absolute inset-x-0 bottom-3 z-20 flex flex-col items-center gap-2 px-3 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
        {/* Name + price pill */}
        <div className="flex min-w-0 max-w-full items-center gap-2.5 rounded-full bg-black/55 px-5 py-2 backdrop-blur-sm">
          <span className="truncate text-[13px] leading-tight text-white">
            {product.name}
          </span>
          <span className="flex-shrink-0 text-[13px] leading-tight">
            {isOnSale && (
              <span className="mr-1.5 text-white/40 line-through">
                ৳{product.compare_at_price!.toLocaleString()}
              </span>
            )}
            <span className={isOnSale ? "text-red-300" : "text-white/70"}>
              ৳{product.price.toLocaleString()}
            </span>
          </span>
        </div>

        {/* Color swatches */}
        {colorVariants.length > 0 && (
          <div className="flex gap-1.5">
            {colorVariants.slice(0, 6).map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={(e) => e.preventDefault()}
                onMouseEnter={() => setActiveVariantImg(v.image_url)}
                onMouseLeave={() => setActiveVariantImg(null)}
                title={v.name}
                className="relative h-7 w-7 overflow-hidden rounded-full border-2 border-white/60 transition-transform duration-150 hover:scale-110 hover:border-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.image_url}
                  alt={v.name}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function ProductMasonry({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length === 50);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(initialProducts.length === 50);
  const countRef = useRef(initialProducts.length);

  useEffect(() => {
    countRef.current = products.length;
  }, [products.length]);

  // ── Infinite scroll ────────────────────────────────────────────────────
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const handleIntersect = async ([entry]: IntersectionObserverEntry[]) => {
      if (!entry?.isIntersecting || loadingRef.current || !hasMoreRef.current)
        return;
      loadingRef.current = true;
      setLoading(true);
      try {
        const more = await fetchProducts(countRef.current);
        const reachedEnd = more.length < 50;
        hasMoreRef.current = !reachedEnd;
        setHasMore(!reachedEnd);
        if (more.length > 0) {
          setProducts((prev) => [...prev, ...more]);
          countRef.current += more.length;
        }
      } catch {
        /* silently fail */
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: "400px",
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // ── Card scroll-reveal stagger ─────────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const grid = gridRef.current;
    if (!grid) return;

    let batchCounter = 0;
    let batchTimer: ReturnType<typeof setTimeout>;

    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = Math.min(batchCounter, 4) * 70;
          batchCounter++;
          clearTimeout(batchTimer);
          batchTimer = setTimeout(() => {
            batchCounter = 0;
          }, 200);

          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("card-revealed");
          cardObserver.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.05 },
    );

    const cards = grid.querySelectorAll("[data-card]");
    cards.forEach((card) => {
      if (!card.classList.contains("card-revealed")) {
        cardObserver.observe(card);
      }
    });

    return () => cardObserver.disconnect();
  }, [products.length]);

  return (
    <div className="bg-[#F7F4EF]">
      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-2 p-2 lg:grid-cols-10 lg:items-start lg:gap-3 lg:p-3"
      >
        {products.map((product, idx) => (
          <MasonryCard key={`${product.id}-${idx}`} product={product} idx={idx} />
        ))}
      </div>

      <div ref={sentinelRef} className="flex justify-center py-12">
        {loading && (
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-[#9B6F47] animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        )}
        {!hasMore && !loading && products.length > 0 && (
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#9E9690]">
            End of Collection
          </p>
        )}
      </div>
    </div>
  );
}
