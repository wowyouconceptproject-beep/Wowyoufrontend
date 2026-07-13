"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { getDiscovery } from "@/services/discovery";
import { getMyApplications } from "@/services/vendor";

import { Event } from "@/services/event";
import { VendorApplication } from "@/services/vendor";
import { useRealtime } from "@/hooks/useRealtime";

export default function VendorPortalPage() {
  const [events, setEvents] = useState<Event[]>([]);

  const [applications, setApplications] =
    useState<VendorApplication[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const [discovery, mine] =
        await Promise.all([
          getDiscovery(),
          getMyApplications(),
        ]);

          useRealtime({
    onVendorApplicationCreated: (
      application: VendorApplication,
    ) => {
      setApplications((previous) => {
        const exists =
          previous.some(
            (item) =>
              item.id ===
              application.id,
          );

        if (exists) {
          return previous;
        }

        return [
          application,
          ...previous,
        ];
      });
    },

    onVendorApplicationUpdated: (
      application: VendorApplication,
    ) => {
      setApplications((previous) =>
        previous.map((item) =>
          item.id ===
          application.id
            ? application
            : item,
        ),
      );
    },
  });

      setEvents(
        discovery.trending ?? [],
      );

      setApplications(
        mine.applications ?? [],
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background" />
    );
  }

  const pending =
    applications.filter(
      (a) => a.status === "PENDING",
    ).length;

  const approved =
    applications.filter(
      (a) => a.status === "APPROVED",
    ).length;

  const rejected =
    applications.filter(
      (a) => a.status === "REJECTED",
    ).length;

    

  return (
    <main className="min-h-screen bg-background">

      <section className="mx-auto max-w-7xl px-8 py-14">

        <div>

          <p className="text-sm uppercase tracking-[0.4em] text-gold">

            Vendor Portal

          </p>

          <h1 className="mt-3 text-5xl font-black">

            Welcome Back

          </h1>

          <p className="mt-4 max-w-2xl text-muted">

            Manage your applications and
            discover events currently accepting
            vendors.

          </p>

        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">

          <div className="rounded-[28px] bg-surface p-8">

            <p className="text-muted">

              Pending

            </p>

            <h2 className="mt-3 text-5xl font-black">

              {pending}

            </h2>

          </div>

          <div className="rounded-[28px] bg-surface p-8">

            <p className="text-muted">

              Approved

            </p>

            <h2 className="mt-3 text-5xl font-black text-green-400">

              {approved}

            </h2>

          </div>

          <div className="rounded-[28px] bg-surface p-8">

            <p className="text-muted">

              Rejected

            </p>

            <h2 className="mt-3 text-5xl font-black text-red-400">

              {rejected}

            </h2>

          </div>

        </div>

        <div className="mt-20 flex items-center justify-between">

          <div>

            <h2 className="text-3xl font-bold">

              Events Accepting Vendors

            </h2>

            <p className="mt-2 text-muted">

              Discover new opportunities.

            </p>

          </div>

          <Link
            href="/vendor/portal/applications"
            className="rounded-full border border-divider px-6 py-3 transition hover:bg-surface-hover"
          >
            View Applications
          </Link>

        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {events.map((event) => (

            <div
              key={event.id}
              className="overflow-hidden rounded-[28px] bg-surface"
            >

              <img
                src={
                  event.coverImage ??
                  event.bannerUrl ??
                  "/images/placeholder-event.jpg"
                }
                alt={event.title}
                className="h-64 w-full object-cover"
              />

              <div className="space-y-5 p-6">

                <div>

                  <h3 className="text-2xl font-bold">

                    {event.title}

                  </h3>

                  <p className="mt-2 text-muted">

                    {event.venue}

                  </p>

                </div>

                <p className="text-sm text-muted">

                  {new Date(
                    event.startDate,
                  ).toLocaleDateString()}
                </p>

                <Link
                  href={`/vendor/apply/${event.id}`}
                  className="inline-flex rounded-full bg-gold px-6 py-3 font-semibold text-black transition hover:scale-105"
                >
                  Apply as Vendor
                </Link>

              </div>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}