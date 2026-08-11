"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Users,
} from "lucide-react";

import {
  getEventCapacity,
  type EventCapacity,
} from "@/services/capacity";

interface CapacityPageProps {
  params: Promise<{
    eventId: string;
  }>;
}

function getIntensity(
  percentage: number,
) {
  if (percentage >= 90) {
    return {
      label: "Critical",
      description:
        "The event is approaching maximum capacity.",
    };
  }

  if (percentage >= 75) {
    return {
      label: "High",
      description:
        "Occupancy is becoming significantly high.",
    };
  }

  if (percentage >= 50) {
    return {
      label: "Moderate",
      description:
        "The event is moderately occupied.",
    };
  }

  if (percentage >= 25) {
    return {
      label: "Low",
      description:
        "There is currently substantial available capacity.",
    };
  }

  return {
    label: "Very Low",
    description:
      "The event currently has high available capacity.",
  };
}

function getCellOpacity(
  index: number,
  percentage: number,
) {
  const normalized =
    Math.min(
      Math.max(percentage, 0),
      100,
    ) / 100;

  const centerDistance =
    Math.abs(index - 7.5) / 7.5;

  const intensity =
    normalized *
    (1 - centerDistance * 0.35);

  return Math.max(
    0.08,
    Math.min(0.95, intensity),
  );
}

export default function CapacityPage({
  params,
}: CapacityPageProps) {
  const [eventId, setEventId] =
    useState<string | null>(null);

  const [capacity, setCapacity] =
    useState<EventCapacity | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
   * Resolve the dynamic route.
   */
  useEffect(() => {
    params.then((value) => {
      setEventId(value.eventId);
    });
  }, [params]);

  /*
   * Load capacity.
   */
useEffect(() => {
  if (!eventId) {
    return;
  }

  const currentEventId = eventId;

  let active = true;

  async function loadCapacity() {
    try {
      setLoading(true);
      setError("");

      const response =
        await getEventCapacity(
          currentEventId,
        );

      if (!active) {
        return;
      }

      if (!response.success) {
        throw new Error(
          response.message ??
            "Unable to load event capacity.",
        );
      }

      setCapacity(
        response.capacity,
      );
    } catch (err) {
      if (!active) {
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load event capacity.",
      );
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  }

  loadCapacity();

  return () => {
    active = false;
  };
}, [eventId]);

  const intensity = useMemo(
    () =>
      capacity
        ? getIntensity(
            capacity.occupancyPercentage,
          )
        : null,
    [capacity],
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] p-6 text-white md:p-10">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-4 w-24 rounded bg-white/10" />

          <div className="mt-6 h-10 w-64 rounded bg-white/10" />

          <div className="mt-10 h-[500px] rounded-3xl bg-white/[0.03]" />
        </div>
      </main>
    );
  }

  if (error || !capacity) {
    return (
      <main className="min-h-screen bg-[#050505] p-6 text-white md:p-10">
        <div className="mx-auto max-w-7xl">
          <Link
            href={
              eventId
                ? `/dashboard/events/${eventId}`
                : "/dashboard/events"
            }
            className="inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to event
          </Link>

          <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/[0.05] p-6">
            <h1 className="font-semibold text-red-300">
              Unable to load capacity
            </h1>

            <p className="mt-2 text-sm text-red-300/70">
              {error ||
                "Capacity information is unavailable."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const percentage =
    Math.min(
      Math.max(
        capacity.occupancyPercentage,
        0,
      ),
      100,
    );

  const availableCapacity =
    Math.max(
      capacity.capacity -
        capacity.currentOccupancy,
      0,
    );

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
        {/* Header */}

        <div className="flex flex-col gap-6 border-b border-white/10 pb-8">
          <Link
            href={`/dashboard/events/${eventId}`}
            className="inline-flex w-fit items-center gap-2 text-sm text-white/40 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to event
          </Link>

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3E86A4]/15">
                  <Activity className="h-5 w-5 text-[#53A6C7]" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#53A6C7]">
                    Event Operations
                  </p>

                  <h1 className="mt-1 text-3xl font-bold tracking-tight">
                    Live Capacity
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/45">
                Monitor attendee occupancy,
                check-ins and available capacity
                for this event in real time.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#14B8A6]" />

              <span className="text-xs font-medium text-white/45">
                Live monitoring
              </span>
            </div>
          </div>
        </div>

        {/* Overview */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-[#53A6C7]" />

              <span className="text-xs uppercase tracking-wider text-white/35">
                Current Occupancy
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold">
              {capacity.currentOccupancy.toLocaleString()}
            </p>

            <p className="mt-1 text-xs text-white/30">
              attendees currently inside
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <Activity className="h-4 w-4 text-[#53A6C7]" />

              <span className="text-xs uppercase tracking-wider text-white/35">
                Occupancy
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold">
              {percentage.toFixed(0)}%
            </p>

            <p className="mt-1 text-xs text-white/30">
              {intensity?.label}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <ArrowUp className="h-4 w-4 text-[#53A6C7]" />

              <span className="text-xs uppercase tracking-wider text-white/35">
                Check-ins
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold">
              {capacity.totalCheckIns.toLocaleString()}
            </p>

            <p className="mt-1 text-xs text-white/30">
              total recorded
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-[#53A6C7]" />

              <span className="text-xs uppercase tracking-wider text-white/35">
                Available
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold">
              {availableCapacity.toLocaleString()}
            </p>

            <p className="mt-1 text-xs text-white/30">
              remaining capacity
            </p>
          </div>
        </div>

        {/* Heatmap */}

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Occupancy Heatmap
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Visual representation of current
                event occupancy intensity.
              </p>
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white/60">
              {intensity?.label}
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-black/30 p-5 md:p-8">
            <div className="mx-auto max-w-4xl">
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-8 md:gap-3">
                {Array.from({
                  length: 32,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-xl bg-[#3E86A4] transition-all duration-700"
                    style={{
                      opacity:
                        getCellOpacity(
                          index % 16,
                          percentage,
                        ),
                    }}
                  />
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-[11px] text-white/30">
                <span>
                  Low occupancy
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-sm bg-[#3E86A4]/20" />
                  <span className="h-3 w-3 rounded-sm bg-[#3E86A4]/40" />
                  <span className="h-3 w-3 rounded-sm bg-[#3E86A4]/60" />
                  <span className="h-3 w-3 rounded-sm bg-[#3E86A4]/80" />
                  <span className="h-3 w-3 rounded-sm bg-[#3E86A4]" />
                </div>

                <span>
                  High occupancy
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 max-w-2xl">
            <p className="text-sm leading-6 text-white/45">
              {intensity?.description}
            </p>
          </div>
        </section>

        {/* Detailed statistics */}

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-semibold">
              Capacity Overview
            </h2>

            <div className="mt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">
                  Occupancy
                </span>

                <span className="font-semibold">
                  {capacity.currentOccupancy.toLocaleString()}
                  {" / "}
                  {capacity.capacity.toLocaleString()}
                </span>
              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#3E86A4] transition-all duration-700"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>

              <div className="mt-3 flex justify-between text-xs text-white/30">
                <span>0</span>

                <span>
                  {capacity.capacity.toLocaleString()} capacity
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-semibold">
              Attendance Movement
            </h2>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <ArrowUp className="h-5 w-5 text-[#53A6C7]" />

                <p className="mt-4 text-2xl font-bold">
                  {capacity.totalCheckIns.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-white/35">
                  Total check-ins
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <ArrowDown className="h-5 w-5 text-white/40" />

                <p className="mt-4 text-2xl font-bold">
                  {capacity.totalCheckOuts.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-white/35">
                  Total check-outs
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}