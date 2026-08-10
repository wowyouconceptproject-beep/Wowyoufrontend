import Link from "next/link";

const legalLinks = [
  {
    label: "Terms of Service",
    href: "/legal/terms",
  },
  {
    label: "Privacy Policy",
    href: "/legal/privacy",
  },
  {
    label: "Refund & Cancellation",
    href: "/legal/refunds",
  },
  {
    label: "Acceptable Use",
    href: "/legal/acceptable-use",
  },
  {
    label: "AI Usage Policy",
    href: "/legal/ai",
  },
  {
    label: "Marketplace Vendor Terms",
    href: "/legal/marketplace",
  },
  {
    label: "Sub-processors",
    href: "/legal/subprocessors",
  },
];

export function LegalFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#050505]">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div>
            <div className="text-lg font-bold tracking-wide">
              WOWYOU
            </div>

            <p className="mt-3 max-w-sm text-sm leading-6 text-white/45">
              Event technology for planning, managing and
              delivering modern events.
            </p>

            <a
              href="mailto:enquiries@wowyouconcepts.com"
              className="mt-5 inline-block text-sm text-white/50 transition hover:text-white"
            >
              enquiries@wowyouconcepts.com
            </a>
          </div>

          <div>
            <h2 className="text-sm font-semibold">
              Legal
            </h2>

            <nav
              aria-label="Legal"
              className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3"
            >
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/45 transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} WoWYou Concepts Ltd.
            All rights reserved.
          </span>

          <span>
            WoWYou EventTech / EventOS
          </span>
        </div>
      </div>
    </footer>
  );
}