import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const headersList = await headers();
  const origin = headersList.get("origin") || headersList.get("referer") || "https://www.taaron.bd";
  const base = new URL(origin).origin;
  return NextResponse.redirect(new URL("/", base), { status: 303 });
}
