"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { getEvent } from "@/services/event";

export default function VendorApplyPage() {
  const params = useParams<{
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
    return (
      <main className="min-h-screen bg-background" />
    );
  }

  return (
    <main className="min-h-screen bg-background">

      <section className="mx-auto max-w-7xl px-8 py-20">

        <div className="grid gap-16 lg:grid-cols-2">

          {/* Event */}

          <div>

            <img
              src={
                event.coverImage ??
                "/images/placeholder-event.jpg"
              }
              alt={event.title}
              className="h-[650px] w-full rounded-[32px] object-cover"
            />

            <p className="mt-8 text-sm uppercase tracking-[0.4em] text-gold">

              Vendor Application

            </p>

            <h1 className="mt-4 text-5xl font-black">

              {event.title}

            </h1>

            <p className="mt-6 text-lg text-muted">

              {event.description}

            </p>

            <div className="mt-10 space-y-4">

              <div>

                <span className="text-muted">

                  Venue

                </span>

                <h3 className="text-xl">

                  {event.venue}

                </h3>

              </div>

              <div>

                <span className="text-muted">

                  Event Date

                </span>

                <h3 className="text-xl">

                  {new Date(
                    event.startDate,
                  ).toLocaleDateString()}
                </h3>

              </div>

            </div>

          </div>

          {/* Form */}

          <div className="rounded-[32px] bg-surface p-10">

            <h2 className="text-4xl font-bold">

              Become a Vendor

            </h2>

            <p className="mt-4 text-muted">

              Complete your application to request a
              booth for this event.

            </p>

            <form className="mt-12 space-y-6">

              <input
                placeholder="Business Name"
                className="w-full rounded-2xl border border-divider bg-background p-5 outline-none"
              />

              <input
                placeholder="Business Category"
                className="w-full rounded-2xl border border-divider bg-background p-5 outline-none"
              />

              <input
                placeholder="Contact Name"
                className="w-full rounded-2xl border border-divider bg-background p-5 outline-none"
              />

              <input
                placeholder="Email Address"
                className="w-full rounded-2xl border border-divider bg-background p-5 outline-none"
              />

              <input
                placeholder="Phone Number"
                className="w-full rounded-2xl border border-divider bg-background p-5 outline-none"
              />

              <textarea
                rows={5}
                placeholder="Tell the organizer about your business..."
                className="w-full rounded-2xl border border-divider bg-background p-5 outline-none"
              />

              <input
                placeholder="Preferred Booth Size"
                className="w-full rounded-2xl border border-divider bg-background p-5 outline-none"
              />

              <textarea
                rows={4}
                placeholder="Message (optional)"
                className="w-full rounded-2xl border border-divider bg-background p-5 outline-none"
              />

              <hr className="border-divider" />

              <h3 className="text-2xl font-semibold">

                Create your Vendor Account

              </h3>

              <input
                type="password"
                placeholder="Password"
                className="w-full rounded-2xl border border-divider bg-background p-5 outline-none"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full rounded-2xl border border-divider bg-background p-5 outline-none"
              />

              <button
                className="mt-6 w-full rounded-full bg-gold py-5 text-lg font-semibold text-black transition hover:scale-[1.02]"
              >
                Submit Application
              </button>

            </form>

          </div>

        </div>

      </section>

    </main>
  );
}