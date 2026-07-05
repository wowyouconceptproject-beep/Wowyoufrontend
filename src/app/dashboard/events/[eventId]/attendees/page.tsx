import {
  getAttendees,
} from "@/services/attendees";

import {
  AttendeesTable,
} from "./AttendeesTable";

interface Props {
  params: Promise<{
    eventId: string;
  }>;
}

export default async function AttendeesPage({
  params,
}: Props) {
  const { eventId } =
    await params;

  try {
    const result =
      await getAttendees(
        eventId
      );

    if (
      !result.success
    ) {
      throw new Error(
        "Unable to load attendees."
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
              {result.attendees.length} attendee
              {result.attendees.length !== 1
                ? "s"
                : ""}
            </p>

          </div>

        </div>

        {result.attendees.length === 0 ? (
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
            attendees={
              result.attendees
            }
          />
        )}

      </main>
    );

  } catch (error) {

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
            Please refresh the page or
            try again later.
          </p>

        </div>

      </main>
    );

  }
}