"use client";

import { useState, ReactNode } from "react";
import ProductGallery from "@/components/product-gallery";
import AddToCart from "@/components/add-to-cart";

interface ProductViewerProps {
  images: { url: string; alt: string }[];
  productName: string;
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
  children: ReactNode;   // name + price — above add to cart
  afterCart?: ReactNode; // accordion — below add to cart
}

export default function ProductViewer({
  images,
  productName,
  product,
  children,
  afterCart,
}: ProductViewerProps) {
  const [variantImage, setVariantImage] = useState<string | null>(null);

  const allVariantImages: { url: string; alt: string }[] =
    (product.product_variants ?? [])
      .filter((v) => v.image_url)
      .map((v) => ({ url: v.image_url!, alt: v.name }));

  const activeImages = (() => {
    if (!variantImage) {
      // No variant selected — gallery + any variant images not already in gallery
      const galleryUrls = new Set(images.map((i) => i.url));
      const extraVariantImgs = allVariantImages.filter((v) => !galleryUrls.has(v.url));
      return [...images, ...extraVariantImgs];
    }
    // Variant selected — selected image first, then other variants, then gallery (all deduped)
    const seen = new Set<string>([variantImage]);
    const otherVariants = allVariantImages.filter((v) => {
      if (seen.has(v.url)) return false;
      seen.add(v.url);
      return true;
    });
    const galleryRest = images.filter((i) => !seen.has(i.url));
    return [
      { url: variantImage, alt: productName },
      ...otherVariants,
      ...galleryRest,
    ];
  })();

  return (
    <>
      <ProductGallery key={variantImage ?? "__default__"} images={activeImages} productName={productName} />

      {/* Right panel — static content + AddToCart */}
      <div className="flex flex-col px-6 pb-24 pt-10 lg:w-1/2 lg:flex-shrink-0 lg:overflow-y-auto lg:px-14 lg:pt-28 lg:pb-20">
        {children}
        <AddToCart product={product} onVariantSelect={setVariantImage} />
        {afterCart}
      </div>
    </>
  );
}
