import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { updateProduct } from "../actions";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@taaron.bd";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Edit Product — Admin",
  robots: { index: false, follow: false },
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) redirect("/auth");

  const [{ data: product }, { data: extraImages }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase
      .from("product_images")
      .select("url, position")
      .eq("product_id", id)
      .order("position"),
  ]);

  if (!product) notFound();

  const updateWithId = updateProduct.bind(null, id);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-20">
      <div className="mx-auto max-w-3xl px-6 py-12 lg:px-12">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#1969B5]">
              Admin
            </p>
            <h1
              className="mt-1 font-serif text-3xl font-medium"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Edit Product
            </h1>
          </div>
          <Link
            href="/admin/products"
            className="text-[11px] uppercase tracking-widest text-[#4B5C73] hover:text-[#1E2737]"
          >
            ← Back
          </Link>
        </div>
        <div className="mt-1 h-px w-16 bg-[#1969B5]" />

        {/* Preview */}
        {product.image_url && (
          <div className="mt-8 flex items-center gap-4 border border-[#DDE3EB] bg-white p-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden bg-[#EEF2F7]">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div>
              <p className="font-medium text-[#1E2737]">{product.name}</p>
              <p className="text-sm text-[#1969B5]">
                ৳{product.price.toLocaleString()}
              </p>
              <p className="text-xs text-[#7A8EA6]">{product.status}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form
          action={updateWithId}
          className="mt-8 border border-[#DDE3EB] bg-white p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#7A8EA6]">
                Name *
              </label>
              <input
                name="name"
                defaultValue={product.name}
                required
                className="mt-2 w-full border border-[#DDE3EB] bg-[#FAFAFA] px-3 py-2.5 text-sm outline-none focus:border-[#1E2737]"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#7A8EA6]">
                Price (৳) *
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                defaultValue={product.price}
                required
                className="mt-2 w-full border border-[#DDE3EB] bg-[#FAFAFA] px-3 py-2.5 text-sm outline-none focus:border-[#1E2737]"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#7A8EA6]">
                Cost (৳)
              </label>
              <input
                name="cost"
                type="number"
                step="0.01"
                defaultValue={product.cost ?? ""}
                className="mt-2 w-full border border-[#DDE3EB] bg-[#FAFAFA] px-3 py-2.5 text-sm outline-none focus:border-[#1E2737]"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#7A8EA6]">
                SKU
              </label>
              <input
                name="sku"
                defaultValue={product.sku ?? ""}
                className="mt-2 w-full border border-[#DDE3EB] bg-[#FAFAFA] px-3 py-2.5 text-sm outline-none focus:border-[#1E2737]"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#7A8EA6]">
                Status
              </label>
              <select
                name="status"
                defaultValue={product.status}
                className="mt-2 w-full border border-[#DDE3EB] bg-[#FAFAFA] px-3 py-2.5 text-sm outline-none focus:border-[#1E2737]"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#7A8EA6]">
                Main Image URL
              </label>
              <input
                name="image_url"
                type="url"
                defaultValue={product.image_url ?? ""}
                className="mt-2 w-full border border-[#DDE3EB] bg-[#FAFAFA] px-3 py-2.5 text-sm outline-none focus:border-[#1E2737]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] uppercase tracking-widest text-[#7A8EA6]">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                defaultValue={product.description ?? ""}
                className="mt-2 w-full border border-[#DDE3EB] bg-[#FAFAFA] px-3 py-2.5 text-sm outline-none focus:border-[#1E2737]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] uppercase tracking-widest text-[#7A8EA6]">
                Extra Image URLs{" "}
                <span className="normal-case text-[#7A8EA6]">
                  (one per line — replaces existing)
                </span>
              </label>
              <textarea
                name="extra_images"
                rows={4}
                defaultValue={(extraImages ?? []).map((i) => i.url).join("\n")}
                className="mt-2 w-full border border-[#DDE3EB] bg-[#FAFAFA] px-3 py-2.5 text-sm outline-none focus:border-[#1E2737]"
              />
            </div>

            {/* Extra image preview */}
            {extraImages && extraImages.length > 0 && (
              <div className="sm:col-span-2">
                <p className="text-[11px] uppercase tracking-widest text-[#7A8EA6]">
                  Current Extra Images
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {extraImages.map((img, i) => (
                    <div
                      key={i}
                      className="relative h-16 w-16 overflow-hidden bg-[#EEF2F7]"
                    >
                      <Image
                        src={img.url}
                        alt={`Extra ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-[#1E2737] px-6 py-3 text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-[#1969B5]"
            >
              Save Changes
            </button>
            <Link
              href="/admin/products"
              className="border border-[#DDE3EB] px-6 py-3 text-[11px] uppercase tracking-widest text-[#4B5C73] hover:border-[#1E2737] hover:text-[#1E2737]"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
