"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import {
  getEvent,
} from "@/services/event";

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

        setEvent(
          result.event,
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params.eventId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">

        <section className="relative h-[88vh] overflow-hidden">

          <div className="absolute inset-0 animate-pulse bg-white/[0.04]" />

          <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-20 md:px-10 lg:px-12">

            <div className="w-full max-w-3xl animate-pulse">

              <div className="h-4 w-32 rounded bg-white/10" />

              <div className="mt-7 h-16 w-3/4 rounded bg-white/10" />

              <div className="mt-4 h-16 w-1/2 rounded bg-white/10" />

              <div className="mt-8 h-5 w-full rounded bg-white/[0.06]" />

              <div className="mt-3 h-5 w-2/3 rounded bg-white/[0.06]" />

            </div>

          </div>

        </section>

      </main>
    );
  }

  if (!event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">

        <div className="text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#3E86A4]">
            WOWYOU
          </p>

          <h1 className="mt-5 text-4xl font-bold">
            Event unavailable
          </h1>

          <p className="mt-3 text-white/40">
            This event could not be found.
          </p>

        </div>

      </main>
    );
  }

  const startDate =
    new Date(
      event.startDate,
    );

  const endDate =
    new Date(
      event.endDate,
    );

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* ------------------------------------------------ */}
      {/* HERO */}
      {/* ------------------------------------------------ */}

      <section className="relative min-h-[88vh] overflow-hidden">

        <img
          src={
            event.coverImage ??
            event.featuredImage ??
            "/images/placeholder-event.jpg"
          }
          alt={event.title}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Cinematic overlays */}

        <div className="absolute inset-0 bg-black/25" />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/10" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30" />

        {/* Content */}

        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl items-end px-6 pb-16 pt-32 md:px-10 md:pb-20 lg:px-12 lg:pb-24">

          <div className="max-w-4xl">

            {/* Category */}

            {event.category && (
              <div className="mb-6 flex items-center gap-3">

                <div className="h-px w-10 bg-[#3E86A4]" />

                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#3E86A4]">
                  {event.category}
                </p>

              </div>
            )}

            {/* Title */}

            <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.04em] md:text-7xl lg:text-[88px]">
              {event.title}
            </h1>

            {/* Event quick information */}

            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-white/70">

              <div className="flex items-center gap-2">

                <span className="text-[#3E86A4]">
                  ◷
                </span>

                <span>
                  {startDate.toLocaleDateString(
                    "en-US",
                    {
                      weekday:
                        "short",
                      month:
                        "short",
                      day:
                        "numeric",
                      year:
                        "numeric",
                    },
                  )}
                </span>

              </div>

              <div className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />

              <div className="flex items-center gap-2">

                <span className="text-[#3E86A4]">
                  ◉
                </span>

                <span>
                  {event.venue}
                </span>

              </div>

              {event.organization
                ?.name && (
                <>
                  <div className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />

                  <span>
                    By{" "}
                    <strong className="font-medium text-white">
                      {
                        event
                          .organization
                          .name
                      }
                    </strong>
                  </span>
                </>
              )}

            </div>

            {/* Description */}

            <p className="mt-8 max-w-2xl text-base leading-8 text-white/60 md:text-lg">
              {event.description}
            </p>

            {/* CTA */}

            <div className="mt-10 flex flex-wrap gap-3">

              <button className="rounded-full bg-[#3E86A4] px-8 py-4 text-sm font-bold text-white transition hover:bg-[#1F7197]">
                Get Tickets
              </button>

              {event.vendorApplicationsOpen && (
                <button className="rounded-full border border-white/20 bg-white/[0.06] px-8 py-4 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10">
                  Apply as Vendor
                </button>
              )}

            </div>

          </div>

        </div>

      </section>

      {/* ------------------------------------------------ */}
      {/* EVENT INFORMATION STRIP */}
      {/* ------------------------------------------------ */}

      <section className="border-y border-white/[0.07] bg-white/[0.02]">

        <div className="mx-auto grid max-w-7xl divide-y divide-white/[0.07] px-6 md:grid-cols-3 md:divide-x md:divide-y-0 md:px-10 lg:px-12">

          <QuickDetail
            label="Date"
            value={startDate.toLocaleDateString(
              "en-US",
              {
                month: "long",
                day: "numeric",
                year: "numeric",
              },
            )}
          />

          <QuickDetail
            label="Location"
            value={
              event.venue
            }
          />

          <QuickDetail
            label="Hosted By"
            value={
              event.organization
                ?.name ??
              "WOWYOU Organizer"
            }
          />

        </div>

      </section>

      {/* ------------------------------------------------ */}
      {/* ABOUT */}
      {/* ------------------------------------------------ */}

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28 lg:px-12">

        <div className="grid gap-16 lg:grid-cols-[1fr_380px] lg:gap-24">

          {/* Description */}

          <article>

            <div className="flex items-center gap-3">

              <div className="h-px w-8 bg-[#3E86A4]" />

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3E86A4]">
                The Experience
              </p>

            </div>

            <h2 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
              About this Event
            </h2>

            <p className="mt-8 whitespace-pre-line text-base leading-8 text-white/55 md:text-lg md:leading-9">
              {event.description}
            </p>

          </article>

          {/* Event Card */}

          <aside>

            <div className="sticky top-8 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035]">

              {event.featuredImage && (
                <div className="aspect-[16/9] overflow-hidden">

                  <img
                    src={
                      event.featuredImage
                    }
                    alt=""
                    className="h-full w-full object-cover"
                  />

                </div>
              )}

              <div className="p-7">

                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3E86A4]">
                  Event Details
                </p>

                <div className="mt-7 space-y-7">

                  <Detail
                    label="Starts"
                    value={startDate.toLocaleString(
                      "en-US",
                      {
                        weekday:
                          "long",
                        month:
                          "long",
                        day:
                          "numeric",
                        year:
                          "numeric",
                        hour:
                          "numeric",
                        minute:
                          "2-digit",
                      },
                    )}
                  />

                  <Detail
                    label="Ends"
                    value={endDate.toLocaleString(
                      "en-US",
                      {
                        weekday:
                          "long",
                        month:
                          "long",
                        day:
                          "numeric",
                        year:
                          "numeric",
                        hour:
                          "numeric",
                        minute:
                          "2-digit",
                      },
                    )}
                  />

                  <Detail
                    label="Venue"
                    value={
                      event.venue
                    }
                  />

                  {event.capacity && (
                    <Detail
                      label="Capacity"
                      value={`${Number(
                        event.capacity,
                      ).toLocaleString(
                        "en-US",
                      )} guests`}
                    />
                  )}

                  <Detail
                    label="Organizer"
                    value={
                      event.organization
                        ?.name ??
                      "Event Organizer"
                    }
                  />

                </div>

                <div className="mt-8 border-t border-white/10 pt-7">

                  <button className="w-full rounded-full bg-[#3E86A4] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#1F7197]">
                    Get Tickets
                  </button>

                  {event.vendorApplicationsOpen && (
                    <button className="mt-3 w-full rounded-full border border-white/15 px-6 py-4 text-sm font-semibold text-white/80 transition hover:bg-white/[0.05]">
                      Apply as Vendor
                    </button>
                  )}

                </div>

              </div>

            </div>

          </aside>

        </div>

      </section>

      {/* ------------------------------------------------ */}
      {/* VENDOR OPPORTUNITY */}
      {/* ------------------------------------------------ */}

      {event.vendorApplicationsOpen && (
        <section className="border-t border-white/[0.07]">

          <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">

            <div className="relative overflow-hidden rounded-[32px] border border-[#3E86A4]/15 bg-[#3E86A4]/[0.04] px-7 py-12 md:px-12 md:py-14">

              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#3E86A4]/[0.06] blur-3xl" />

              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                <div className="max-w-2xl">

                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3E86A4]">
                    Vendor Marketplace
                  </p>

                  <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                    Want to showcase your
                    business here?
                  </h2>

                  <p className="mt-4 max-w-xl leading-7 text-white/45">
                    Vendor applications
                    are currently open for
                    this event. Submit your
                    business for consideration
                    by the organizer.
                  </p>

                  {event
                    .vendorApplicationDeadline && (
                    <p className="mt-5 text-sm text-white/35">
                      Applications close{" "}
                      {new Date(
                        event.vendorApplicationDeadline,
                      ).toLocaleDateString(
                        "en-US",
                        {
                          month:
                            "long",
                          day:
                            "numeric",
                          year:
                            "numeric",
                        },
                      )}
                    </p>
                  )}

                </div>

                <button className="shrink-0 rounded-full border border-[#3E86A4]/30 bg-[#3E86A4] px-8 py-4 text-sm font-bold text-white transition hover:bg-[#1F7197]">
                  Apply as Vendor
                </button>

              </div>

            </div>

          </div>

        </section>
      )}

      {/* ------------------------------------------------ */}
      {/* FINAL CTA */}
      {/* ------------------------------------------------ */}

      <section className="border-t border-white/[0.07]">

        <div className="mx-auto max-w-7xl px-6 py-24 text-center md:px-10 lg:px-12">

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#3E86A4]">
            Be There
          </p>

          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Ready for the experience?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/40">
            Secure your place and get
            everything you need for the
            event through WOWYOU.
          </p>

          <button className="mt-9 rounded-full bg-[#3E86A4] px-9 py-4 text-sm font-bold text-white transition hover:bg-[#1F7197]">
            Get Tickets
          </button>

        </div>

      </section>

    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Quick Detail
|--------------------------------------------------------------------------
*/

function QuickDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="py-7 md:px-8 md:py-8 first:md:pl-0">

      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-white/75">
        {value}
      </p>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Detail
|--------------------------------------------------------------------------
*/

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
        {label}
      </p>

      <p className="mt-2 text-sm leading-6 text-white/75">
        {value}
      </p>

    </div>
  );
}