import {
  getStaff,
} from "@/services/staff";

import {
  StaffTable,
} from "./StaffTable";

import {
  AddStaffModal,
} from "./AddStaffModal";

interface Props {
  params: Promise<{
    eventId: string;
  }>;
}

export default async function StaffPage({
  params,
}: Props) {
  const { eventId } =
    await params;

  try {
    const result =
      await getStaff(
        eventId
      );

    if (
      !result.success
    ) {
      throw new Error(
        result.message ??
          "Unable to load staff."
      );
    }

    return (
      <main className="space-y-8 p-8">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold">
              Staff
            </h1>

            <p className="text-gray-500">
              Manage event staff,
              permissions and
              operations.
            </p>

          </div>

          <AddStaffModal
            eventId={eventId}
          />

        </div>

        {result.staff.length === 0 ? (

          <div className="rounded-xl border border-dashed p-12 text-center">

            <h2 className="text-xl font-semibold">
              No Staff Yet
            </h2>

            <p className="mt-2 text-gray-500">
              Add your first staff member
              to begin managing check-ins,
              security and event operations.
            </p>

          </div>

        ) : (

          <StaffTable
            eventId={eventId}
            staff={result.staff}
          />

        )}

      </main>
    );

  } catch (error) {

    console.error(
      "Staff page error:",
      error
    );

    return (
      <main className="p-8">

        <h1 className="mb-4 text-3xl font-bold">
          Staff
        </h1>

        <div className="rounded-lg border border-red-200 bg-red-50 p-6">

          <h2 className="font-semibold text-red-700">
            Failed to load staff
          </h2>

          <p className="mt-2 text-sm text-red-600">
            Please refresh the page
            and try again.
          </p>

        </div>

      </main>
    );

  }
}