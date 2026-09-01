import Link from "next/link";

import { LegalCard } from "@/components/legal";

const legalPages = [
  {
    title: "Terms of Service",
    description:
      "The terms governing your use of WoWYou EventTech and the EventOS platform.",
    href: "/legal/terms",
  },
  {
    title: "Privacy Policy",
    description:
      "How wowyou concepts collects, uses, protects and manages personal data.",
    href: "/legal/privacy",
  },
  {
    title: "Refund & Cancellation",
    description:
      "Rules governing ticket cancellations, refunds, event changes and related payment matters.",
    href: "/legal/refunds",
  },
  {
    title: "Acceptable Use",
    description:
      "The activities, content and behaviours that are permitted or prohibited on EventOS.",
    href: "/legal/acceptable-use",
  },
  {
    title: "AI Usage Policy",
    description:
      "How AI-assisted features are used within EventOS and the responsibilities of users.",
    href: "/legal/ai",
  },
  {
    title: "Marketplace Vendor Terms",
    description:
      "Terms governing vendors, marketplace listings, bookings, payments and services.",
    href: "/legal/marketplace",
  },
  {
    title: "Sub-processors",
    description:
      "Information about third-party service providers that may process personal data for EventOS.",
    href: "/legal/subprocessors",
  },
  {
    title: "Data Processing Agreement",
    description:
      "Enterprise data processing terms for customers using EventOS as a data processing platform.",
    href: "/legal/dpa",
  },
];

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-[#050708] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="max-w-3xl">
          <Link
            href="/"
            className="text-sm text-white/45 transition hover:text-white"
          >
            ← Back to WoWYou
          </Link>

          <p className="mt-12 text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
            WoWYou EventTech
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
            Legal & Policies
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/55">
            The policies and legal documents governing the use of
            WoWYou EventTech and the EventOS platform.
          </p>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2">
          {legalPages.map((page) => (
            <LegalCard
              key={page.href}
              title={page.title}
              description={page.description}
              href={page.href}
            />
          ))}
        </div>

        <div className="mt-16 border-t border-white/10 pt-8">
          <p className="text-sm leading-6 text-white/40">
            wowyou concepts
            <br />
            enquiries@wowyouconcepts.com
          </p>
        </div>
      </div>
    </main>
  );
}