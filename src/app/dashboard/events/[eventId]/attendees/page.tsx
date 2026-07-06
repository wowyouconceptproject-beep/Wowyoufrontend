"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import {
  getAttendees,
} from "@/services/attendees";

import {
  AttendeesTable,
} from "./AttendeesTable";

export default function AttendeesPage() {
  const params =
    useParams<{
      eventId: string;
    }>();

  const eventId =
    params.eventId;

  const [
    attendees,
    setAttendees,
  ] = useState<any[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  async function loadAttendees() {
    try {
      setLoading(true);

      const result =
        await getAttendees(
          eventId
        );

      if (
        result.success
      ) {
        setAttendees(
          result.attendees ?? []
        );

        setError("");
      }
    } catch (err: any) {
      console.error(
        "Attendees page error:",
        err
      );

      setError(
        err.message ??
          "Unable to load attendees."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (eventId) {
      loadAttendees();
    }
  }, [eventId]);

  if (loading) {
    return (
      <main className="p-8">
        Loading attendees...
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-8">

        <h1 className="mb-6 text-3xl font-bold">
          Attendees
        </h1>

        <div className="rounded-lg border border-red-200 bg-red-50 p-6">

          <h2 className="font-semibold text-red-700">
            Failed to load attendees
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="space-y-6 p-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Attendees
          </h1>

          <p className="text-sm text-gray-500">
            {attendees.length} attendee
            {attendees.length !== 1
              ? "s"
              : ""}
          </p>

        </div>

      </div>

      {attendees.length === 0 ? (

        <div className="rounded-lg border border-dashed p-12 text-center">

          <h2 className="text-xl font-semibold">
            No Attendees Yet
          </h2>

          <p className="mt-2 text-gray-500">
            Attendees will appear here
            once tickets are purchased.
          </p>

        </div>

      ) : (

        <AttendeesTable
          attendees={attendees}
        />

      )}

    </main>
  );
}