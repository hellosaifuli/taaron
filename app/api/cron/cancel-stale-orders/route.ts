import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Called every hour by Vercel Cron. Cancels pending COD orders older than 2 hours.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("status", "pending")
    .eq("payment_method", "cod")
    .lt("created_at", twoHoursAgo)
    .select("id, order_number");

  if (error) {
    console.error("Cron cancel-stale-orders error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(`Cancelled ${data?.length ?? 0} stale COD orders`);
  return NextResponse.json({ cancelled: data?.length ?? 0 });
}
