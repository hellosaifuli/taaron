"use client";

import { useEffect } from "react";

export interface ViewedProduct {
  id: string;
  slug: string | null;
  name: string;
  category: string | null;
  image_url: string | null;
  price: number;
  viewedAt: number;
}

const KEY = "taaron_viewed";
const MAX = 12;

export function saveView(product: Omit<ViewedProduct, "viewedAt">) {
  try {
    const raw = localStorage.getItem(KEY);
    const list: ViewedProduct[] = raw ? JSON.parse(raw) : [];
    const filtered = list.filter((p) => p.id !== product.id);
    const updated = [{ ...product, viewedAt: Date.now() }, ...filtered].slice(
      0,
      MAX,
    );
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {
    /* ignore */
  }
}

export function getViewed(): ViewedProduct[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function ViewTracker({
  product,
}: {
  product: Omit<ViewedProduct, "viewedAt">;
}) {
  useEffect(() => {
    saveView(product);
  }, [product.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
