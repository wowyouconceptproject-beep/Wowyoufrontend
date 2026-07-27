"use client";

import {
  useRef,
  useState,
} from "react";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Link from "next/link";

import EventCard, {
  DiscoveryEvent,
} from "./EventCard";

interface Props {
  title: string;

  subtitle?: string;

  events: DiscoveryEvent[];

  action?:
    | "EXPLORE"
    | "BUY"
    | "APPLY"
    | "MANAGE";

  viewAllHref?: string;
}

export default function EventRail({
  title,
  subtitle,
  events,
  action = "EXPLORE",
  viewAllHref,
}: Props) {
  const container =
    useRef<HTMLDivElement>(
      null,
    );

  const [
    scrolling,
    setScrolling,
  ] = useState<
    "left" | "right" | null
  >(null);

  /*
  |--------------------------------------------------------------------------
  | Scroll
  |--------------------------------------------------------------------------
  */

  function scroll(
    direction:
      | "left"
      | "right",
  ) {
    const rail =
      container.current;

    if (!rail) {
      return;
    }

    setScrolling(
      direction,
    );

    const amount =
      Math.min(
        rail.clientWidth *
          0.8,
        760,
      );

    rail.scrollBy({
      left:
        direction ===
        "left"
          ? -amount
          : amount,

      behavior: "smooth",
    });

    window.setTimeout(
      () => {
        setScrolling(
          null,
        );
      },
      400,
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Empty
  |--------------------------------------------------------------------------
  */

  if (!events?.length) {
    return null;
  }

  return (
    <section
      className="
        relative
        space-y-8
      "
    >

      {/* Header */}

      <div
        className="
          flex
          items-end
          justify-between
          gap-6
        "
      >

        <div
          className="
            min-w-0
            flex-1
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <span
              className="
                h-px
                w-8
                bg-gold
              "
            />

            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.35em]
                text-gold
              "
            >
              Discover
            </p>
          </div>

          <h2
            className="
              mt-4
              text-3xl
              font-black
              tracking-tight
              sm:text-4xl
              lg:text-5xl
            "
          >
            {title}
          </h2>

          {subtitle && (
            <p
              className="
                mt-3
                max-w-2xl
                text-sm
                leading-6
                text-muted
                sm:text-base
              "
            >
              {subtitle}
            </p>
          )}

        </div>

        {/* Desktop Controls */}

        <div
          className="
            hidden
            shrink-0
            items-center
            gap-3
            sm:flex
          "
        >

          {viewAllHref && (
            <Link
              href={
                viewAllHref
              }
              className="
                mr-2
                inline-flex
                items-center
                gap-2
                rounded-full
                px-4
                py-3
                text-sm
                font-semibold
                text-muted
                transition-colors
                hover:text-foreground
              "
            >
              View all

              <ArrowRight
                className="
                  h-4
                  w-4
                "
              />
            </Link>
          )}

          <button
            type="button"
            aria-label={`Scroll ${title} left`}
            onClick={() =>
              scroll("left")
            }
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-divider
              bg-surface
              text-foreground
              transition-all
              duration-300
              hover:border-gold/40
              hover:bg-surface-hover
              active:scale-95
            "
          >
            <ChevronLeft
              className={`
                h-5
                w-5
                transition-transform

                ${
                  scrolling ===
                  "left"
                    ? "-translate-x-0.5"
                    : ""
                }
              `}
            />
          </button>

          <button
            type="button"
            aria-label={`Scroll ${title} right`}
            onClick={() =>
              scroll("right")
            }
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-divider
              bg-surface
              text-foreground
              transition-all
              duration-300
              hover:border-gold/40
              hover:bg-surface-hover
              active:scale-95
            "
          >
            <ChevronRight
              className={`
                h-5
                w-5
                transition-transform

                ${
                  scrolling ===
                  "right"
                    ? "translate-x-0.5"
                    : ""
                }
              `}
            />
          </button>

        </div>

      </div>

      {/* Rail */}

      <div className="relative">

        <div
          ref={container}
          className="
            no-scrollbar
            flex
            snap-x
            snap-mandatory
            gap-5
            overflow-x-auto
            scroll-smooth
            pb-5
            pr-8
            sm:gap-6
            lg:gap-8
          "
        >

          {events.map(
            (event) => (
              <div
                key={
                  event.id
                }
                className="
                  shrink-0
                  snap-start
                "
              >
                <EventCard
                  event={
                    event
                  }
                  action={
                    action
                  }
                />
              </div>
            ),
          )}

        </div>

        {/* Right Edge Fade */}

        <div
          className="
            pointer-events-none
            absolute
            bottom-5
            right-0
            top-0
            hidden
            w-20
            bg-gradient-to-l
            from-background
            to-transparent
            lg:block
          "
        />

      </div>

      {/* Mobile View All */}

      {viewAllHref && (
        <div
          className="
            sm:hidden
          "
        >
          <Link
            href={
              viewAllHref
            }
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-gold
            "
          >
            View all {title}

            <ArrowRight
              className="
                h-4
                w-4
              "
            />
          </Link>
        </div>
      )}

    </section>
  );
}