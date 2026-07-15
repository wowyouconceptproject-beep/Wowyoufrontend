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

  /*
  |--------------------------------------------------------------------------
  | Load Activity
  |--------------------------------------------------------------------------
  */

  async function loadActivity() {
    if (!eventId) {
      return;
    }

    try {
      setLoading(true);

      const result =
        await getActivity(
          eventId,
        );

      if (result.success) {
        setActivities(
          result.activity ?? [],
        );

        setError("");
      }
    } catch (err: any) {
      console.error(
        "Activity page error:",
        err,
      );

      setError(
        err.message ??
          "Unable to load activity.",
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

  /*
  |--------------------------------------------------------------------------
  | Realtime
  |--------------------------------------------------------------------------
  */

  useRealtime({
    eventId,

    onActivity: (
      activity,
    ) => {
      setActivities(
        (previous) => {
          const exists =
            previous.some(
              (item) =>
                item.id ===
                activity.id,
            );

          if (exists) {
            return previous;
          }

          return [
            activity,
            ...previous,
          ];
        },
      );
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="p-8">
        Loading activity...
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <main className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">
          Live Activity
        </h1>

        <p className="mt-2 text-gray-500">
          Realtime operational feed for this event.
        </p>
      </div>

      {activities.length ===
      0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
          No activity yet.
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map(
            (activity) => (
              <div
                key={
                  activity.id
                }
                className="rounded-xl border bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {
                        activity.title
                      }
                    </h3>

                    <p className="mt-2 text-sm text-gray-600">
                      {
                        activity.description
                      }
                    </p>
                  </div>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase">
                    {
                      activity.type
                    }
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
                  {activity.station && (
                    <span>
                      📍{" "}
                      {
                        activity.station
                      }
                    </span>
                  )}

                  {activity.actorName && (
                    <span>
                      👤{" "}
                      {
                        activity.actorName
                      }
                      {activity.actorRole &&
                        ` (${activity.actorRole})`}
                    </span>
                  )}

                  {activity.attendeeName && (
                    <span>
                      🎫{" "}
                      {
                        activity.attendeeName
                      }
                    </span>
                  )}

                  {activity.ticketTypeName && (
                    <span>
                      🎟️{" "}
                      {
                        activity.ticketTypeName
                      }
                    </span>
                  )}

                  <span>
                    🕒{" "}
                    {new Date(
                      activity.createdAt,
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </main>
  );
}