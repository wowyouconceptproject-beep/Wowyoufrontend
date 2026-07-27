"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";

interface HeroEvent {
  id: string;

  title: string;

  description?: string | null;

  venue: string;

  coverImage: string | null;

  category: string | null;

  startDate: string;

  endDate?: string | null;

  homepageScore?: number;
}

interface Props {
  events: HeroEvent[];
}

/*
|--------------------------------------------------------------------------
| Date
|--------------------------------------------------------------------------
*/

function formatDate(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
    },
  ).format(
    new Date(value),
  );
}

function formatTime(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    },
  ).format(
    new Date(value),
  );
}

/*
|--------------------------------------------------------------------------
| Hero Carousel
|--------------------------------------------------------------------------
*/

export default function HeroCarousel({
  events,
}: Props) {
  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const [
    paused,
    setPaused,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Keep Index Valid
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      activeIndex >=
      events.length
    ) {
      setActiveIndex(0);
    }
  }, [
    events.length,
    activeIndex,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Automatic Rotation
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      events.length <= 1 ||
      paused
    ) {
      return;
    }

    const interval =
      window.setInterval(
        () => {
          setActiveIndex(
            (current) =>
              (current + 1) %
              events.length,
          );
        },
        8000,
      );

    return () => {
      window.clearInterval(
        interval,
      );
    };
  }, [
    events.length,
    paused,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Navigation
  |--------------------------------------------------------------------------
  */

  function previous() {
    setActiveIndex(
      (current) =>
        current === 0
          ? events.length - 1
          : current - 1,
    );
  }

  function next() {
    setActiveIndex(
      (current) =>
        (current + 1) %
        events.length,
    );
  }

  if (!events.length) {
    return null;
  }

  const event =
    events[activeIndex];

  return (
    <section
      onMouseEnter={() =>
        setPaused(true)
      }
      onMouseLeave={() =>
        setPaused(false)
      }
      className="
        group
        relative
        min-h-[680px]
        overflow-hidden
        rounded-[28px]
        border
        border-white/5
        bg-black
        sm:min-h-[720px]
        lg:h-[88vh]
        lg:min-h-[760px]
        lg:rounded-[36px]
      "
    >

      {/* Backgrounds */}

      {events.map(
        (
          item,
          index,
        ) => (
          <div
            key={item.id}
            className={`
              absolute
              inset-0
              transition-opacity
              duration-1000

              ${
                index ===
                activeIndex
                  ? "opacity-100"
                  : "pointer-events-none opacity-0"
              }
            `}
          >
            <img
              src={
                item.coverImage ??
                "/images/placeholder-event.jpg"
              }
              alt=""
              aria-hidden="true"
              className={`
                h-full
                w-full
                object-cover
                transition-transform
                duration-[10000ms]
                ease-out

                ${
                  index ===
                  activeIndex
                    ? "scale-[1.04]"
                    : "scale-100"
                }
              `}
            />
          </div>
        ),
      )}

      {/* Cinematic Overlays */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-black
          via-black/75
          to-black/10
        "
      />

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/90
          via-transparent
          to-black/20
        "
      />

      {/* Content */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          h-full
          min-h-[680px]
          max-w-7xl
          items-end
          px-6
          pb-24
          pt-32
          sm:min-h-[720px]
          sm:px-10
          sm:pb-28
          lg:min-h-[760px]
          lg:items-center
          lg:px-14
          lg:pb-20
          lg:pt-20
          xl:px-16
        "
      >

        <div
          key={event.id}
          className="
            max-w-4xl
            animate-in
            fade-in
            slide-in-from-bottom-4
            duration-700
          "
        >

          {/* Eyebrow */}

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
                w-10
                bg-gold
              "
            />

            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.4em]
                text-gold
                sm:text-xs
              "
            >
              Discover What's Happening
            </p>
          </div>

          {/* Category */}

          {event.category && (
            <div
              className="
                mt-7
                inline-flex
                rounded-full
                border
                border-white/15
                bg-white/[0.08]
                px-4
                py-2
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-white/80
                backdrop-blur-xl
              "
            >
              {event.category}
            </div>
          )}

          {/* Title */}

          <h1
            className="
              mt-5
              max-w-4xl
              text-5xl
              font-black
              leading-[0.95]
              tracking-[-0.04em]
              text-white
              sm:text-6xl
              lg:text-7xl
              xl:text-8xl
            "
          >
            {event.title}
          </h1>

          {/* Description */}

          <p
            className="
              mt-7
              line-clamp-3
              max-w-2xl
              text-base
              leading-7
              text-white/60
              sm:text-lg
              sm:leading-8
            "
          >
            {event.description ??
              "Discover the people, places and moments that make this experience worth showing up for."}
          </p>

          {/* Meta */}

          <div
            className="
              mt-8
              flex
              flex-wrap
              gap-x-7
              gap-y-4
            "
          >

            <div
              className="
                flex
                items-center
                gap-2.5
                text-sm
                text-white/70
              "
            >
              <CalendarDays
                className="
                  h-4
                  w-4
                  text-gold
                "
              />

              <span>
                {formatDate(
                  event.startDate,
                )}
                {" · "}
                {formatTime(
                  event.startDate,
                )}
              </span>
            </div>

            <div
              className="
                flex
                min-w-0
                items-center
                gap-2.5
                text-sm
                text-white/70
              "
            >
              <MapPin
                className="
                  h-4
                  w-4
                  shrink-0
                  text-gold
                "
              />

              <span
                className="
                  max-w-[300px]
                  truncate
                "
              >
                {event.venue}
              </span>
            </div>

          </div>

          {/* CTA */}

          <div
            className="
              mt-10
              flex
              flex-wrap
              items-center
              gap-4
            "
          >
            <Link
              href={`/events/${event.id}`}
              className="
                inline-flex
                min-h-13
                items-center
                justify-center
                gap-2
                rounded-full
                bg-gold
                px-7
                py-4
                text-sm
                font-bold
                text-black
                transition-all
                duration-300
                hover:scale-[1.03]
              "
            >
              Explore Event

              <ArrowUpRight
                className="
                  h-4
                  w-4
                "
              />
            </Link>

            {events.length >
              1 && (
              <span
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-white/35
                "
              >
                {String(
                  activeIndex +
                    1,
                ).padStart(
                  2,
                  "0",
                )}
                {" / "}
                {String(
                  events.length,
                ).padStart(
                  2,
                  "0",
                )}
              </span>
            )}

          </div>

        </div>

      </div>

      {/* Desktop Navigation */}

      {events.length > 1 && (
        <div
          className="
            absolute
            bottom-8
            right-8
            z-20
            hidden
            items-center
            gap-3
            sm:flex
            lg:bottom-10
            lg:right-10
          "
        >
          <button
            type="button"
            onClick={previous}
            aria-label="Previous featured event"
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-white/15
              bg-black/20
              text-white
              backdrop-blur-xl
              transition
              hover:border-gold/50
              hover:bg-white/10
            "
          >
            <ChevronLeft
              className="
                h-5
                w-5
              "
            />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next featured event"
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-white/15
              bg-black/20
              text-white
              backdrop-blur-xl
              transition
              hover:border-gold/50
              hover:bg-white/10
            "
          >
            <ChevronRight
              className="
                h-5
                w-5
              "
            />
          </button>
        </div>
      )}

      {/* Slide Indicators */}

      {events.length > 1 && (
        <div
          className="
            absolute
            bottom-7
            left-6
            z-20
            flex
            max-w-[60%]
            items-center
            gap-2
            sm:left-10
            lg:bottom-10
            lg:left-1/2
            lg:-translate-x-1/2
          "
        >
          {events.map(
            (
              item,
              index,
            ) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setActiveIndex(
                    index,
                  )
                }
                aria-label={`Show ${item.title}`}
                className={`
                  h-1
                  rounded-full
                  transition-all
                  duration-500

                  ${
                    index ===
                    activeIndex
                      ? "w-10 bg-gold"
                      : "w-4 bg-white/25 hover:bg-white/50"
                  }
                `}
              />
            ),
          )}
        </div>
      )}

    </section>
  );
}