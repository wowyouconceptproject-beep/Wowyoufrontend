"use client";

import Link from "next/link";

import {
  CalendarDays,
  MapPin,
  ArrowUpRight,
  Store,
  Settings,
  Ticket,
} from "lucide-react";

export interface DiscoveryEvent {
  id: string;

  title: string;

  description?: string | null;

  venue: string;

  coverImage: string | null;

  category: string | null;

  startDate: string;

  endDate?: string | null;

  homepageScore?: number;

  views?: number;

  acceptingVendors?: boolean;
}

interface EventCardProps {
  event: DiscoveryEvent;

  action?:
    | "EXPLORE"
    | "BUY"
    | "APPLY"
    | "MANAGE";
}

/*
|--------------------------------------------------------------------------
| Event Action
|--------------------------------------------------------------------------
*/

function getEventAction(
  event: DiscoveryEvent,
  action: EventCardProps["action"],
) {
  switch (action) {
    case "BUY":
      return {
        label: "Get Tickets",
        href: `/events/${event.id}`,
        icon: Ticket,
      };

    case "APPLY":
      return {
        label: "Apply",
        href: `/vendor/apply/${event.id}`,
        icon: Store,
      };

    case "MANAGE":
      return {
        label: "Manage",
        href: `/dashboard/events/${event.id}`,
        icon: Settings,
      };

    default:
      return {
        label: "Explore",
        href: `/events/${event.id}`,
        icon: ArrowUpRight,
      };
  }
}

/*
|--------------------------------------------------------------------------
| Date
|--------------------------------------------------------------------------
*/

function formatEventDate(
  date: string,
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
    },
  ).format(
    new Date(date),
  );
}

function formatEventDay(
  date: string,
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "short",
    },
  ).format(
    new Date(date),
  );
}

function formatEventTime(
  date: string,
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    },
  ).format(
    new Date(date),
  );
}

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

export default function EventCard({
  event,
  action = "EXPLORE",
}: EventCardProps) {
  const eventAction =
    getEventAction(
      event,
      action,
    );

  const ActionIcon =
    eventAction.icon;

  return (
    <article
      className="
        group
        flex
        w-[340px]
        shrink-0
        flex-col
        overflow-hidden
        rounded-[28px]
        border
        border-divider
        bg-surface
        transition-all
        duration-500

        hover:-translate-y-1
        hover:border-[#3E86A4]/30
        hover:bg-surface-elevated

        sm:w-[360px]
      "
    >

      {/* Image */}

      <Link
        href={`/events/${event.id}`}
        className="
          relative
          block
          h-[390px]
          overflow-hidden
          sm:h-[420px]
        "
      >

        <img
          src={
            event.coverImage ??
            "/images/placeholder-event.jpg"
          }
          alt={event.title}
          loading="lazy"
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-[1.04]
          "
        />

        {/* Gradient */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/90
            via-black/10
            to-black/10
          "
        />

        {/* Category */}

        {event.category && (
          <div
            className="
              absolute
              left-5
              top-5
              rounded-full
              border
              border-white/10
              bg-black/50
              px-4
              py-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-white
              backdrop-blur-xl
            "
          >
            {event.category}
          </div>
        )}

        {/* Vendor Opportunity */}

        {event.acceptingVendors && (
          <div
            className="
              absolute
              right-5
              top-5
              flex
              items-center
              gap-2
              rounded-full
              bg-[#3E86A4]
              px-4
              py-2
              text-[10px]
              font-bold
              uppercase
              tracking-[0.15em]
              text-white
            "
          >
            <Store className="h-3.5 w-3.5" />

            Vendors Open
          </div>
        )}

        {/* Date */}

        <div
          className="
            absolute
            bottom-5
            left-5
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              flex
              h-14
              min-w-14
              flex-col
              items-center
              justify-center
              rounded-2xl
              bg-white
              px-3
              text-white
              shadow-xl
            "
          >
            <span
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-wider
              "
            >
              {formatEventDay(
                event.startDate,
              )}
            </span>

            <span
              className="
                text-sm
                font-black
              "
            >
              {formatEventDate(
                event.startDate,
              )}
            </span>
          </div>

        </div>

      </Link>

      {/* Content */}

      <div
        className="
          flex
          flex-1
          flex-col
          p-6
        "
      >

        {/* Title */}

        <Link
          href={`/events/${event.id}`}
          className="block"
        >
          <h3
            className="
              line-clamp-2
              text-2xl
              font-bold
              leading-tight
              tracking-tight
              transition-colors
              group-hover:text-[#3E86A4]
            "
          >
            {event.title}
          </h3>
        </Link>

        {/* Details */}

        <div
          className="
            mt-5
            space-y-3
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              text-sm
              text-muted
            "
          >
            <CalendarDays
              className="
                h-4
                w-4
                shrink-0
                text-[#3E86A4]
              "
            />

            <span>
              {formatEventDate(
                event.startDate,
              )}
              {" · "}
              {formatEventTime(
                event.startDate,
              )}
            </span>
          </div>

          <div
            className="
              flex
              items-center
              gap-3
              text-sm
              text-muted
            "
          >
            <MapPin
              className="
                h-4
                w-4
                shrink-0
                text-[#3E86A4]
              "
            />

            <span className="truncate">
              {event.venue}
            </span>
          </div>

        </div>

        {/* Action */}

        <div
          className="
            mt-6
            flex
            items-center
            justify-between
            border-t
            border-divider
            pt-5
          "
        >

          <Link
            href={`/events/${event.id}`}
            className="
              text-sm
              font-medium
              text-muted
              transition-colors
              hover:text-foreground
            "
          >
            View details
          </Link>

          <Link
            href={eventAction.href}
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#3E86A4]
              px-5
              py-3
              text-sm
              font-bold
              text-white
              transition-all
              duration-300
              hover:scale-[1.03]
            "
          >
            {eventAction.label}

            <ActionIcon
              className="h-4 w-4"
            />
          </Link>

        </div>

      </div>

    </article>
  );
}