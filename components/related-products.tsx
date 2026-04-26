import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ProductMasonry from "@/components/product-masonry";
import type { Product } from "@/app/actions/products";

export default async function RelatedProducts({
  currentId,
}: {
  currentId: string;
}) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, price, image_url, thumbnail_url")
    .eq("status", "active")
    .neq("id", currentId)
    .order("created_at", { ascending: false })
    .limit(50);

  const products = (data as Product[] | null) ?? [];
  if (!products.length) return null;

  return (
    <section className="bg-[#F7F4EF]">
      {/* Section header */}
      <div className="mx-auto flex max-w-screen-xl items-end justify-between px-6 py-12 lg:px-12">
        <div>
          <p
            className="text-[10px] uppercase tracking-[0.4em]"
            style={{ color: "#9B6F47" }}
          >
            Discover
          </p>
          <h2
            className="mt-2 text-[#111111]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
              lineHeight: "1",
              letterSpacing: "-0.01em",
              fontWeight: 400,
            }}
          >
            You May Also Like
          </h2>
        </div>
        <Link
          href="/category/all"
          className="text-[11px] uppercase tracking-widest text-[#5C5652] transition-colors hover:text-[#111111]"
        >
          View All →
        </Link>
      </div>

      {/* Masonry grid */}
      <ProductMasonry initialProducts={products} />
    </section>
  );
}
