"use client";

import Link from "next/link";

export default function OrderConfirmationError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7F4EF] px-6 text-center">
      <p className="text-[10px] uppercase tracking-[0.4em] text-[#9B6F47]">
        Something went wrong
      </p>
      <h1
        className="mt-3 text-2xl font-medium text-[#111111]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Could not load order
      </h1>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#5C5652]">
        We had trouble loading your order details. Your order was placed
        successfully — please check your email for confirmation.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={reset}
          className="bg-[#111111] px-8 py-3 text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-[#9B6F47]"
        >
          Try Again
        </button>
        <Link
          href="/dashboard"
          className="border border-[#E5DFD6] px-8 py-3 text-[11px] uppercase tracking-widest text-[#5C5652] transition-colors hover:border-[#111111] hover:text-[#111111]"
        >
          My Orders
        </Link>
      </div>
    </div>
  );
}
