"use client";

import Link from "next/link";

import {
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  MapPin,
  Store,
} from "lucide-react";

import {
  DiscoveryEvent,
} from "./EventCard";

interface Props {
  event: DiscoveryEvent;

  saved?: boolean;

  onSave?: (
    eventId: string,
  ) => void;
}

/*
|--------------------------------------------------------------------------
| Date Formatting
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
      year: "numeric",
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
| Featured Event
|--------------------------------------------------------------------------
*/

export default function FeaturedEvent({
  event,
  saved = false,
  onSave,
}: Props) {
  return (
    <section
      className="
        group
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-divider
        bg-surface
        lg:rounded-[36px]
      "
    >

      <div
        className="
          grid
          lg:grid-cols-[1.05fr_0.95fr]
        "
      >

        {/* Image */}

        <Link
          href={`/events/${event.id}`}
          className="
            relative
            block
            min-h-[420px]
            overflow-hidden
            sm:min-h-[520px]
            lg:min-h-[680px]
          "
        >

          <img
            src={
              event.coverImage ??
              "/images/placeholder-event.jpg"
            }
            alt={event.title}
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              transition-transform
              duration-1000
              group-hover:scale-[1.03]
            "
          />

          {/* Image overlays */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/70
              via-transparent
              to-black/10
              lg:bg-gradient-to-r
              lg:from-transparent
              lg:via-transparent
              lg:to-black/30
            "
          />

          {/* Category */}

          {event.category && (
            <div
              className="
                absolute
                left-6
                top-6
                rounded-full
                border
                border-white/15
                bg-black/40
                px-4
                py-2
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-white
                backdrop-blur-xl
              "
            >
              {event.category}
            </div>
          )}

          {/* Vendor Badge */}

          {event.acceptingVendors && (
            <div
              className="
                absolute
                bottom-6
                left-6
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-gold
                px-4
                py-2.5
                text-xs
                font-bold
                text-white
              "
            >
              <Store
                className="
                  h-4
                  w-4
                "
              />

              Vendor Applications Open
            </div>
          )}

        </Link>

        {/* Content */}

        <div
          className="
            flex
            flex-col
            justify-center
            px-7
            py-12
            sm:px-10
            sm:py-14
            lg:px-14
            lg:py-16
            xl:px-16
          "
        >

          {/* Label */}

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
              Featured Experience
            </p>
          </div>

          {/* Title */}

          <Link
            href={`/events/${event.id}`}
          >
            <h2
              className="
                mt-7
                text-4xl
                font-black
                leading-[1.05]
                tracking-tight
                transition-colors
                hover:text-gold
                sm:text-5xl
                xl:text-6xl
              "
            >
              {event.title}
            </h2>
          </Link>

          {/* Description */}

          <p
            className="
              mt-6
              line-clamp-4
              max-w-xl
              text-base
              leading-8
              text-muted
              sm:text-lg
            "
          >
            {event.description ??
              "Discover one of the experiences currently standing out on WowYou."}
          </p>

          {/* Details */}

          <div
            className="
              mt-9
              grid
              gap-6
              border-y
              border-divider
              py-7
              sm:grid-cols-2
            "
          >

            {/* Date */}

            <div
              className="
                flex
                items-start
                gap-4
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-gold/10
                "
              >
                <CalendarDays
                  className="
                    h-4
                    w-4
                    text-gold
                  "
                />
              </div>

              <div>
                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-muted
                  "
                >
                  Date & Time
                </p>

                <p
                  className="
                    mt-1.5
                    text-sm
                    font-semibold
                    leading-6
                    sm:text-base
                  "
                >
                  {formatDate(
                    event.startDate,
                  )}
                </p>

                <p
                  className="
                    mt-0.5
                    text-sm
                    text-muted
                  "
                >
                  {formatTime(
                    event.startDate,
                  )}
                </p>
              </div>
            </div>

            {/* Venue */}

            <div
              className="
                flex
                items-start
                gap-4
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-gold/10
                "
              >
                <MapPin
                  className="
                    h-4
                    w-4
                    text-gold
                  "
                />
              </div>

              <div>
                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-muted
                  "
                >
                  Venue
                </p>

                <p
                  className="
                    mt-1.5
                    text-sm
                    font-semibold
                    leading-6
                    sm:text-base
                  "
                >
                  {event.venue}
                </p>
              </div>
            </div>

          </div>

          {/* Actions */}

          <div
            className="
              mt-9
              flex
              flex-col
              gap-3
              sm:flex-row
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
                text-white
                transition-all
                duration-300
                hover:scale-[1.02]
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

            {onSave && (
              <button
                type="button"
                onClick={() =>
                  onSave(
                    event.id,
                  )
                }
                className={`
                  inline-flex
                  min-h-13
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border
                  px-7
                  py-4
                  text-sm
                  font-semibold
                  transition-all
                  duration-300

                  ${
                    saved
                      ? `
                        border-gold/40
                        bg-gold/10
                        text-gold
                      `
                      : `
                        border-divider
                        bg-transparent
                        text-foreground
                        hover:border-gold/40
                        hover:bg-surface-hover
                      `
                  }
                `}
              >
                <Bookmark
                  className={`
                    h-4
                    w-4

                    ${
                      saved
                        ? "fill-current"
                        : ""
                    }
                  `}
                />

                {saved
                  ? "Saved"
                  : "Save for Later"}
              </button>
            )}

          </div>

          {/* Vendor CTA */}

          {event.acceptingVendors && (
            <div
              className="
                mt-7
                flex
                flex-col
                gap-3
                rounded-2xl
                border
                border-gold/15
                bg-gold/[0.04]
                p-5
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <p
                  className="
                    text-sm
                    font-semibold
                  "
                >
                  Want to sell at this event?
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-muted
                  "
                >
                  The organizer is
                  currently accepting
                  vendor applications.
                </p>
              </div>

              <Link
                href={`/vendor/apply/${event.id}`}
                className="
                  shrink-0
                  text-sm
                  font-bold
                  text-gold
                  transition-opacity
                  hover:opacity-70
                "
              >
                Apply as Vendor
              </Link>
            </div>
          )}

        </div>

      </div>

    </section>
  );
}