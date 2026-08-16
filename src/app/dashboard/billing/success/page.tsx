"use client";

import Link from "next/link";

export default function BillingSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5] px-6">
      <div className="w-full max-w-lg rounded-3xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-2xl text-green-600">
          ✓
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-neutral-950">
          Payment received
        </h1>

        <p className="mt-4 leading-7 text-neutral-600">
          Your organizer subscription is being
          activated. This normally happens
          automatically once Revolut confirms
          the payment.
        </p>

        <div className="mt-8">
          <Link
            href="/dashboard"
            className="inline-flex rounded-xl bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}