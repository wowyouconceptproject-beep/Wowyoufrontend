"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  Menu,
  Search,
  X,
} from "lucide-react";

import HeroCarousel from "@/components/discovery/HeroCarousel";
import FeaturedEvent from "@/components/discovery/FeaturedEvent";
import EventRail from "@/components/discovery/EventRail";
import CategoryStrip from "@/components/discovery/CategoryStrip";

import {
  getDiscovery,
  DiscoveryResponse,
} from "@/services/discovery";

export default function HomePage() {
  const [data, setData] =
    useState<DiscoveryResponse>();

  const [loading, setLoading] =
    useState(true);

  const [menuOpen, setMenuOpen] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Discovery
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    async function load() {
      try {
        const result =
          await getDiscovery();

        setData(result);
      } catch (error) {
        console.error(
          "Discovery error:",
          error,
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <div className="h-20 border-b border-white/[0.06]" />

        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">

          <div
            className="
              h-[65vh]
              animate-pulse
              rounded-[32px]
              bg-white/[0.03]
            "
          />

        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (!data) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#050505]
          px-6
          text-white
        "
      >
        <div className="text-center">

          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-[#D4AF37]
            "
          >
            WOWYOU
          </p>

          <h1
            className="
              mt-4
              text-3xl
              font-black
              tracking-tight
            "
          >
            Unable to load discovery
          </h1>

          <p
            className="
              mt-3
              text-sm
              text-white/35
            "
          >
            Please refresh the page
            and try again.
          </p>

        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <main
      className="
        min-h-screen
        bg-[#050505]
        text-white
      "
    >
      {/* Navigation */}

      <header
        className="
          sticky
          top-0
          z-50
          border-b
          border-white/[0.06]
          bg-[#050505]/90
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            h-[76px]
            max-w-7xl
            items-center
            justify-between
            px-5
            md:px-8
          "
        >
          {/* Brand */}

          <Link
            href="/"
            className="
              flex
              shrink-0
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-[#D4AF37]
                text-sm
                font-black
                text-black
              "
            >
              W
            </div>

            <span
              className="
                text-lg
                font-black
                tracking-tight
              "
            >
              WOWYOU
            </span>
          </Link>

          {/* Desktop Navigation */}

          <nav
            className="
              hidden
              items-center
              gap-8
              lg:flex
            "
          >
            <Link
              href="/"
              className="
                text-sm
                font-semibold
                text-white
              "
            >
              Discover
            </Link>

            <Link
              href="/events"
              className="
                text-sm
                font-medium
                text-white/45
                transition
                hover:text-white
              "
            >
              Events
            </Link>

            <Link
              href="/vendor/portal"
              className="
                text-sm
                font-medium
                text-white/45
                transition
                hover:text-white
              "
            >
              Vendors
            </Link>
          </nav>

          {/* Desktop Actions */}

          <div
            className="
              hidden
              items-center
              gap-3
              lg:flex
            "
          >
            <Link
              href="/events"
              aria-label="Search events"
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.08]
                text-white/50
                transition
                hover:border-white/[0.15]
                hover:bg-white/[0.04]
                hover:text-white
              "
            >
              <Search className="h-4 w-4" />
            </Link>

            <Link
              href="/login"
              className="
                inline-flex
                h-11
                items-center
                justify-center
                rounded-xl
                px-5
                text-sm
                font-bold
                text-white/65
                transition
                hover:bg-white/[0.04]
                hover:text-white
              "
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="
                inline-flex
                h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#D4AF37]
                px-5
                text-sm
                font-black
                text-black
                transition
                hover:bg-[#E0BE4A]
              "
            >
              Organize Your Event

              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Menu */}

          <button
            type="button"
            aria-label={
              menuOpen
                ? "Close navigation"
                : "Open navigation"
            }
            onClick={() =>
              setMenuOpen(
                (current) =>
                  !current,
              )
            }
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.08]
              text-white
              lg:hidden
            "
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}

        {menuOpen && (
          <div
            className="
              border-t
              border-white/[0.06]
              bg-[#080808]
              px-5
              py-5
              lg:hidden
            "
          >
            <nav
              className="
                mx-auto
                max-w-7xl
                space-y-1
              "
            >
              <MobileLink
                href="/"
                label="Discover"
                onClick={() =>
                  setMenuOpen(false)
                }
              />

              <MobileLink
                href="/events"
                label="Events"
                onClick={() =>
                  setMenuOpen(false)
                }
              />

              <MobileLink
                href="/vendor/portal"
                label="Vendors"
                onClick={() =>
                  setMenuOpen(false)
                }
              />

              <div
                className="
                  my-4
                  h-px
                  bg-white/[0.06]
                "
              />

              <MobileLink
                href="/login"
                label="Sign In"
                onClick={() =>
                  setMenuOpen(false)
                }
              />

              <Link
                href="/register"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="
                  mt-4
                  flex
                  h-12
                  items-center
                  justify-between
                  rounded-xl
                  bg-[#D4AF37]
                  px-5
                  text-sm
                  font-black
                  text-black
                "
              >
                Organize Your Event

                <ArrowRight className="h-4 w-4" />
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Discovery Content */}

      <div className="space-y-28 pb-32 md:space-y-32">

        <HeroCarousel
          events={data.hero}
        />

        {data.featured && (
          <FeaturedEvent
            event={
              data.featured
            }
          />
        )}

        <EventRail
          title="Now Showing"
          subtitle="Experiences people are discovering this week."
          events={
            data.trending
          }
        />

        <CategoryStrip
          categories={
            data.categories
          }
        />

        <EventRail
          title="Coming Soon"
          subtitle="Plan your next experience."
          events={
            data.upcoming
          }
        />

        {/* Organizer CTA */}

        <section
          className="
            mx-auto
            max-w-7xl
            px-5
            md:px-8
          "
        >
          <div
            className="
              relative
              overflow-hidden
              rounded-[32px]
              border
              border-[#D4AF37]/15
              bg-[#0D0D0D]
              px-6
              py-14
              md:px-12
              md:py-16
              lg:px-16
            "
          >
            {/* Background Detail */}

            <div
              className="
                pointer-events-none
                absolute
                -right-24
                -top-32
                h-96
                w-96
                rounded-full
                bg-[#D4AF37]/[0.05]
                blur-3xl
              "
            />

            <div
              className="
                relative
                flex
                flex-col
                gap-10
                lg:flex-row
                lg:items-end
                lg:justify-between
              "
            >
              <div className="max-w-2xl">

                <div className="flex items-center gap-3">

                  <span className="h-px w-8 bg-[#D4AF37]" />

                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.22em]
                      text-[#D4AF37]
                    "
                  >
                    For Organizers
                  </p>

                </div>

                <h2
                  className="
                    mt-6
                    text-3xl
                    font-black
                    tracking-tight
                    md:text-5xl
                  "
                >
                  Your event deserves
                  more than a ticketing
                  page.
                </h2>

                <p
                  className="
                    mt-5
                    max-w-xl
                    text-sm
                    leading-7
                    text-white/40
                    md:text-base
                  "
                >
                  Create your event,
                  manage ticketing,
                  coordinate staff,
                  communicate with
                  attendees and run
                  operations from one
                  platform.
                </p>

              </div>

              <div
                className="
                  flex
                  shrink-0
                  flex-col
                  gap-3
                  sm:flex-row
                "
              >
                <Link
                  href="/login"
                  className="
                    inline-flex
                    h-12
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/[0.1]
                    bg-white/[0.025]
                    px-6
                    text-sm
                    font-bold
                    transition
                    hover:bg-white/[0.06]
                  "
                >
                  Organizer Sign In
                </Link>

                <Link
                  href="/register"
                  className="
                    inline-flex
                    h-12
                    items-center
                    justify-center
                    gap-3
                    rounded-xl
                    bg-[#D4AF37]
                    px-6
                    text-sm
                    font-black
                    text-black
                    transition
                    hover:bg-[#E0BE4A]
                  "
                >
                  Organize Your Event

                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

            </div>
          </div>
        </section>

      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Mobile Link
|--------------------------------------------------------------------------
*/

function MobileLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="
        flex
        h-12
        items-center
        justify-between
        rounded-xl
        px-4
        text-sm
        font-semibold
        text-white/60
        transition
        hover:bg-white/[0.04]
        hover:text-white
      "
    >
      {label}

      <ArrowRight
        className="
          h-3.5
          w-3.5
          text-white/20
        "
      />
    </Link>
  );
}