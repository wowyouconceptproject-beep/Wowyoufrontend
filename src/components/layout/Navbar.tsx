"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50">

      <div className="mx-auto max-w-7xl px-6 py-6">

        <div className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-2xl">

          {/* Logo */}

          <Link
            href="/"
            className="text-2xl font-black tracking-[0.25em]"
          >
            WOWYOU
          </Link>

          {/* Navigation */}

          <nav className="hidden items-center gap-10 text-sm font-medium text-muted lg:flex">

            <Link
              href="/discover"
              className="transition hover:text-white"
            >
              Discover
            </Link>

            <Link
              href="/events"
              className="transition hover:text-white"
            >
              Events
            </Link>

            <Link
              href="/vendors"
              className="transition hover:text-white"
            >
              Vendors
            </Link>

            <Link
              href="/organizers"
              className="transition hover:text-white"
            >
              Organizers
            </Link>

          </nav>

          {/* Actions */}

          <div className="flex items-center gap-4">

            <Link
              href="/download"
              className="hidden rounded-full border border-divider px-5 py-3 text-sm transition hover:bg-surface-hover md:block"
            >
              Download App
            </Link>

            <Link
              href="/login"
              className="rounded-full bg-gold px-6 py-3 font-semibold text-black transition duration-300 hover:scale-105"
            >
              Sign In
            </Link>

          </div>

        </div>

      </div>

    </header>
  );
}