"use client";

import Link from "next/link";

export interface DiscoveryEvent {
  id: string;

  title: string;

  description?: string;

  venue: string;

  coverImage: string | null;

  category: string | null;

  startDate: string;

  endDate?: string;

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

export default function EventCard({
  event,
  action = "EXPLORE",
}: EventCardProps) {
  const buttonLabel = {
    EXPLORE: "Explore",
    BUY: "Get Ticket",
    APPLY: "Apply as Vendor",
    MANAGE: "Manage Event",
  }[action];

  return (
    <article className="group w-[360px] overflow-hidden rounded-[28px] bg-surface transition-all duration-500 hover:-translate-y-2 hover:bg-surface-elevated">

      {/* Image */}

      <div className="relative h-[460px] overflow-hidden">

        <img
          src={
            event.coverImage ??
            "/images/placeholder-event.jpg"
          }
          alt={event.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />

        {/* Overlay */}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

        {/* Category */}

        {event.category && (
          <div className="absolute left-5 top-5 rounded-full bg-black/60 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] backdrop-blur-xl">

            {event.category}

          </div>
        )}

        {/* Date */}

        <div className="absolute bottom-5 left-5 rounded-xl bg-black/60 px-4 py-3 backdrop-blur-xl">

          <p className="text-xs text-muted">
            EVENT DATE
          </p>

          <p className="font-semibold">
            {new Date(
              event.startDate,
            ).toLocaleDateString()}
          </p>

        </div>

      </div>

      {/* Content */}

      <div className="space-y-5 p-6">

        <div>

          <h3 className="line-clamp-2 text-2xl font-bold">

            {event.title}

          </h3>

          <p className="mt-2 text-muted">

            {event.venue}

          </p>

        </div>

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs uppercase tracking-[0.2em] text-muted">

              Trending Score

            </p>

            <p className="text-lg font-bold text-gold">

              {Math.round(
                event.homepageScore ??
                  0,
              )}

            </p>

          </div>

          <Link
            href={`/events/${event.id}`}
            className="rounded-full bg-gold px-6 py-3 font-semibold text-black transition-all duration-300 hover:scale-105"
          >

            {buttonLabel}

          </Link>

        </div>

      </div>

    </article>
  );
}