"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Supabase sends the token in the URL hash as access_token
  // The @supabase/ssr client picks it up automatically on the client side
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-[#E5DFD6] bg-white px-4 py-3 text-sm text-[#111111] outline-none transition-colors placeholder:text-[#C4BDB5] focus:border-[#111111]";
  const labelClass =
    "mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-[#9E9690]";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7F4EF] px-4 pt-8 lg:pt-20">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: "#9B6F47" }}>
            Taaron
          </p>
          <h1
            className="mt-3 text-[#111111]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              lineHeight: "1.1",
              letterSpacing: "-0.01em",
              fontWeight: 400,
            }}
          >
            Set New Password
          </h1>
          <p className="mt-2 text-xs text-[#5C5652]">
            Choose a strong password for your account.
          </p>
        </div>

        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success ? (
          <div className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Password updated. Redirecting to your account…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="At least 6 characters"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className={labelClass}>
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={inputClass}
                placeholder="Repeat your password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-[#111111] py-3.5 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#9B6F47] disabled:opacity-50"
            >
              {loading ? "Updating…" : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
