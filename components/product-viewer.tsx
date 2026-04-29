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
  children: ReactNode; // static info: name, price, accordion — server-rendered
}

export default function ProductViewer({
  images,
  productName,
  product,
  children,
}: ProductViewerProps) {
  const [variantImage, setVariantImage] = useState<string | null>(null);

  const activeImages =
    variantImage && variantImage !== images[0]?.url
      ? [{ url: variantImage, alt: productName }, ...images]
      : images;

  return (
    <>
      <ProductGallery images={activeImages} productName={productName} />

      {/* Right panel — static content + AddToCart */}
      <div className="flex flex-col px-6 pb-24 pt-10 lg:flex-1 lg:overflow-y-auto lg:px-14 lg:pt-28 lg:pb-20">
        {children}
        <AddToCart product={product} onVariantSelect={setVariantImage} />
      </div>
    </>
  );
}
