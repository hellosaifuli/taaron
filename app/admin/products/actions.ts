"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@taaron.bd";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) redirect("/auth");
  return supabase;
}

export async function createProduct(formData: FormData) {
  const supabase = await assertAdmin();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const cost = formData.get("cost")
    ? parseFloat(formData.get("cost") as string)
    : null;
  const sku = (formData.get("sku") as string) || null;
  const image_url = (formData.get("image_url") as string) || null;
  const thumbnail_url = (formData.get("thumbnail_url") as string) || null;
  const status = (formData.get("status") as string) || "active";
  const extra_images = (formData.get("extra_images") as string) || "";

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name,
      description,
      price,
      cost,
      sku,
      image_url,
      thumbnail_url,
      status,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Insert extra images
  const imageUrls = extra_images
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);
  if (imageUrls.length > 0 && product) {
    await supabase.from("product_images").insert(
      imageUrls.map((url, i) => ({
        product_id: product.id,
        url,
        position: i,
      })),
    );
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await assertAdmin();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const cost = formData.get("cost")
    ? parseFloat(formData.get("cost") as string)
    : null;
  const sku = (formData.get("sku") as string) || null;
  const image_url = (formData.get("image_url") as string) || null;
  const thumbnail_url = (formData.get("thumbnail_url") as string) || null;
  const status = formData.get("status") as string;
  const extra_images = (formData.get("extra_images") as string) || "";

  const { error } = await supabase
    .from("products")
    .update({
      name,
      description,
      price,
      cost,
      sku,
      image_url,
      thumbnail_url,
      status,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  // Replace extra images
  await supabase.from("product_images").delete().eq("product_id", id);
  const imageUrls = extra_images
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);
  if (imageUrls.length > 0) {
    await supabase
      .from("product_images")
      .insert(
        imageUrls.map((url, i) => ({ product_id: id, url, position: i })),
      );
  }

  revalidatePath("/admin/products");
  revalidatePath(`/products/${id}`);
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const supabase = await assertAdmin();
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function toggleStatus(id: string, current: string) {
  const supabase = await assertAdmin();
  const status = current === "active" ? "draft" : "active";
  await supabase.from("products").update({ status }).eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/");
}
