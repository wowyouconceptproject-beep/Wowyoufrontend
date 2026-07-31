"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({
  items,
}: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, index) => {
        const last = index === items.length - 1;

        return (
          <div
            key={item.href ?? `${item.label}-${index}`}
            className="flex items-center gap-2"
          >
            {item.href && !last ? (
              <Link
                href={item.href}
                className="text-white/40 transition hover:text-[#53A6C7]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="font-medium text-white"
                aria-current={last ? "page" : undefined}
              >
                {item.label}
              </span>
            )}

            {!last && (
              <ChevronRight className="h-4 w-4 text-white/20" />
            )}
          </div>
        );
      })}
    </nav>
  );
}