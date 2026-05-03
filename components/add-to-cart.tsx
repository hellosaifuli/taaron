"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { toast } from "sonner";
import { fbEvent } from "@/lib/fb-pixel";

interface AddToCartProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_url?: string | null;
    product_variants?: {
      id: string;
      name: string;
      price_adjustment: number;
      stock_quantity: number;
      image_url?: string | null;
    }[];
  };
  onVariantSelect?: (imageUrl: string | null) => void;
}

export default function AddToCart({ product, onVariantSelect }: AddToCartProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  function selectVariant(id: string | null) {
    setSelectedVariant(id);
    const variant = product.product_variants?.find((v) => v.id === id);
    onVariantSelect?.(variant?.image_url ?? null);
  }
  const [showStickyBar, setShowStickyBar] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  const variants = product.product_variants ?? [];
  const needsVariant = variants.length > 0 && !selectedVariant;
  const selectedVariantData = variants.find((v) => v.id === selectedVariant);
  const finalPrice =
    product.price + (selectedVariantData?.price_adjustment ?? 0);

  // Show sticky CTA only after user scrolls PAST the main buttons (not on initial load)
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          // Only show when element is above the viewport (scrolled past), not below (not reached)
          setShowStickyBar(entry.boundingClientRect.top < 0);
        } else {
          setShowStickyBar(false);
        }
      },
      { rootMargin: "0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleAdd = () => {
    if (needsVariant) {
      toast.error("Please select a variant first.");
      return;
    }
    if (selectedVariantData?.stock_quantity === 0) {
      toast.error("This variant is out of stock.");
      return;
    }
    addItem({
      product_id: product.id,
      variant_id: selectedVariant,
      quantity,
      price: finalPrice,
      name:
        product.name +
        (selectedVariantData ? ` — ${selectedVariantData.name}` : ""),
      image_url: product.image_url,
    });
    fbEvent("AddToCart", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      value: finalPrice * quantity,
      currency: "BDT",
    });
    toast.success(`${product.name} added to cart`, {
      action: { label: "View Cart", onClick: () => router.push("/checkout") },
    });
  };

  const handleBuyNow = () => {
    if (needsVariant) {
      toast.error("Please select a variant first.");
      return;
    }
    if (selectedVariantData?.stock_quantity === 0) {
      toast.error("This variant is out of stock.");
      return;
    }
    addItem({
      product_id: product.id,
      variant_id: selectedVariant,
      quantity,
      price: finalPrice,
      name:
        product.name +
        (selectedVariantData ? ` — ${selectedVariantData.name}` : ""),
      image_url: product.image_url,
    });
    router.push("/checkout");
  };

  return (
    <>
      <div className="space-y-5">
        {/* Variant selector */}
        {variants.length > 0 && (
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.15em] text-[#9E9690]">
              Select Variant
            </p>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => {
                const outOfStock = v.stock_quantity === 0;
                const isSelected = selectedVariant === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => !outOfStock && selectVariant(v.id)}
                    disabled={outOfStock}
                    className={`relative border px-4 py-2.5 text-xs tracking-wide transition-all duration-150 ${
                      outOfStock
                        ? "cursor-not-allowed border-[#E5DFD6] text-[#C4BDB5] line-through"
                        : isSelected
                          ? "border-[#111111] bg-[#111111] text-white"
                          : "border-[#E5DFD6] text-[#5C5652] hover:border-[#111111]"
                    }`}
                  >
                    {v.name}
                    {v.price_adjustment > 0 && !outOfStock && (
                      <span
                        className={`ml-1 ${isSelected ? "text-white/70" : "text-[#9B6F47]"}`}
                      >
                        +৳{v.price_adjustment}
                      </span>
                    )}
                    {outOfStock && (
                      <span className="ml-1 text-[10px] not-italic normal-case no-underline">
                        sold out
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity stepper */}
        <div>
          <p className="mb-3 text-[11px] uppercase tracking-[0.15em] text-[#9E9690]">
            Quantity
          </p>
          <div className="flex h-12 w-36 items-center border border-[#E5DFD6]">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-full w-12 items-center justify-center text-[#5C5652] transition-colors hover:bg-[#EDE9E3]"
              aria-label="Decrease quantity"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 12H4"
                />
              </svg>
            </button>
            <span className="flex-1 text-center text-sm font-medium tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-full w-12 items-center justify-center text-[#5C5652] transition-colors hover:bg-[#EDE9E3]"
              aria-label="Increase quantity"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* CTAs — observed to trigger sticky bar */}
        <div ref={ctaRef} className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={handleAdd}
            className="w-full rounded-sm bg-[#111111] px-6 py-4 text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-[#9B6F47] active:bg-[#9B6F47]"
          >
            Add to Cart — ৳{(finalPrice * quantity).toLocaleString()}
          </button>
          <button
            onClick={handleBuyNow}
            className="w-full rounded-sm border border-[#111111] px-6 py-4 text-[11px] uppercase tracking-widest text-[#111111] transition-colors hover:bg-[#111111] hover:text-white"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Sticky mobile CTA — appears when regular buttons scroll out of view */}
      <div
        className={`fixed inset-x-0 z-40 px-3 transition-transform duration-300 lg:hidden ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ bottom: "calc(max(env(safe-area-inset-bottom), 8px) + 60px)" }}
      >
        <button
          onClick={handleAdd}
          className="w-full rounded-full border border-[#E5DFD6] bg-[#111111] py-3.5 text-[10px] uppercase tracking-widest text-white shadow-sm backdrop-blur-md active:bg-[#9B6F47]"
        >
          Add to Cart — ৳{(finalPrice * quantity).toLocaleString()}
        </button>
      </div>
    </>
  );
}
