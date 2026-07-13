"use client";

import Link from "next/link";

interface HeroEvent {
  id: string;

  title: string;

  venue: string;

  coverImage: string | null;

  category: string | null;

  startDate: string;

  homepageScore: number;
}

interface Props {
  events: HeroEvent[];
}

export default function HeroCarousel({
  events,
}: Props) {
  if (!events.length) {
    return null;
  }

  const event = events[0];

  return (
    <section className="relative h-[92vh] overflow-hidden rounded-[36px]">

      {/* Background Image */}

      <img
        src={
          event.coverImage ??
          "/images/placeholder-event.jpg"
        }
        alt={event.title}
        className="absolute inset-0 h-full w-full object-cover scale-105 transition duration-[8000ms]"
      />

      {/* Cinema Overlay */}

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

      <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-transparent" />

      {/* Content */}

      <div className="relative z-10 flex h-full items-center">

        <div className="max-w-3xl px-20">

          <span className="rounded-full border border-gold/40 bg-gold/10 px-5 py-2 text-sm uppercase tracking-[0.3em] text-gold">

            Featured Experience

          </span>

          <h1 className="mt-8 text-7xl font-black leading-none tracking-tight">

            {event.title}

          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-muted">

            Experience unforgettable moments,
            discover remarkable people,
            and create memories that last.

          </p>

          <div className="mt-10 flex items-center gap-4">

            <span className="rounded-full bg-white/10 px-4 py-2">

              {event.category}
            </span>

            <span className="rounded-full bg-white/10 px-4 py-2">

              {new Date(
                event.startDate
              ).toLocaleDateString()}
            </span>

            <span className="rounded-full bg-white/10 px-4 py-2">

              {event.venue}
            </span>

          </div>

          <div className="mt-12 flex gap-5">

            <Link
              href={`/events/${event.id}`}
              className="rounded-full bg-gold px-8 py-4 font-semibold text-black transition duration-300 hover:scale-105"
            >
              Explore Event
            </Link>

            <button className="rounded-full border border-white/20 bg-white/10 px-8 py-4 backdrop-blur-xl transition hover:bg-white/20">

              ▶ Watch Preview

            </button>

          </div>

        </div>

      </div>

    </section>
  );
}