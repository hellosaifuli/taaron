import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createProduct } from "../actions";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@taaron.bd";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Add Product — Admin",
  robots: { index: false, follow: false },
};

export default async function NewProductPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) redirect("/auth");

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
              Add Product
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

        <form
          action={createProduct}
          className="mt-8 border border-[#DDE3EB] bg-white p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#7A8EA6]">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                required
                className="mt-2 w-full border border-[#DDE3EB] bg-[#FAFAFA] px-3 py-2.5 text-sm outline-none focus:border-[#1E2737]"
                placeholder="e.g. Slim Bifold Wallet"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#7A8EA6]">
                Price (৳) <span className="text-red-500">*</span>
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                required
                className="mt-2 w-full border border-[#DDE3EB] bg-[#FAFAFA] px-3 py-2.5 text-sm outline-none focus:border-[#1E2737]"
                placeholder="1200"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#7A8EA6]">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                required
                className="mt-2 w-full border border-[#DDE3EB] bg-[#FAFAFA] px-3 py-2.5 text-sm outline-none focus:border-[#1E2737]"
              >
                <option value="">— Select category —</option>
                <option value="bags">Bags &amp; Backpacks</option>
                <option value="wallets">Wallets</option>
                <option value="belts">Belts</option>
                <option value="cardholder">Card Holders</option>
                <option value="ladies">Ladies Bags</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#7A8EA6]">
                Status
              </label>
              <select
                name="status"
                defaultValue="active"
                className="mt-2 w-full border border-[#DDE3EB] bg-[#FAFAFA] px-3 py-2.5 text-sm outline-none focus:border-[#1E2737]"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#7A8EA6]">
                Compare-at Price (৳){" "}
                <span className="normal-case text-[#7A8EA6]">(original / sale)</span>
              </label>
              <input
                name="compare_at_price"
                type="number"
                step="0.01"
                className="mt-2 w-full border border-[#DDE3EB] bg-[#FAFAFA] px-3 py-2.5 text-sm outline-none focus:border-[#1E2737]"
                placeholder="e.g. 1500 (leave blank if no sale)"
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
                className="mt-2 w-full border border-[#DDE3EB] bg-[#FAFAFA] px-3 py-2.5 text-sm outline-none focus:border-[#1E2737]"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#7A8EA6]">
                SKU
              </label>
              <input
                name="sku"
                className="mt-2 w-full border border-[#DDE3EB] bg-[#FAFAFA] px-3 py-2.5 text-sm outline-none focus:border-[#1E2737]"
                placeholder="e.g. TAR-WLT-001"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#7A8EA6]">
                Main Image URL
              </label>
              <input
                name="image_url"
                type="url"
                className="mt-2 w-full border border-[#DDE3EB] bg-[#FAFAFA] px-3 py-2.5 text-sm outline-none focus:border-[#1E2737]"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#7A8EA6]">
                Thumbnail URL
              </label>
              <input
                name="thumbnail_url"
                type="url"
                className="mt-2 w-full border border-[#DDE3EB] bg-[#FAFAFA] px-3 py-2.5 text-sm outline-none focus:border-[#1E2737]"
                placeholder="https://..."
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] uppercase tracking-widest text-[#7A8EA6]">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                className="mt-2 w-full border border-[#DDE3EB] bg-[#FAFAFA] px-3 py-2.5 text-sm outline-none focus:border-[#1E2737]"
                placeholder="Product details, materials, dimensions…"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] uppercase tracking-widest text-[#7A8EA6]">
                Extra Image URLs{" "}
                <span className="normal-case text-[#7A8EA6]">
                  (one per line)
                </span>
              </label>
              <textarea
                name="extra_images"
                rows={4}
                className="mt-2 w-full border border-[#DDE3EB] bg-[#FAFAFA] px-3 py-2.5 text-sm outline-none focus:border-[#1E2737]"
                placeholder={"https://...\nhttps://..."}
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-[#1E2737] px-6 py-3 text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-[#1969B5]"
            >
              Create Product
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
