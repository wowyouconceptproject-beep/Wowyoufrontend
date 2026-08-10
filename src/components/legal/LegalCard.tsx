import Link from "next/link";

interface LegalCardProps {
  title: string;
  description: string;
  href: string;
}

export function LegalCard({
  title,
  description,
  href,
}: LegalCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20 hover:bg-white/[0.06]"
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-lg font-semibold text-white">
            {title}
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/45">
            {description}
          </p>
        </div>

        <span className="text-lg text-white/30 transition group-hover:translate-x-1 group-hover:text-white">
          →
        </span>
      </div>
    </Link>
  );
}