"use client";

import { useRef } from "react";

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
}

export default function EventRail({
  title,
  subtitle,
  events,
  action = "EXPLORE",
}: Props) {
  const container =
    useRef<HTMLDivElement>(null);

  function scrollLeft() {
    container.current?.scrollBy({
      left: -420,
      behavior: "smooth",
    });
  }

  function scrollRight() {
    container.current?.scrollBy({
      left: 420,
      behavior: "smooth",
    });
  }

  return (
    <section className="space-y-8">

      <div className="flex items-end justify-between">

        <div>

          <h2 className="text-4xl font-bold tracking-tight">

            {title}

          </h2>

          {subtitle && (
            <p className="mt-2 max-w-2xl text-muted">

              {subtitle}

            </p>
          )}

        </div>

        <div className="flex gap-3">

          <button
            onClick={scrollLeft}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-divider bg-surface transition hover:bg-surface-hover"
          >
            ←
          </button>

          <button
            onClick={scrollRight}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-divider bg-surface transition hover:bg-surface-hover"
          >
            →
          </button>

        </div>

      </div>

      <div
        ref={container}
        className="flex gap-8 overflow-x-auto scroll-smooth pb-4"
      >

        {events.map((event) => (
          <div
            key={event.id}
            className="shrink-0"
          >
            <EventCard
              event={event}
              action={action}
            />
          </div>
        ))}

      </div>

    </section>
  );
}