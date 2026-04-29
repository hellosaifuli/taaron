"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uniqueSlug(name: string, excludeId?: string): Promise<string> {
  const db = createAdminClient();
  const base = slugify(name);
  let slug = base;
  let n = 2;
  while (true) {
    let q = db.from("products").select("id").eq("slug", slug);
    if (excludeId) q = q.neq("id", excludeId);
    const { data } = await q;
    if (!data?.length) return slug;
    slug = `${base}-${n++}`;
  }
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@taaron.bd";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) redirect("/auth");
}

export async function createProduct(formData: FormData) {
  await assertAdmin();
  const db = createAdminClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const compare_at_price = formData.get("compare_at_price")
    ? parseFloat(formData.get("compare_at_price") as string)
    : null;
  const cost = formData.get("cost")
    ? parseFloat(formData.get("cost") as string)
    : null;
  const sku = (formData.get("sku") as string) || null;
  const image_url = (formData.get("image_url") as string) || null;
  const thumbnail_url = (formData.get("thumbnail_url") as string) || null;
  const status = (formData.get("status") as string) || "active";
  const extra_images = (formData.get("extra_images") as string) || "";
  const category = (formData.get("category") as string) || null;
  const slug = await uniqueSlug(name);

  const { data: product, error } = await db
    .from("products")
    .insert({
      name,
      description,
      price,
      compare_at_price,
      cost,
      sku,
      image_url,
      thumbnail_url,
      status,
      category,
      slug,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  const imageUrls = extra_images
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);
  if (imageUrls.length > 0 && product) {
    await db.from("product_images").insert(
      imageUrls.map((url, i) => ({
        product_id: product.id,
        url,
        position: i,
      })),
    );
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/category/[slug]", "page");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  await assertAdmin();
  const db = createAdminClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const compare_at_price = formData.get("compare_at_price")
    ? parseFloat(formData.get("compare_at_price") as string)
    : null;
  const cost = formData.get("cost")
    ? parseFloat(formData.get("cost") as string)
    : null;
  const sku = (formData.get("sku") as string) || null;
  const image_url = (formData.get("image_url") as string) || null;
  const thumbnail_url = (formData.get("thumbnail_url") as string) || null;
  const status = formData.get("status") as string;
  const extra_images = (formData.get("extra_images") as string) || "";
  const category = (formData.get("category") as string) || null;
  const slug = await uniqueSlug(name, id);

  const { error } = await db
    .from("products")
    .update({
      name,
      description,
      price,
      compare_at_price,
      cost,
      sku,
      image_url,
      thumbnail_url,
      status,
      category,
      slug,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await db.from("product_images").delete().eq("product_id", id);
  const imageUrls = extra_images
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);
  if (imageUrls.length > 0) {
    await db
      .from("product_images")
      .insert(
        imageUrls.map((url, i) => ({ product_id: id, url, position: i })),
      );
  }

  revalidatePath("/admin/products");
  revalidatePath(`/products/${id}`);
  revalidatePath("/");
  revalidatePath("/category/[slug]", "page");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await assertAdmin();
  const db = createAdminClient();
  await db.from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function toggleStatus(id: string, current: string) {
  await assertAdmin();
  const db = createAdminClient();
  const status = current === "active" ? "draft" : "active";
  await db.from("products").update({ status }).eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function createVariant(productId: string, formData: FormData) {
  await assertAdmin();
  const db = createAdminClient();

  const name = (formData.get("name") as string).trim();
  if (!name) return;
  const sku = (formData.get("sku") as string) || null;
  const price_adjustment = formData.get("price_adjustment")
    ? parseFloat(formData.get("price_adjustment") as string)
    : 0;
  const stock_quantity = formData.get("stock_quantity")
    ? parseInt(formData.get("stock_quantity") as string, 10)
    : 0;
  const image_url = (formData.get("image_url") as string) || null;

  const { error } = await db.from("product_variants").insert({
    product_id: productId,
    name,
    sku,
    price_adjustment,
    stock_quantity,
    image_url,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/products/${productId}`);
  revalidatePath("/");
}

export async function updateVariant(
  variantId: string,
  productId: string,
  formData: FormData,
) {
  await assertAdmin();
  const db = createAdminClient();

  const name = (formData.get("name") as string).trim();
  if (!name) return;
  const sku = (formData.get("sku") as string) || null;
  const price_adjustment = formData.get("price_adjustment")
    ? parseFloat(formData.get("price_adjustment") as string)
    : 0;
  const stock_quantity = formData.get("stock_quantity")
    ? parseInt(formData.get("stock_quantity") as string, 10)
    : 0;
  const image_url = (formData.get("image_url") as string) || null;

  const { error } = await db
    .from("product_variants")
    .update({ name, sku, price_adjustment, stock_quantity, image_url })
    .eq("id", variantId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/products/${productId}`);
  revalidatePath("/");
}

export async function deleteVariant(variantId: string, productId: string) {
  await assertAdmin();
  const db = createAdminClient();
  await db.from("product_variants").delete().eq("id", variantId);
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/products/${productId}`);
  revalidatePath("/");
}
