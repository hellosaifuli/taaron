"use client";

import { useState } from "react";
import Link from "next/link";
import StitchImage from "@/components/stitch-image";

interface GalleryImage {
  url: string;
  alt: string;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = images[activeIdx] ?? images[0];

  if (!active) {
    return (
      <div className="relative lg:sticky lg:top-0 lg:h-screen lg:w-[58%] lg:flex-shrink-0">
        <div className="flex aspect-[4/5] max-h-[85vh] w-full items-center justify-center bg-[#EDE9E3] text-sm text-[#9E9690]">
          No image
        </div>
      </div>
    );
  }

  return (
    <div className="relative lg:sticky lg:top-0 lg:h-screen lg:w-[58%] lg:flex-shrink-0 lg:overflow-hidden">
      {/* Main image */}
      <div
        className="relative w-full overflow-hidden bg-[#EDE9E3]"
        style={{ aspectRatio: "4/5", maxHeight: "85vh" }}
      >
        <StitchImage
          src={active.url}
          alt={active.alt || productName}
          className="object-cover"
          priority={activeIdx === 0}
          sizes="(max-width: 1024px) 100vw, 58vw"
        />

        {/* Gradient fade to cream at bottom — mobile only */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F7F4EF] to-transparent lg:hidden" />

        {/* Breadcrumb overlay */}
        <nav
          aria-label="Breadcrumb"
          className="absolute top-24 left-6 lg:top-8 lg:left-8 flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-[10px] uppercase tracking-widest backdrop-blur-sm"
        >
          <Link href="/" className="text-white/80 transition-colors hover:text-white">
            Home
          </Link>
          <span className="text-white/40">/</span>
          <Link
            href="/category/all"
            className="text-white/80 transition-colors hover:text-white"
          >
            Shop
          </Link>
          <span className="text-white/40">/</span>
          <span className="max-w-[180px] truncate text-white/60 lg:max-w-[320px]">{productName}</span>
        </nav>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/30 px-2.5 py-1 text-[10px] uppercase tracking-widest text-white backdrop-blur-sm">
            {activeIdx + 1} / {images.length}
          </div>
        )}

        {/* Prev / Next arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setActiveIdx((i) => (i - 1 + images.length) % images.length)
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center bg-white/80 text-[#111111] backdrop-blur-sm transition-colors hover:bg-white"
              aria-label="Previous image"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => setActiveIdx((i) => (i + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center bg-white/80 text-[#111111] backdrop-blur-sm transition-colors hover:bg-white"
              aria-label="Next image"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip — desktop, interactive */}
      {images.length > 1 && (
        <div className="hidden lg:flex gap-1.5 bg-[#F7F4EF] p-3">
          {images.slice(0, 6).map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`relative h-16 flex-1 overflow-hidden bg-[#EDE9E3] transition-all duration-200 ${
                i === activeIdx
                  ? "ring-1 ring-[#9B6F47] ring-offset-1"
                  : "opacity-55 hover:opacity-100"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <StitchImage
                src={img.url}
                alt={img.alt || productName}
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Thumbnail strip — mobile, interactive */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto bg-[#F7F4EF] px-4 pb-4 pt-2 lg:hidden">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden bg-[#EDE9E3] transition-all duration-200 ${
                i === activeIdx
                  ? "ring-1 ring-[#9B6F47] ring-offset-1"
                  : "opacity-55 hover:opacity-100"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <StitchImage
                src={img.url}
                alt={img.alt || productName}
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
