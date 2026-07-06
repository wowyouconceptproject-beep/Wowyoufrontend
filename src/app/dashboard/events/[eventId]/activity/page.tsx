"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import {
  getActivity,
  Activity,
} from "@/services/activity";

import {
  useRealtime,
} from "@/hooks/useRealtime";

export default function ActivityPage() {
  const params =
    useParams<{
      eventId: string;
    }>();

  const eventId =
    params.eventId;

  const [
    activities,
    setActivities,
  ] = useState<Activity[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  async function loadActivity() {
    try {
      setLoading(true);

      console.log(
        "Loading activity for:",
        eventId
      );

      const result =
        await getActivity(
          eventId
        );

      console.log(
        "Activity response:",
        result
      );

      if (
        result.success
      ) {
        setActivities(
          result.activities ?? []
        );

        setError("");
      }

    } catch (err: any) {

      console.error(err);

      setError(
        err.message ??
          "Unable to load activity."
      );

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => {
    if (!eventId) {
      return;
    }

    loadActivity();
  }, [eventId]);

  useRealtime({
    eventId,

    onActivity: (
      activity
    ) => {
      setActivities(
        (previous) => {
          const exists =
            previous.some(
              (item) =>
                item.id ===
                activity.id
            );

          if (exists) {
            return previous;
          }

          return [
            activity,
            ...previous,
          ];
        }
      );
    },
  });

  if (loading) {
    return (
      <main className="p-8">
        Loading activity...
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-8">

        <h1 className="mb-6 text-3xl font-bold">
          Activity
        </h1>

        <div className="rounded-lg border border-red-200 bg-red-50 p-6">

          <h2 className="font-semibold text-red-700">
            Failed to load activity
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="space-y-8 p-8">

      <div>

        <h1 className="text-3xl font-bold">
          Activity
        </h1>

        <p className="mt-2 text-gray-500">
          Live event activity feed
        </p>

      </div>

      {activities.length === 0 ? (

        <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
          No activity yet.
        </div>

      ) : (

        <div className="space-y-4">

          {activities.map(
            (
              activity
            ) => (

              <div
                key={
                  activity.id
                }
                className="rounded-xl border p-5"
              >

                <div className="flex items-center justify-between">

                  <h3 className="font-semibold">
                    {activity.title}
                  </h3>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium uppercase">
                    {activity.type}
                  </span>

                </div>

                <p className="mt-3 text-sm text-gray-600">
                  {activity.description}
                </p>

                <p className="mt-4 text-xs text-gray-400">
                  {new Date(
                    activity.timestamp
                  ).toLocaleString()}
                </p>

              </div>

            )
          )}

        </div>

      )}

    </main>
  );
}