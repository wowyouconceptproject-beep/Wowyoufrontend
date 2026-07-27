"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  CalendarDays,
  Search,
  UserRound,
} from "lucide-react";

import HeroCarousel from "@/components/discovery/HeroCarousel";
import FeaturedEvent from "@/components/discovery/FeaturedEvent";
import EventRail from "@/components/discovery/EventRail";
import CategoryStrip from "@/components/discovery/CategoryStrip";

import {
  getDiscovery,
  DiscoveryResponse,
} from "@/services/discovery";

export default function DiscoverPage() {
  const router =
    useRouter();

  const [data, setData] =
    useState<DiscoveryResponse>();

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

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
  | Search
  |--------------------------------------------------------------------------
  */

  function handleSearch(
    event: FormEvent,
  ) {
    event.preventDefault();

    const query =
      search.trim();

    if (!query) {
      return;
    }

    router.push(
      `/search?q=${encodeURIComponent(
        query,
      )}`,
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="min-h-screen bg-background">

        <div
          className="
            mx-auto
            max-w-7xl
            px-6
            py-8
            md:px-10
          "
        >

          <div className="animate-pulse">

            <div
              className="
                h-12
                rounded-2xl
                bg-surface
              "
            />

            <div
              className="
                mt-10
                h-[70vh]
                rounded-[32px]
                bg-surface
              "
            />

          </div>

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
          bg-background
          px-6
        "
      >

        <div className="text-center">

          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.35em]
              text-gold
            "
          >
            WowYou
          </p>

          <h1
            className="
              mt-4
              text-3xl
              font-black
            "
          >
            Discovery unavailable
          </h1>

          <p
            className="
              mt-3
              text-muted
            "
          >
            We couldn&apos;t load
            experiences right now.
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="
              mt-8
              rounded-full
              bg-gold
              px-6
              py-3
              text-sm
              font-bold
              text-black
            "
          >
            Try Again
          </button>

        </div>

      </main>
    );
  }

  return (
    <main
      className="
        min-h-screen
        bg-background
        pb-32
      "
    >

      {/* Navigation */}

      <header
        className="
          sticky
          top-0
          z-50
          border-b
          border-divider
          bg-background/85
          backdrop-blur-xl
        "
      >

        <div
          className="
            mx-auto
            flex
            h-20
            max-w-7xl
            items-center
            gap-6
            px-6
            md:px-10
          "
        >

          {/* Brand */}

          <Link
            href="/"
            className="
              shrink-0
              text-lg
              font-black
              tracking-[0.18em]
            "
          >
            WOWYOU
          </Link>

          {/* Desktop Search */}

          <form
            onSubmit={
              handleSearch
            }
            className="
              hidden
              flex-1
              md:block
            "
          >

            <div
              className="
                mx-auto
                flex
                max-w-2xl
                items-center
                rounded-full
                border
                border-divider
                bg-surface
                px-5
                transition
                focus-within:border-gold/60
                focus-within:bg-surface-hover
              "
            >

              <Search
                className="
                  h-4
                  w-4
                  shrink-0
                  text-muted
                "
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search events, experiences or places"
                aria-label="Search events"
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  px-4
                  py-3
                  text-sm
                  outline-none
                  placeholder:text-muted
                "
              />

            </div>

          </form>

          {/* Actions */}

          <nav
            className="
              ml-auto
              flex
              items-center
              gap-3
            "
          >

            <Link
              href="/register"
              className="
                hidden
                items-center
                gap-2
                rounded-full
                border
                border-divider
                px-5
                py-2.5
                text-sm
                font-semibold
                transition
                hover:border-gold/40
                hover:bg-surface
                lg:flex
              "
            >
              <CalendarDays
                className="
                  h-4
                  w-4
                "
              />

              Organize
            </Link>

            <Link
              href="/login"
              aria-label="Login"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-divider
                transition
                hover:border-gold/40
                hover:bg-surface
              "
            >
              <UserRound
                className="
                  h-4
                  w-4
                "
              />
            </Link>

          </nav>

        </div>

        {/* Mobile Search */}

        <div
          className="
            mx-auto
            max-w-7xl
            px-6
            pb-4
            md:hidden
          "
        >

          <form
            onSubmit={
              handleSearch
            }
          >

            <div
              className="
                flex
                items-center
                rounded-full
                border
                border-divider
                bg-surface
                px-5
                transition
                focus-within:border-gold/60
              "
            >

              <Search
                className="
                  h-4
                  w-4
                  text-muted
                "
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search events or places"
                aria-label="Search events"
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  px-4
                  py-3
                  text-sm
                  outline-none
                  placeholder:text-muted
                "
              />

            </div>

          </form>

        </div>

      </header>

      {/* Discovery Introduction */}

      <section
        className="
          mx-auto
          max-w-7xl
          px-6
          pb-8
          pt-12
          md:px-10
          md:pt-16
        "
      >

        <p
          className="
            text-xs
            font-bold
            uppercase
            tracking-[0.35em]
            text-gold
          "
        >
          Discover
        </p>

        <div
          className="
            mt-4
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >

          <h1
            className="
              max-w-3xl
              text-4xl
              font-black
              tracking-tight
              md:text-6xl
            "
          >
            Find your next
            experience.
          </h1>

          <p
            className="
              max-w-md
              text-sm
              leading-7
              text-muted
              md:text-base
            "
          >
            Events, communities and
            experiences worth showing
            up for.
          </p>

        </div>

      </section>

      {/* Algorithmic Hero */}

      {data.hero?.length >
        0 && (
        <section
          className="
            mx-auto
            mt-4
            max-w-[1600px]
            px-4
            sm:px-6
            lg:px-8
          "
        >
          <HeroCarousel
            events={
              data.hero
            }
          />
        </section>
      )}

      {/* Featured */}

      {data.featured && (
        <section
          className="
            mx-auto
            mt-28
            max-w-7xl
            px-6
            md:px-10
          "
        >
          <FeaturedEvent
            event={
              data.featured
            }
          />
        </section>
      )}

      {/* Trending */}

      {data.trending?.length >
        0 && (
        <section
          className="
            mx-auto
            mt-28
            max-w-7xl
            px-6
            md:px-10
          "
        >
          <EventRail
            title="Now Showing"
            subtitle="Experiences people are discovering right now."
            events={
              data.trending
            }
          />
        </section>
      )}

      {/* Categories */}

      {data.categories?.length >
        0 && (
        <section
          className="
            mx-auto
            mt-28
            max-w-7xl
            px-6
            md:px-10
          "
        >
          <CategoryStrip
            categories={
              data.categories
            }
          />
        </section>
      )}

      {/* Upcoming */}

      {data.upcoming?.length >
        0 && (
        <section
          className="
            mx-auto
            mt-28
            max-w-7xl
            px-6
            md:px-10
          "
        >
          <EventRail
            title="Coming Soon"
            subtitle="Experiences worth planning ahead for."
            events={
              data.upcoming
            }
          />
        </section>
      )}

      {/* Organizer CTA */}

      <section
        className="
          mx-auto
          mt-32
          max-w-7xl
          px-6
          md:px-10
        "
      >

        <div
          className="
            relative
            overflow-hidden
            rounded-[36px]
            border
            border-divider
            bg-surface
            px-7
            py-14
            md:px-12
            md:py-16
          "
        >

          {/* Glow */}

          <div
            className="
              pointer-events-none
              absolute
              right-[-100px]
              top-[-150px]
              h-[400px]
              w-[400px]
              rounded-full
              bg-gold/[0.07]
              blur-[100px]
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

            <div
              className="
                max-w-2xl
              "
            >

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.35em]
                  text-gold
                "
              >
                Create Experiences
              </p>

              <h2
                className="
                  mt-5
                  text-4xl
                  font-black
                  tracking-tight
                  md:text-5xl
                "
              >
                Have something
                worth showing up
                for?
              </h2>

              <p
                className="
                  mt-5
                  max-w-xl
                  leading-7
                  text-muted
                "
              >
                Create your event,
                sell tickets, manage
                vendors and run the
                entire experience
                with WOWYOU.
              </p>

            </div>

            <Link
              href="/register"
              className="
                inline-flex
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-gold
                px-7
                py-4
                font-bold
                text-black
                transition
                hover:scale-[1.02]
              "
            >
              Organize Your Event
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}