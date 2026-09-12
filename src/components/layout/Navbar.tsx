"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div
          className="
            flex
            items-center
            justify-between
            rounded-full
            border
            border-divider
            bg-white/[0.05]
            px-8
            py-4
            backdrop-blur-2xl
          "
        >
          {/* Logo */}

          <Link
            href="/"
            className="
              text-2xl
              font-black
              tracking-[0.25em]
              text-foreground
              transition
              hover:text-primary
            "
          >
            WOWYOU
          </Link>

          {/* Navigation */}

          <nav
            className="
              hidden
              items-center
              gap-10
              text-sm
              font-medium
              text-muted
              lg:flex
            "
          >
            <Link
              href="/discover"
              className="transition hover:text-primary"
            >
              Discover
            </Link>

            <Link
              href="/events"
              className="transition hover:text-primary"
            >
              Events
            </Link>

            <Link
              href="/vendors"
              className="transition hover:text-primary"
            >
              Vendors
            </Link>

            <Link
              href="/organizers"
              className="transition hover:text-primary"
            >
              Organizers
            </Link>
          </nav>

          {/* Actions */}

          <div className="flex items-center gap-4">
            <Link
              href="/download"
              className="
                hidden
                rounded-full
                border
                border-divider
                px-5
                py-3
                text-sm
                text-foreground
                transition
                hover:border-divider-strong
                hover:bg-surface-hover
                md:block
              "
            >
              Download App
            </Link>

            <Link
              href="/login"
              className="
                rounded-full
                bg-primary
                px-6
                py-3
                font-semibold
                text-background
                transition
                duration-300
                hover:bg-primary-light
                hover:scale-105
              "
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}