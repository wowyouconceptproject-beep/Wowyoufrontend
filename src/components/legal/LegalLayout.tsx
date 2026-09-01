import Link from "next/link";

interface LegalLayoutProps {
  title: string;
  description?: string;
  effectiveDate?: string;
  version?: string;
  children: React.ReactNode;
}

export function LegalLayout({
  title,
  description,
  effectiveDate = "August 2026",
  version = "v1.0",
  children,
}: LegalLayoutProps) {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:px-8 lg:px-10">
        <div className="mb-12">
          <Link
            href="/legal"
            className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
          >
            <span aria-hidden="true">←</span>
            Legal & Policies
          </Link>

          <div className="border-b border-white/10 pb-10">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
              WoWYou EventTech
            </p>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {title}
            </h1>

            {description && (
              <p className="mt-5 max-w-3xl text-base leading-7 text-white/60">
                {description}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/40">
              <span>Version {version}</span>
              <span>Effective {effectiveDate}</span>
            </div>
          </div>
        </div>

        <article className="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-white/70 prose-p:leading-7 prose-li:text-white/70 prose-strong:text-white">
          {children}
        </article>

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