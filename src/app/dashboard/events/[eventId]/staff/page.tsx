"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import {
  getStaff,
} from "@/services/staff";

import {
  StaffTable,
} from "./StaffTable";

import {
  AddStaffModal,
} from "./AddStaffModal";

export default function StaffPage() {
  const params =
    useParams<{
      eventId: string;
    }>();

  const eventId =
    params.eventId;

  const [
    staff,
    setStaff,
  ] = useState<any[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  async function loadStaff() {
    try {
      setLoading(true);

      const result =
        await getStaff(
          eventId
        );

      if (
        result.success
      ) {
        setStaff(
          result.staff ?? []
        );

        setError("");
      }
    } catch (err: any) {
      console.error(
        "Staff page error:",
        err
      );

      setError(
        err.message ??
          "Unable to load staff."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (eventId) {
      loadStaff();
    }
  }, [eventId]);

  if (loading) {
    return (
      <main className="p-8">
        Loading staff...
      </main>
    );
  }

  if (error) {
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
            {error}
          </p>

        </div>

      </main>
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

      {staff.length === 0 ? (

        <div className="rounded-xl border border-dashed p-12 text-center">

          <h2 className="text-xl font-semibold">
            No Staff Yet
          </h2>

          <p className="mt-2 text-gray-500">
            Add your first staff
            member to begin managing
            check-ins, security and
            event operations.
          </p>

        </div>

      ) : (

        <StaffTable
          eventId={eventId}
          staff={staff}
        />

      )}

    </main>
  );
}