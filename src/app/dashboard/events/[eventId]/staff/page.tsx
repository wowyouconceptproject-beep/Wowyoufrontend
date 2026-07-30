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
      } else {
        setError(
          result.message ??
            "Unable to load staff."
        );
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

  /*
  |--------------------------------------------------------------------------
  | Staff Metrics
  |--------------------------------------------------------------------------
  */

  const totalStaff =
    staff.length;

  const checkInStaff =
    staff.filter(
      (member) =>
        member.role ===
          "CHECK_IN" ||
        member.role ===
          "CHECKIN"
    ).length;

  const securityStaff =
    staff.filter(
      (member) =>
        member.role ===
        "SECURITY"
    ).length;

  const operationalStaff =
    staff.filter(
      (member) =>
        member.role !==
          "CHECK_IN" &&
        member.role !==
          "CHECKIN" &&
        member.role !==
          "SECURITY"
    ).length;

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#070707] px-6 py-10 text-white md:px-10">

        <div className="mx-auto max-w-7xl animate-pulse">

          <div className="h-4 w-32 rounded bg-white/10" />

          <div className="mt-5 h-12 w-64 rounded bg-white/10" />

          <div className="mt-4 h-5 w-96 max-w-full rounded bg-white/[0.06]" />

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="h-36 rounded-[24px] border border-white/10 bg-white/[0.03]"
                />
              )
            )}

          </div>

          <div className="mt-12 h-80 rounded-[28px] border border-white/10 bg-white/[0.03]" />

        </div>

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
      <main className="min-h-screen bg-[#070707] px-6 py-10 text-white md:px-10 md:py-14">

        <div className="mx-auto max-w-7xl">

          <div className="mb-5 flex items-center gap-3">

            <div className="h-px w-10 bg-[#0F766E]" />

            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
              Event Operations
            </p>

          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Staff
          </h1>

          <div className="mt-10 max-w-2xl rounded-[24px] border border-red-500/20 bg-red-500/[0.06] p-6">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-300">
                !
              </div>

              <div>

                <h2 className="font-semibold text-red-200">
                  Unable to load your team
                </h2>

                <p className="mt-2 text-sm leading-6 text-red-200/60">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={
                    loadStaff
                  }
                  className="mt-5 rounded-xl border border-red-500/20 px-5 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-500/10"
                >
                  Try Again
                </button>

              </div>

            </div>

          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070707] text-white">

      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-14">

        {/* ------------------------------------------------ */}
        {/* Header */}
        {/* ------------------------------------------------ */}

        <header className="mb-12">

          <div className="mb-5 flex items-center gap-3">

            <div className="h-px w-10 bg-[#0F766E]" />

            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
              Event Operations
            </p>

          </div>

          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-3xl">

              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Staff
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/45">
                Build the team responsible
                for running this event.
                Assign operational roles,
                control permissions and
                coordinate access across
                your event.
              </p>

            </div>

            <div className="shrink-0">

              <AddStaffModal
                eventId={
                  eventId
                }
              />

            </div>

          </div>

        </header>

        {/* ------------------------------------------------ */}
        {/* Operational Overview */}
        {/* ------------------------------------------------ */}

        <section>

          <div className="mb-5 flex items-center justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
                Team Overview
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Event Workforce
              </h2>

            </div>

            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/40 sm:flex">

              <span className="h-2 w-2 rounded-full bg-[#0F766E]" />

              {totalStaff}{" "}
              {totalStaff === 1
                ? "member"
                : "members"}

            </div>

          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <MetricCard
              label="Total Staff"
              value={
                totalStaff
              }
              description="People assigned to this event"
              accent
            />

            <MetricCard
              label="Check-In"
              value={
                checkInStaff
              }
              description="Managing attendee entry"
            />

            <MetricCard
              label="Security"
              value={
                securityStaff
              }
              description="Managing safety and access"
            />

            <MetricCard
              label="Operations"
              value={
                operationalStaff
              }
              description="Other operational roles"
            />

          </div>

        </section>

        {/* ------------------------------------------------ */}
        {/* Staff Roster */}
        {/* ------------------------------------------------ */}

        <section className="mt-14">

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
                Team Directory
              </p>

              <h2 className="mt-2 text-2xl font-semibold md:text-3xl">
                Staff Roster
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
                Everyone with operational
                access to this event appears
                here.
              </p>

            </div>

            {staff.length >
              0 && (
              <span className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/45">
                {staff.length}{" "}
                {staff.length ===
                1
                  ? "person"
                  : "people"}
              </span>
            )}

          </div>

          {staff.length ===
          0 ? (
            <EmptyStaff
              eventId={
                eventId
              }
            />
          ) : (
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.025]">

              {/* Table Header */}

              <div className="border-b border-white/[0.07] px-6 py-5 md:px-7">

                <div className="flex items-center justify-between gap-6">

                  <div>

                    <p className="text-sm font-semibold text-white/75">
                      Operational Team
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      Roles and access
                      assigned for this
                      event
                    </p>

                  </div>

                  <div className="flex items-center gap-2">

                    <span className="relative flex h-2 w-2">

                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0F766E] opacity-30" />

                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0F766E]" />

                    </span>

                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">
                      Active Roster
                    </span>

                  </div>

                </div>

              </div>

              {/* Existing table logic */}

              <StaffTable
                eventId={
                  eventId
                }
                staff={
                  staff
                }
              />

            </div>
          )}

        </section>

        {/* ------------------------------------------------ */}
        {/* Operational Context */}
        {/* ------------------------------------------------ */}

        {staff.length >
          0 && (
          <section className="mt-12">

            <div className="grid gap-5 lg:grid-cols-3">

              <OperationCard
                number="01"
                title="Assign Roles"
                description="Give each staff member the operational access required for their responsibility."
              />

              <OperationCard
                number="02"
                title="Control Access"
                description="Keep sensitive event operations limited to the people responsible for them."
              />

              <OperationCard
                number="03"
                title="Run the Event"
                description="Your staff team becomes the operational layer connecting planning with the live event."
              />

            </div>

          </section>
        )}

      </div>

    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Metric Card
|--------------------------------------------------------------------------
*/

function MetricCard({
  label,
  value,
  description,
  accent = false,
}: {
  label: string;
  value: number;
  description: string;
  accent?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035] p-6">

      <div
        className={`absolute left-0 top-0 h-full w-[3px] ${
          accent
            ? "bg-[#0F766E]"
            : "bg-white/20"
        }`}
      />

      <p className="text-sm font-medium text-white/40">
        {label}
      </p>

      <div className="mt-5 flex items-end justify-between">

        <p className="text-4xl font-bold tracking-tight">
          {value.toLocaleString(
            "en-US"
          )}
        </p>

        <div
          className={`mb-2 h-2.5 w-2.5 rounded-full ${
            accent
              ? "bg-[#0F766E]"
              : "bg-white/20"
          }`}
        />

      </div>

      <p className="mt-3 text-xs leading-5 text-white/30">
        {description}
      </p>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Empty Staff
|--------------------------------------------------------------------------
*/

function EmptyStaff({
  eventId,
}: {
  eventId: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0F766E]/[0.04] blur-3xl" />

      <div className="relative">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D4AF37]/15 bg-[#0F766E]/[0.07]">

          <StaffIcon />

        </div>

        <h3 className="mt-6 text-xl font-semibold">
          Build your event team
        </h3>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/35">
          No staff members have been
          assigned yet. Add the people
          responsible for check-in,
          security and event operations.
        </p>

        <div className="mx-auto mt-8 w-fit">

          <AddStaffModal
            eventId={
              eventId
            }
          />

        </div>

      </div>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Operation Card
|--------------------------------------------------------------------------
*/

function OperationCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/[0.07] bg-white/[0.02] p-6">

      <p className="text-xs font-bold tracking-[0.2em] text-[#D4AF37]">
        {number}
      </p>

      <h3 className="mt-4 font-semibold text-white/80">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-white/35">
        {description}
      </p>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Staff Icon
|--------------------------------------------------------------------------
*/

function StaffIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-[#D4AF37]"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 0 0 2.625.372A9.337 9.337 0 0 0 21 18.872a4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-.621-.113-1.216-.32-1.764M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 12.43-1.764M12.75 7.5a4.125 4.125 0 1 1-8.25 0 4.125 4.125 0 0 1 8.25 0Zm6.75 2.25a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
}