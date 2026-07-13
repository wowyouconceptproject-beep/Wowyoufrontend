"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { getEvent } from "@/services/event";

export default function EventPage() {
  const params =
    useParams<{
      eventId: string;
    }>();

  const [event, setEvent] =
    useState<any>();

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      try {
        const result =
          await getEvent(
            params.eventId,
          );

        setEvent(result.event);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params.eventId]);

  if (loading) {
    return null;
  }

  if (!event) {
    return null;
  }

  return (
    <main>

      {/* Hero */}

      <section className="relative h-[90vh]">

        <img
          src={
            event.coverImage ??
            "/images/placeholder-event.jpg"
          }
          alt={event.title}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        <div className="relative mx-auto flex h-full max-w-7xl items-end px-8 pb-24">

          <div className="max-w-3xl">

            <p className="text-sm uppercase tracking-[0.4em] text-gold">

              {event.category}

            </p>

            <h1 className="mt-6 text-7xl font-black">

              {event.title}

            </h1>

            <p className="mt-8 text-xl leading-9 text-muted">

              {event.description}

            </p>

            <div className="mt-10 flex gap-4">

              <button className="rounded-full bg-gold px-8 py-4 font-semibold text-black">

                Get Tickets

              </button>

              {event.vendorApplicationsOpen && (
                <button className="rounded-full border border-divider px-8 py-4">

                  Apply as Vendor

                </button>
              )}

            </div>

          </div>

        </div>

      </section>

      {/* Details */}

      <section className="mx-auto max-w-7xl px-8 py-24">

        <div className="grid gap-20 lg:grid-cols-3">

          <div className="lg:col-span-2">

            <h2 className="text-4xl font-bold">

              About this Event

            </h2>

            <p className="mt-8 text-lg leading-9 text-muted">

              {event.description}

            </p>

          </div>

          <aside className="rounded-[28px] bg-surface p-8">

            <div className="space-y-8">

              <div>

                <p className="text-xs uppercase tracking-[0.3em] text-muted">

                  Venue

                </p>

                <h3 className="mt-2 text-xl">

                  {event.venue}

                </h3>

              </div>

              <div>

                <p className="text-xs uppercase tracking-[0.3em] text-muted">

                  Starts

                </p>

                <h3 className="mt-2 text-xl">

                  {new Date(
                    event.startDate,
                  ).toLocaleDateString()}
                </h3>

              </div>

              <div>

                <p className="text-xs uppercase tracking-[0.3em] text-muted">

                  Organizer

                </p>

                <h3 className="mt-2 text-xl">

                  {event.organization.name}

                </h3>

              </div>

            </div>

          </aside>

        </div>

      </section>

    </main>
  );
}