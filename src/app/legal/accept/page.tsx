"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  acceptPolicies,
} from "@/services/legal";

const policies = [
  {
    key: "terms",
    title: "Terms of Service",
    href: "/legal/terms",
    description:
      "The terms governing your use of WoWYou EventTech and EventOS.",
  },
  {
    key: "privacy",
    title: "Privacy Policy",
    href: "/legal/privacy",
    description:
      "How WoWYou Concepts Ltd collects, uses and protects personal data.",
  },
  {
    key: "acceptableUse",
    title: "Acceptable Use Policy",
    href: "/legal/acceptable-use",
    description:
      "The permitted and prohibited uses of the EventOS platform.",
  },
  {
    key: "refunds",
    title: "Refund & Cancellation Policy",
    href: "/legal/refunds",
    description:
      "Rules governing cancellations, refunds and event-related payments.",
  },
  {
    key: "ai",
    title: "AI Usage Policy",
    href: "/legal/ai",
    description:
      "Terms governing AI-assisted features available through EventOS.",
  },
  {
    key: "subprocessors",
    title: "Sub-processor List",
    href: "/legal/subprocessors",
    description:
      "Third-party service providers that may process data on behalf of WoWYou.",
  },
];

export default function LegalAcceptancePage() {
  const router = useRouter();

  const [accepted, setAccepted] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleAccept() {
    if (!accepted || loading) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const fullName =
        localStorage.getItem(
          "userFullName",
        ) ?? "";

      const email =
        localStorage.getItem(
          "userEmail",
        ) ?? "";

      if (!fullName || !email) {
        setError(
          "Your account information could not be found. Please sign in again.",
        );

        return;
      }

      const data =
        await acceptPolicies({
          fullName,
          email,
          role: "ORGANIZER",
          consentSource:
            "ORGANIZER_WEB",
          policiesAccepted: {
            terms: true,
            privacy: true,
            acceptableUse: true,
            refunds: true,
            ai: true,
            subprocessors: true,

            // These are conditional policies.
            // They are not required for every organizer.
            dpa: false,
            marketplace: false,
          },
        });

      if (!data.success) {
        throw new Error(
          data.message ??
            "Unable to record policy acceptance.",
        );
      }

      router.replace(
        "/legal/cookies",
      );
    } catch (err) {
      console.error(
        "Policy acceptance error:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to record policy acceptance.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-4xl px-6 py-12 md:px-10 md:py-20">
        {/* Header */}

        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#53A6C7]">
            WoWYou EventTech
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            Before you continue
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/55">
            Please review and accept the
            platform policies that govern
            your use of WoWYou EventTech
            as an organizer.
          </p>
        </div>

        {/* Policies */}

        <div className="space-y-3">
          {policies.map((policy) => (
            <a
              key={policy.key}
              href={policy.href}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                block
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                p-5
                transition
                hover:border-white/20
                hover:bg-white/[0.05]
              "
            >
              <div className="flex items-center justify-between gap-6">
                <div>
                  <h2 className="font-semibold text-white">
                    {policy.title}
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-white/45">
                    {policy.description}
                  </p>
                </div>

                <span className="shrink-0 text-white/30 transition group-hover:translate-x-1 group-hover:text-white">
                  →
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Acceptance */}

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <label className="flex cursor-pointer gap-4">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(event) =>
                setAccepted(
                  event.target.checked,
                )
              }
              className="
                mt-1
                h-5
                w-5
                shrink-0
                accent-[#3E86A4]
              "
            />

            <span className="text-sm leading-6 text-white/65">
              I confirm that I have read and
              agree to the WoWYou EventTech
              Terms of Service, Privacy Policy,
              Acceptable Use Policy, Refund &
              Cancellation Policy, AI Usage
              Policy and Sub-processor List.
              I confirm that I am authorised to
              accept these terms on behalf of
              the organisation I represent.
            </span>
          </label>
        </div>

        {/* Error */}

        {error && (
          <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm leading-6 text-red-300">
            {error}
          </div>
        )}

        {/* Submit */}

        <button
          type="button"
          onClick={handleAccept}
          disabled={!accepted || loading}
          className="
            mt-6
            flex
            h-14
            w-full
            items-center
            justify-center
            rounded-2xl
            bg-[#3E86A4]
            px-6
            text-sm
            font-bold
            text-white
            transition
            hover:bg-[#1F7197]
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          {loading
            ? "Recording acceptance..."
            : "Agree & Continue"}
        </button>

        {/* Footer note */}

        <p className="mt-5 text-center text-xs leading-5 text-white/30">
          You can review the policies again
          at any time from the legal section
          of the platform.
        </p>
      </div>
    </main>
  );
}