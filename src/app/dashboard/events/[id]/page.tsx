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
  publishEvent,
} from "@/services/event";

export default function EventPage() {
  const params =
    useParams();

  const [event, setEvent] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  async function loadEvent() {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        window.location.href =
          "/login";

        return;
      }

      const result =
        await getEvent(
          token,
          params.id as string
        );

      if (!result.success) {
        alert(
          result.message
        );

        return;
      }

      setEvent(
        result.event
      );
    } catch (error) {
      console.error(
        "Event Load Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish() {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        return;
      }

      const result =
        await publishEvent(
          token,
          event.id
        );

      if (!result.success) {
        alert(
          result.message
        );

        return;
      }

      await loadEvent();
    } catch (error) {
      console.error(
        "Publish Error:",
        error
      );

      alert(
        "Failed to publish event"
      );
    }
  }

  useEffect(() => {
    if (params.id) {
      loadEvent();
    }
  }, [params.id]);

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
        Event not found
      </main>
    );
  }

  return (
    <main className="max-w-5xl p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          {event.title}
        </h1>

        <p className="mt-2 text-gray-500">
          {event.status}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="border rounded p-4">
          <p className="text-sm text-gray-500">
            Venue
          </p>

          <p className="font-semibold mt-2">
            {event.venue}
          </p>
        </div>

        <div className="border rounded p-4">
          <p className="text-sm text-gray-500">
            Capacity
          </p>

          <p className="font-semibold mt-2">
            {event.capacity}
          </p>
        </div>

        <div className="border rounded p-4">
          <p className="text-sm text-gray-500">
            Status
          </p>

          <p className="font-semibold mt-2">
            {event.status}
          </p>
        </div>
      </div>

      <div className="border rounded p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">
          Description
        </h2>

        <p>
          {event.description}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="border rounded p-4">
          <p className="text-sm text-gray-500">
            Start Date
          </p>

          <p className="mt-2">
            {new Date(
              event.startDate
            ).toLocaleString()}
          </p>
        </div>

        <div className="border rounded p-4">
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

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="border rounded p-4">
          <p className="text-sm text-gray-500">
            Attendees
          </p>

          <p className="text-2xl font-bold mt-2">
            0
          </p>
        </div>

        <div className="border rounded p-4">
          <p className="text-sm text-gray-500">
            Tickets Sold
          </p>

          <p className="text-2xl font-bold mt-2">
            0
          </p>
        </div>

        <div className="border rounded p-4">
          <p className="text-sm text-gray-500">
            Revenue
          </p>

          <p className="text-2xl font-bold mt-2">
            ₦0
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        {event.status ===
          "DRAFT" && (
          <button
            onClick={
              handlePublish
            }
            className="bg-black text-white px-6 py-3"
          >
            Publish Event
          </button>
        )}

        <a
  href={`/dashboard/events/${event.id}/tickets`}
  className="border px-6 py-3"
>
  Manage Tickets
</a>

        <button className="border px-6 py-3">
          Edit Event
        </button>
      </div>
    </main>
  );
}