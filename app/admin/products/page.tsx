import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { deleteProduct, toggleStatus } from "./actions";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@taaron.bd";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin — Products",
  robots: { index: false, follow: false },
};

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) redirect("/auth");

  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, sku, status, image_url, category, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-20">
      <div className="mx-auto max-w-screen-xl px-6 py-12 lg:px-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#1969B5]">
              Admin
            </p>
            <h1
              className="mt-1 font-serif text-3xl font-medium"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Products
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[11px] uppercase tracking-widest text-[#4B5C73] hover:text-[#1E2737]"
            >
              ← Store
            </Link>
            <Link
              href="/admin/products/new"
              className="bg-[#1E2737] px-5 py-2.5 text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-[#1969B5]"
            >
              + Add Product
            </Link>
          </div>
        </div>

        <div className="mt-1 h-px w-16 bg-[#1969B5]" />

        {/* Products Table */}
        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#1E2737]">
            All Products{" "}
            <span className="font-normal text-[#7A8EA6]">
              ({products?.length ?? 0})
            </span>
          </h2>

          <div className="mt-4 divide-y divide-[#DDE3EB] border border-[#DDE3EB] bg-white">
            {!products?.length ? (
              <p className="px-6 py-8 text-sm text-[#7A8EA6]">
                No products yet.
              </p>
            ) : (
              products.map((p) => (
                <div key={p.id} className="flex items-center gap-4 px-6 py-4">
                  {/* Thumbnail */}
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden bg-[#EEF2F7]">
                    {p.image_url ? (
                      <Image
                        src={p.image_url}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-[#7A8EA6]">
                        —
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-[#1E2737]">
                      {p.name}
                    </p>
                    <p className="text-xs text-[#7A8EA6]">
                      ৳{p.price.toLocaleString()}
                      {p.sku && <span className="ml-3">SKU: {p.sku}</span>}
                      {p.category && (
                        <span className="ml-3 capitalize">{p.category}</span>
                      )}
                    </p>
                  </div>

                  {/* Status badge */}
                  <span
                    className={`hidden flex-shrink-0 px-2 py-0.5 text-[10px] uppercase tracking-wider sm:block ${p.status === "active" ? "bg-green-50 text-green-700" : "bg-[#EEF2F7] text-[#7A8EA6]"}`}
                  >
                    {p.status}
                  </span>

                  {/* Actions */}
                  <div className="flex flex-shrink-0 items-center gap-3">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-[11px] uppercase tracking-widest text-[#4B5C73] hover:text-[#1E2737]"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/products/${p.id}`}
                      target="_blank"
                      className="text-[11px] uppercase tracking-widest text-[#4B5C73] hover:text-[#1E2737]"
                    >
                      View
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await toggleStatus(p.id, p.status);
                      }}
                    >
                      <button
                        type="submit"
                        className="text-[11px] uppercase tracking-widest text-[#1969B5] hover:text-[#1E2737]"
                      >
                        {p.status === "active" ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await deleteProduct(p.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="text-[11px] uppercase tracking-widest text-red-400 hover:text-red-600"
                        onClick={undefined}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
