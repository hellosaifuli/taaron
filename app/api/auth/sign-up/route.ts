import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password, full_name } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Create user profile — non-fatal if it fails; auth still works
  if (data.user) {
    await supabase.from("user_profiles").upsert(
      { id: data.user.id, email: data.user.email, full_name: full_name || "" },
      { onConflict: "id" },
    );
  }

  return NextResponse.json(data, { status: 201 });
}
