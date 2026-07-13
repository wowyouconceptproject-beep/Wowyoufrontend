"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  useParams,
} from "next/navigation";

import DashboardStats from "@/components/dashboard/DashboardStats";

import {
  getEvent,
  publishEvent,
} from "@/services/event";

export default function EventPage() {
  const params =
    useParams<{
      eventId: string;
    }>();

  const eventId =
    params.eventId;

  const [event, setEvent] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  async function loadEvent() {
    try {
      const result =
        await getEvent(
          eventId
        );

      if (
        result.success
      ) {
        setEvent(
          result.event
        );
      } else {
        console.error(
          result.message
        );
      }
    } catch (error) {
      console.error(
        "Failed to load event:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish() {
    try {
      const result =
        await publishEvent(
          event.id
        );

      if (
        !result.success
      ) {
        alert(
          result.message ??
            "Unable to publish event."
        );

        return;
      }

      await loadEvent();

    } catch (error: any) {

      alert(
        error.message ??
          "Failed to publish event."
      );

    }
  }

  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  if (loading) {
    return (
      <main className="p-8">
        Loading...
      </main>
    );
  }

  if (!event) {
    return (
      <main className="p-8">

        <h1 className="text-3xl font-bold">
          Event
        </h1>

        <p className="mt-4 text-gray-500">
          Event not found.
        </p>

      </main>
    );
  }

  return (
    <main className="space-y-8 p-8">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            {event.title}
          </h1>

          <p className="mt-2 text-gray-500">
            {event.venue}
          </p>

          <p className="mt-2">
            {event.status}
          </p>

        </div>

        <div className="flex flex-wrap gap-3">

          {event.status ===
            "DRAFT" && (
            <button
              onClick={
                handlePublish
              }
              className="rounded bg-black px-5 py-3 text-white"
            >
              Publish Event
            </button>
          )}

          <button className="rounded border px-5 py-3">
            Edit Event
          </button>

        </div>

      </div>

      <DashboardStats
        ticketsSold={
          event.stats
            ?.ticketSold ?? 0
        }
        checkedIn={
          event.stats
            ?.checkedIn ?? 0
        }
        revenue={
          event.stats
            ?.revenue ?? 0
        }
        currency={
          event.currency
        }
        onlineStaff={
          event.stats
            ?.onlineStaff ?? 0
        }
      />

      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-xl border p-5">

          <p className="text-sm text-gray-500">
            Venue
          </p>

          <p className="mt-2 font-semibold">
            {event.venue}
          </p>

        </div>

        <div className="rounded-xl border p-5">

          <p className="text-sm text-gray-500">
            Capacity
          </p>

          <p className="mt-2 font-semibold">
            {event.capacity}
          </p>

        </div>

        <div className="rounded-xl border p-5">

          <p className="text-sm text-gray-500">
            Status
          </p>

          <p className="mt-2 font-semibold">
            {event.status}
          </p>

        </div>

      </div>

      <div className="rounded-xl border p-6">

        <h2 className="mb-4 text-xl font-bold">
          Description
        </h2>

        <p>
          {event.description}
        </p>

      </div>

      <div className="grid gap-4 md:grid-cols-2">

        <div className="rounded-xl border p-5">

          <p className="text-sm text-gray-500">
            Start Date
          </p>

          <p className="mt-2">
            {new Date(
              event.startDate
            ).toLocaleString()}
          </p>

        </div>

        <div className="rounded-xl border p-5">

          <p className="text-sm text-gray-500">
            End Date
          </p>

          <p className="mt-2">
            {new Date(
              event.endDate
            ).toLocaleString()}
          </p>

        </div>

      </div>

      <div className="grid gap-4 md:grid-cols-5">

        <Link
  href={`/dashboard/events/${event.id}/tickets`}
  className="rounded-xl border p-5 transition hover:bg-gray-50"
>
  Tickets
</Link>

<Link
  href={`/dashboard/events/${event.id}/attendees`}
  className="rounded-xl border p-5 transition hover:bg-gray-50"
>
  Attendees
</Link>

<Link
  href={`/dashboard/events/${event.id}/staff`}
  className="rounded-xl border p-5 transition hover:bg-gray-50"
>
  Staff
</Link>

<Link
  href={`/dashboard/events/${event.id}/revenue`}
  className="rounded-xl border p-5 transition hover:bg-gray-50"
>
  Revenue
</Link>

<Link
  href={`/dashboard/events/${event.id}/activity`}
  className="rounded-xl border p-5 transition hover:bg-gray-50"
>
  Activity
</Link>

<Link
  href={`/dashboard/events/${event.id}/announcements`}
  className="rounded-xl border p-5 transition hover:bg-gray-50"
>
  Announcements
</Link>

<Link
  href={`/dashboard/events/${event.id}/vendors`}
  className="rounded-xl border p-5 transition hover:bg-gray-50"
>
  Vendor Applications
</Link>

      </div>

    </main>
  );
}