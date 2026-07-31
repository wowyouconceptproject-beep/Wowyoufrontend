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
          eventId
        );

      setApplications(
        result.applications ??
          []
      );
    } catch (error) {
      console.error(
        error
      );
    } finally {
      setLoading(false);
    }
  }

  async function approve(
    id: string
  ) {
    try {
      setProcessing(id);

      await approveVendor(
        id
      );

      setApplications(
        (previous) =>
          previous.map(
            (
              application
            ) =>
              application.id ===
              id
                ? {
                    ...application,
                    status:
                      "APPROVED",
                  }
                : application
          )
      );
    } catch (error) {
      console.error(
        error
      );
    } finally {
      setProcessing(
        null
      );
    }
  }

  async function reject(
    id: string
  ) {
    try {
      setProcessing(id);

      await rejectVendor(
        id
      );

      setApplications(
        (previous) =>
          previous.map(
            (
              application
            ) =>
              application.id ===
              id
                ? {
                    ...application,
                    status:
                      "REJECTED",
                  }
                : application
          )
      );
    } catch (error) {
      console.error(
        error
      );
    } finally {
      setProcessing(
        null
      );
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
      application
    ) {
      setApplications(
        (previous) => {
          const exists =
            previous.some(
              (item) =>
                item.id ===
                application.id
            );

          if (exists) {
            return previous;
          }

          return [
            application,
            ...previous,
          ];
        }
      );
    },

    onVendorApplicationUpdated(
      application
    ) {
      setApplications(
        (previous) =>
          previous.map(
            (item) =>
              item.id ===
              application.id
                ? application
                : item
          )
      );
    },
  });

  const pending =
    applications.filter(
      (application) =>
        application.status ===
        "PENDING"
    );

  const approved =
    applications.filter(
      (application) =>
        application.status ===
        "APPROVED"
    );

  const rejected =
    applications.filter(
      (application) =>
        application.status ===
        "REJECTED"
    );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#070707] px-6 py-10 text-white md:px-10">
        <div className="mx-auto max-w-7xl">

          <div className="animate-pulse">
            <div className="h-4 w-36 rounded bg-white/10" />

            <div className="mt-5 h-12 w-80 rounded bg-white/10" />

            <div className="mt-4 h-5 w-96 max-w-full rounded bg-white/5" />

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="h-36 rounded-[24px] border border-white/10 bg-white/[0.03]"
                  />
                )
              )}
            </div>
          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070707] text-white">

      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-14">

        {/* Header */}

        <header className="mb-12">

          <div className="mb-5 flex items-center gap-3">
            <div className="h-px w-10 bg-[#3E86A4]" />

            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#3E86A4]">
              Vendor Operations
            </p>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-3xl">

              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Vendor Applications
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/45">
                Review businesses requesting
                access to your event, approve
                suitable vendors and keep your
                marketplace organized.
              </p>

            </div>

            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5">

              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3E86A4] opacity-40" />

                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#3E86A4]" />
              </span>

              <span className="text-xs font-medium text-white/55">
                Live applications
              </span>

            </div>

          </div>

        </header>

        {/* Summary */}

        <div className="grid gap-5 md:grid-cols-3">

          <SummaryCard
            label="Awaiting Review"
            value={pending.length}
            description="Applications requiring a decision"
            tone="gold"
          />

          <SummaryCard
            label="Approved Vendors"
            value={approved.length}
            description="Businesses accepted for this event"
            tone="green"
          />

          <SummaryCard
            label="Rejected"
            value={rejected.length}
            description="Applications not accepted"
            tone="neutral"
          />

        </div>

        {/* Pending */}

        <ApplicationSection
          eyebrow="Requires Action"
          title="Pending Applications"
          description="Review these businesses and decide who should participate in your event."
          emptyTitle="You're all caught up"
          emptyDescription="There are no vendor applications waiting for review."
          applications={pending}
          processing={processing}
          onApprove={approve}
          onReject={reject}
          priority
        />

        {/* Approved */}

        <ApplicationSection
          eyebrow="Confirmed"
          title="Approved Vendors"
          description="Businesses currently approved to participate in this event."
          emptyTitle="No approved vendors yet"
          emptyDescription="Approved vendor applications will appear here."
          applications={approved}
        />

        {/* Rejected */}

        <ApplicationSection
          eyebrow="Application History"
          title="Rejected Applications"
          description="Applications that were declined for this event."
          emptyTitle="No rejected applications"
          emptyDescription="Rejected applications will remain here for your records."
          applications={rejected}
        />

      </div>

    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Summary Card
|--------------------------------------------------------------------------
*/

function SummaryCard({
  label,
  value,
  description,
  tone,
}: {
  label: string;
  value: number;
  description: string;
  tone:
    | "gold"
    | "green"
    | "neutral";
}) {
  const accent =
    tone === "gold"
      ? "bg-[#3E86A4]"
      : tone === "green"
      ? "bg-emerald-500"
      : "bg-white/25";

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035] p-6">

      <div
        className={`absolute left-0 top-0 h-full w-[3px] ${accent}`}
      />

      <p className="text-sm font-medium text-white/45">
        {label}
      </p>

      <div className="mt-5 flex items-end justify-between">

        <p className="text-5xl font-bold tracking-tight">
          {value}
        </p>

        <div
          className={`mb-2 h-2.5 w-2.5 rounded-full ${accent}`}
        />

      </div>

      <p className="mt-4 text-xs leading-5 text-white/30">
        {description}
      </p>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Application Section
|--------------------------------------------------------------------------
*/

function ApplicationSection({
  eyebrow,
  title,
  description,
  emptyTitle,
  emptyDescription,
  applications,
  processing,
  onApprove,
  onReject,
  priority = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  applications:
    VendorApplication[];
  processing?:
    string | null;
  onApprove?: (
    id: string
  ) => void;
  onReject?: (
    id: string
  ) => void;
  priority?: boolean;
}) {
  return (
    <section className="mt-14">

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#3E86A4]">
            {eyebrow}
          </p>

          <h2 className="mt-2 text-2xl font-semibold md:text-3xl">
            {title}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
            {description}
          </p>

        </div>

        <span className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/50">
          {applications.length}{" "}
          {applications.length === 1
            ? "application"
            : "applications"}
        </span>

      </div>

      {applications.length ===
      0 ? (
        <EmptyState
          title={emptyTitle}
          description={
            emptyDescription
          }
        />
      ) : (
        <div className="space-y-5">

          {applications.map(
            (
              application
            ) => (
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
                priority={
                  priority
                }
              />
            )
          )}

        </div>
      )}

    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Vendor Card
|--------------------------------------------------------------------------
*/

function VendorCard({
  application,
  processing = false,
  onApprove,
  onReject,
  priority,
}: {
  application:
    VendorApplication;
  processing?: boolean;
  onApprove?: (
    id: string
  ) => void;
  onReject?: (
    id: string
  ) => void;
  priority?: boolean;
}) {
  const initials =
    application.businessName
      .split(" ")
      .slice(0, 2)
      .map(
        (word) =>
          word[0]
      )
      .join("")
      .toUpperCase();

  return (
    <article
      className={`overflow-hidden rounded-[26px] border bg-white/[0.035] transition ${
        priority
          ? "border-[#3E86A4]/20 hover:border-[#3E86A4]/40"
          : "border-white/10 hover:border-white/15"
      }`}
    >

      <div className="p-6 md:p-8">

        <div className="flex flex-col gap-8 xl:flex-row xl:justify-between">

          {/* Main */}

          <div className="min-w-0 flex-1">

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-sm font-bold text-[#3E86A4]">
                {initials}
              </div>

              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-3">

                  <h3 className="text-xl font-semibold md:text-2xl">
                    {
                      application.businessName
                    }
                  </h3>

                  <StatusBadge
                    status={
                      application.status
                    }
                  />

                </div>

                <p className="mt-2 text-sm text-white/40">
                  {
                    application.category
                  }
                </p>

              </div>

            </div>

            {/* Contact information */}

            <div className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">

              <Information
                label="Contact"
                value={
                  application.contactName
                }
              />

              <Information
                label="Email"
                value={
                  application.email
                }
              />

              <Information
                label="Phone"
                value={
                  application.phone
                }
              />

              {application.boothSize && (
                <Information
                  label="Booth"
                  value={
                    application.boothSize
                  }
                />
              )}

            </div>

            {/* Business description */}

            <div className="mt-8 border-t border-white/10 pt-7">

              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30">
                About the Business
              </p>

              <p className="mt-3 max-w-4xl text-sm leading-7 text-white/60">
                {
                  application.description
                }
              </p>

            </div>

            {application.message && (
              <div className="mt-6 rounded-2xl border border-white/[0.07] bg-black/20 p-5">

                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30">
                  Message to Organizer
                </p>

                <p className="mt-3 text-sm leading-7 text-white/55">
                  {
                    application.message
                  }
                </p>

              </div>
            )}

            <p className="mt-6 text-xs text-white/25">
              Applied{" "}
              {new Date(
                application.createdAt
              ).toLocaleString()}
            </p>

          </div>

          {/* Actions */}

          {application.status ===
            "PENDING" && (
            <div className="flex shrink-0 flex-col justify-start gap-3 border-t border-white/10 pt-6 xl:w-48 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0">

              <p className="mb-1 text-xs font-medium text-white/35">
                Review application
              </p>

              <button
                disabled={
                  processing
                }
                onClick={() =>
                  onApprove?.(
                    application.id
                  )
                }
                className="rounded-xl bg-[#3E86A4] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#1F7197] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processing
                  ? "Processing..."
                  : "Approve Vendor"}
              </button>

              <button
                disabled={
                  processing
                }
                onClick={() =>
                  onReject?.(
                    application.id
                  )
                }
                className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm font-semibold text-white/60 transition hover:border-red-500/30 hover:bg-red-500/[0.07] hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reject
              </button>

            </div>
          )}

        </div>

      </div>

    </article>
  );
}

/*
|--------------------------------------------------------------------------
| Small Components
|--------------------------------------------------------------------------
*/

function Information({
  label,
  value,
}: {
  label: string;
  value:
    | string
    | null
    | undefined;
}) {
  return (
    <div className="min-w-0">

      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-medium text-white/70">
        {value || "—"}
      </p>

    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles =
    status === "APPROVED"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
      : status ===
        "REJECTED"
      ? "border-red-500/20 bg-red-500/10 text-red-300"
      : "border-[#3E86A4]/20 bg-[#53A6C7]/12 text-[#3E86A4]";

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[10px] font-bold tracking-[0.12em] ${styles}`}
    >
      {status}
    </span>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center">

      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-lg text-[#3E86A4]">
        ✓
      </div>

      <p className="mt-5 font-semibold">
        {title}
      </p>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/35">
        {description}
      </p>

    </div>
  );
}