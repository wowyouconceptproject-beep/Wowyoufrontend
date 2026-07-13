"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import {
  useRealtime,
} from "@/hooks/useRealtime";

import {
  getVendorApplications,
  approveVendor,
  rejectVendor,
  VendorApplication,
} from "@/services/vendor-admin";

export default function VendorApplicationsPage() {
  const params =
    useParams<{
      eventId: string;
    }>();

  const eventId =
    params.eventId;

  const [
    applications,
    setApplications,
  ] = useState<
    VendorApplication[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    processing,
    setProcessing,
  ] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!eventId) {
      return;
    }

    loadApplications();
  }, [eventId]);

  async function loadApplications() {
    try {
      setLoading(true);

      const result =
        await getVendorApplications(
          eventId,
        );

      setApplications(
        result.applications ??
          [],
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function approve(
    id: string,
  ) {
    try {
      setProcessing(id);

      await approveVendor(
        id,
      );

      setApplications(
        (previous) =>
          previous.map(
            (
              application,
            ) =>
              application.id ===
              id
                ? {
                    ...application,
                    status:
                      "APPROVED",
                  }
                : application,
          ),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing(null);
    }
  }

  async function reject(
    id: string,
  ) {
    try {
      setProcessing(id);

      await rejectVendor(
        id,
      );

      setApplications(
        (previous) =>
          previous.map(
            (
              application,
            ) =>
              application.id ===
              id
                ? {
                    ...application,
                    status:
                      "REJECTED",
                  }
                : application,
          ),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing(null);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Realtime
  |--------------------------------------------------------------------------
  */

  useRealtime({
    eventId,

    onVendorApplicationCreated(
      application,
    ) {
      setApplications(
        (previous) => {
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
        },
      );
    },

    onVendorApplicationUpdated(
      application,
    ) {
      setApplications(
        (previous) =>
          previous.map(
            (item) =>
              item.id ===
              application.id
                ? application
                : item,
          ),
      );
    },
  });

  const pending =
    applications.filter(
      (application) =>
        application.status ===
        "PENDING",
    );

  const approved =
    applications.filter(
      (application) =>
        application.status ===
        "APPROVED",
    );

  const rejected =
    applications.filter(
      (application) =>
        application.status ===
        "REJECTED",
    );

  if (loading) {
    return (
      <main className="p-8">
        Loading vendor applications...
      </main>
    );
  }

  return (
    <main className="space-y-10 p-8">

      <div>

        <h1 className="text-3xl font-bold">
          Vendor Applications
        </h1>

        <p className="mt-2 text-gray-500">
          Review and manage vendor
          requests for this
          event.
        </p>

      </div>

      <Summary
        pending={pending.length}
        approved={
          approved.length
        }
        rejected={
          rejected.length
        }
      />

      <ApplicationSection
        title="Pending"
        empty="No pending applications."
        applications={pending}
        processing={
          processing
        }
        onApprove={
          approve
        }
        onReject={
          reject
        }
      />

      <ApplicationSection
        title="Approved"
        empty="No approved vendors."
        applications={
          approved
        }
      />

      <ApplicationSection
        title="Rejected"
        empty="No rejected applications."
        applications={
          rejected
        }
      />

    </main>
  );
}

interface SummaryProps {
  pending: number;

  approved: number;

  rejected: number;
}

function Summary({
  pending,
  approved,
  rejected,
}: SummaryProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">

      <SummaryCard
        title="Pending"
        value={pending}
      />

      <SummaryCard
        title="Approved"
        value={approved}
      />

      <SummaryCard
        title="Rejected"
        value={rejected}
      />

    </div>
  );
}

interface SummaryCardProps {
  title: string;

  value: number;
}

function SummaryCard({
  title,
  value,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h2 className="mt-3 text-4xl font-bold">
        {value}
      </h2>

    </div>
  );
}

interface SectionProps {
  title: string;

  empty: string;

  applications: VendorApplication[];

  processing?: string | null;

  onApprove?: (
    id: string,
  ) => void;

  onReject?: (
    id: string,
  ) => void;
}

function ApplicationSection({
  title,
  empty,
  applications,
  processing,
  onApprove,
  onReject,
}: SectionProps) {
  return (
    <section className="space-y-5">

      <h2 className="text-2xl font-semibold">
        {title}
      </h2>

      {applications.length === 0 ? (

        <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">

          {empty}

        </div>

      ) : (

        <div className="space-y-5">

          {applications.map(
            (application) => (
              <VendorCard
                key={
                  application.id
                }
                application={
                  application
                }
                processing={
                  processing ===
                  application.id
                }
                onApprove={
                  onApprove
                }
                onReject={
                  onReject
                }
              />
            ),
          )}

        </div>

      )}

    </section>
  );
}

interface VendorCardProps {
  application: VendorApplication;

  processing?: boolean;

  onApprove?: (
    id: string,
  ) => void;

  onReject?: (
    id: string,
  ) => void;
}

function VendorCard({
  application,
  processing = false,
  onApprove,
  onReject,
}: VendorCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">

        <div className="flex-1 space-y-5">

          <div>

            <h3 className="text-2xl font-semibold">
              {application.businessName}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {application.category}
            </p>

          </div>

          <div className="grid gap-4 md:grid-cols-2">

            <div>

              <p className="text-xs uppercase tracking-wide text-gray-400">
                Contact
              </p>

              <p className="mt-1 font-medium">
                {application.contactName}
              </p>

            </div>

            <div>

              <p className="text-xs uppercase tracking-wide text-gray-400">
                Email
              </p>

              <p className="mt-1">
                {application.email}
              </p>

            </div>

            <div>

              <p className="text-xs uppercase tracking-wide text-gray-400">
                Phone
              </p>

              <p className="mt-1">
                {application.phone}
              </p>

            </div>

            {application.boothSize && (
              <div>

                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Booth Size
                </p>

                <p className="mt-1">
                  {application.boothSize}
                </p>

              </div>
            )}

          </div>

          <div>

            <p className="text-xs uppercase tracking-wide text-gray-400">
              Description
            </p>

            <p className="mt-2 leading-7 text-gray-700">
              {application.description}
            </p>

          </div>

          {application.message && (
            <div>

              <p className="text-xs uppercase tracking-wide text-gray-400">
                Message
              </p>

              <p className="mt-2 leading-7 text-gray-700">
                {application.message}
              </p>

            </div>
          )}

          <p className="text-sm text-gray-400">
            Applied{" "}
            {new Date(
              application.createdAt,
            ).toLocaleString()}
          </p>

        </div>

        <div className="flex w-full flex-col gap-4 lg:w-52">

          <span
            className={`rounded-full px-4 py-3 text-center text-sm font-semibold ${
              application.status ===
              "APPROVED"
                ? "bg-green-100 text-green-700"
                : application.status ===
                  "REJECTED"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {application.status}
          </span>

          {application.status ===
            "PENDING" && (
            <>

              <button
                disabled={
                  processing
                }
                onClick={() =>
                  onApprove?.(
                    application.id,
                  )
                }
                className="rounded-xl bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Approve
              </button>

              <button
                disabled={
                  processing
                }
                onClick={() =>
                  onReject?.(
                    application.id,
                  )
                }
                className="rounded-xl bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Reject
              </button>

            </>
          )}

        </div>

      </div>

    </div>
  );
}