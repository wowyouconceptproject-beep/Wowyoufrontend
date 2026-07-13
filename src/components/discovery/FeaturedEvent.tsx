"use client";

import Link from "next/link";

import { DiscoveryEvent } from "./EventCard";

interface Props {
  event: DiscoveryEvent;
}

export default function FeaturedEvent({
  event,
}: Props) {
  return (
    <section className="overflow-hidden rounded-[36px] bg-surface">

      <div className="grid lg:grid-cols-2">

        {/* Image */}

        <div className="relative h-[650px] overflow-hidden">

          <img
            src={
              event.coverImage ??
              "/images/placeholder-event.jpg"
            }
            alt={event.title}
            className="h-full w-full object-cover transition duration-700 hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />

        </div>

        {/* Content */}

        <div className="flex flex-col justify-center px-16 py-20">

          <span className="inline-flex w-fit rounded-full border border-gold/30 bg-gold/10 px-5 py-2 text-xs uppercase tracking-[0.35em] text-gold">

            Featured Experience

          </span>

          <h2 className="mt-8 text-6xl font-black leading-tight">

            {event.title}

          </h2>

          <p className="mt-8 text-lg leading-9 text-muted">

            {event.description ??
              "An unforgettable experience carefully selected by the WowYou discovery engine."}

          </p>

          <div className="mt-10 grid grid-cols-2 gap-8">

            <div>

              <p className="text-xs uppercase tracking-[0.2em] text-muted">

                Venue

              </p>

              <p className="mt-2 text-xl">

                {event.venue}

              </p>

            </div>

            <div>

              <p className="text-xs uppercase tracking-[0.2em] text-muted">

                Category

              </p>

              <p className="mt-2 text-xl">

                {event.category ?? "General"}

              </p>

            </div>

            <div>

              <p className="text-xs uppercase tracking-[0.2em] text-muted">

                Starts

              </p>

              <p className="mt-2 text-xl">

                {new Date(
                  event.startDate,
                ).toLocaleDateString()}
              </p>

            </div>

            <div>

              <p className="text-xs uppercase tracking-[0.2em] text-muted">

                Discovery Score

              </p>

              <p className="mt-2 text-xl text-gold">

                {Math.round(
                  event.homepageScore ??
                    0,
                )}

              </p>

            </div>

          </div>

          <div className="mt-14 flex gap-5">

            <Link
              href={`/events/${event.id}`}
              className="rounded-full bg-gold px-8 py-4 font-semibold text-black transition hover:scale-105"
            >
              Explore Event
            </Link>

            <button className="rounded-full border border-divider px-8 py-4 transition hover:bg-surface-hover">

              Save for Later

            </button>

          </div>

        </div>

      </div>

    </section>
  );
}