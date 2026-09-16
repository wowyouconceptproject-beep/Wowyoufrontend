"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BrainCircuit,
  Gauge,
  ShieldAlert,
  Users,
  Zap,
} from "lucide-react";

import {
  getEventHeatmap,
  getEventPulse,
  type EventHeatmap,
  type EventPulse,
} from "@/services/intelligence";

interface CapacityPageProps {
  params: Promise<{
    eventId: string;
  }>;
}

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function stateDescription(
  state: EventPulse["state"],
) {
  switch (state) {
    case "CRITICAL":
      return "The event is operating at a critical pressure level.";

    case "CONGESTED":
      return "Crowd pressure is elevated and requires operational attention.";

    case "SURGING":
      return "Attendee movement is accelerating and entry pressure is increasing.";

    case "ACTIVE":
      return "The event is active with measurable attendee movement.";

    default:
      return "Event operations are currently stable.";
  }
}

function levelClass(
  level:
    | "LOW"
    | "MODERATE"
    | "HIGH"
    | "CRITICAL",
) {
  if (level === "CRITICAL") {
    return "border-red-400/30 bg-red-400/10 text-red-200";
  }

  if (level === "HIGH") {
    return "border-orange-300/30 bg-orange-300/10 text-orange-200";
  }

  if (level === "MODERATE") {
    return "border-primary/30 bg-primary/10 text-primary";
  }

  return "border-white/10 bg-white/[0.04] text-white/55";
}

function intensityBackground(
  intensity: number,
) {
  const alpha =
    Math.max(
      0.08,
      Math.min(
        0.92,
        intensity / 100,
      ),
    );

  return `rgba(32, 184, 208, ${alpha})`;
}

/*
|--------------------------------------------------------------------------
| Page
|--------------------------------------------------------------------------
*/

export default function CapacityPage({
  params,
}: CapacityPageProps) {
  const [
    eventId,
    setEventId,
  ] =
    useState<string | null>(
      null,
    );

  const [
    pulse,
    setPulse,
  ] =
    useState<EventPulse | null>(
      null,
    );

  const [
    heatmap,
    setHeatmap,
  ] =
    useState<EventHeatmap | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | Resolve route
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    params.then(
      (value) => {
        setEventId(
          value.eventId,
        );
      },
    );
  }, [params]);

  /*
  |--------------------------------------------------------------------------
  | Intelligence
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!eventId) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | TypeScript narrowing
    |--------------------------------------------------------------------------
    |
    | eventId is confirmed above. Capture the narrowed value so the
    | asynchronous function below always receives a definite string.
    |
    */

    const currentEventId =
      eventId;

    let active = true;

    let refreshing =
      false;

    async function loadIntelligence(
      initial = false,
    ) {
      if (refreshing) {
        return;
      }

      refreshing = true;

      try {
        if (initial) {
          setLoading(true);
          setError("");
        }

        const [
          pulseResponse,
          heatmapResponse,
        ] =
          await Promise.all([
            getEventPulse(
              currentEventId,
            ),

            getEventHeatmap(
              currentEventId,
            ),
          ]);

        if (!active) {
          return;
        }

        if (
          !pulseResponse.success ||
          !pulseResponse.pulse
        ) {
          throw new Error(
            pulseResponse.message ??
              "Unable to load event pulse.",
          );
        }

        if (
          !heatmapResponse.success ||
          !heatmapResponse.heatmap
        ) {
          throw new Error(
            heatmapResponse.message ??
              "Unable to load event heatmap.",
          );
        }

        setPulse(
          pulseResponse.pulse,
        );

        setHeatmap(
          heatmapResponse.heatmap,
        );
      } catch (err) {
        if (
          active &&
          initial
        ) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load event intelligence.",
          );
        } else {
          console.error(
            "Event intelligence refresh failed:",
            err,
          );
        }
      } finally {
        if (
          active &&
          initial
        ) {
          setLoading(false);
        }

        refreshing =
          false;
      }
    }

    loadIntelligence(
      true,
    );

    const interval =
      window.setInterval(
        () => {
          loadIntelligence(
            false,
          );
        },
        10_000,
      );

    const handleFocus =
      () => {
        loadIntelligence(
          false,
        );
      };

    window.addEventListener(
      "focus",
      handleFocus,
    );

    return () => {
      active =
        false;

      window.clearInterval(
        interval,
      );

      window.removeEventListener(
        "focus",
        handleFocus,
      );
    };
  }, [eventId]);

  /*
  |--------------------------------------------------------------------------
  | Pulse level
  |--------------------------------------------------------------------------
  */

  const pulseLevel =
    useMemo(() => {
      if (!pulse) {
        return "LOW";
      }

      if (
        pulse.score >=
        85
      ) {
        return "CRITICAL";
      }

      if (
        pulse.score >=
        65
      ) {
        return "HIGH";
      }

      if (
        pulse.score >=
        40
      ) {
        return "MODERATE";
      }

      return "LOW";
    }, [pulse]);

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="min-h-screen bg-background p-6 text-white md:p-10">
        <div className="mx-auto max-w-[1500px] animate-pulse">
          <div className="h-4 w-28 rounded bg-white/10" />

          <div className="mt-6 h-12 w-80 rounded bg-white/10" />

          <div className="mt-8 h-64 rounded-[32px] bg-white/[0.03]" />

          <div className="mt-6 h-[520px] rounded-[32px] bg-white/[0.03]" />
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (
    error ||
    !pulse ||
    !heatmap
  ) {
    return (
      <main className="min-h-screen bg-background p-6 text-white md:p-10">
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

          <div className="mt-8 rounded-3xl border border-red-400/20 bg-red-400/[0.05] p-6">
            <h1 className="font-semibold text-red-200">
              Event intelligence unavailable
            </h1>

            <p className="mt-2 text-sm text-red-200/70">
              {error ||
                "Unable to load the event intelligence layer."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const occupancy =
    Math.round(
      pulse.capacity
        .occupancyPercentage,
    );

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-background text-white">
      <div className="mx-auto max-w-[1500px] px-6 py-8 md:px-10 md:py-10">

        {/* Header */}

        <header className="border-b border-white/10 pb-8">

          <Link
            href={`/dashboard/events/${eventId}`}
            className="inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to event
          </Link>

          <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15">

                  <BrainCircuit className="h-6 w-6 text-primary" />

                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
                    Event Intelligence
                  </p>

                  <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
                    Sentient Pulse
                  </h1>

                </div>

              </div>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/45">
                The operational intelligence layer translating
                field activity into live crowd pressure,
                movement and capacity signals.
              </p>

            </div>

            <div className="flex items-center gap-3">

              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-success" />

              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                Live intelligence
              </span>

            </div>

          </div>

        </header>

        {/* Sentient Pulse */}

        <section className="mt-8 overflow-hidden rounded-[32px] border border-primary/20 bg-primary/[0.05] p-6 md:p-8">

          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">

            <div>

              <div className="flex flex-wrap items-center gap-3">

                <span
                  className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] ${levelClass(
                    pulseLevel,
                  )}`}
                >
                  {pulse.state}
                </span>

                <span className="text-xs text-white/30">
                  Confidence{" "}
                  {pulse.confidence}%
                </span>

              </div>

              <h2 className="mt-5 text-2xl font-bold md:text-3xl">
                {stateDescription(
                  pulse.state,
                )}
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/45">
                {pulse.summary}
              </p>

            </div>

            <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-primary/20 bg-background/30">

              <div className="absolute inset-3 animate-pulse rounded-full border border-primary/20" />

              <div className="text-center">

                <p className="text-5xl font-black tracking-tight text-primary">
                  {pulse.score}
                </p>

                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.22em] text-white/35">
                  Pulse score
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* Metrics */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

          <Metric
            icon={
              <Users className="h-4 w-4" />
            }
            label="Inside"
            value={pulse.capacity.currentOccupancy.toLocaleString()}
            detail={`${occupancy}% occupied`}
          />

          <Metric
            icon={
              <Gauge className="h-4 w-4" />
            }
            label="Available"
            value={pulse.capacity.remaining.toLocaleString()}
            detail="remaining capacity"
          />

          <Metric
            icon={
              <ArrowUp className="h-4 w-4" />
            }
            label="Arrivals / min"
            value={pulse.movement.arrivalsPerMinute.toFixed(1)}
            detail={`${pulse.movement.arrivalsLast15Minutes} in 15 min`}
          />

          <Metric
            icon={
              pulse.movement
                .direction ===
              "DECREASING" ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )
            }
            label="Net movement"
            value={pulse.movement.netMovement.toLocaleString()}
            detail={pulse.movement.direction.toLowerCase()}
          />

          <Metric
            icon={
              <Activity className="h-4 w-4" />
            }
            label="Field activity"
            value={pulse.operations.activityLast15Minutes.toLocaleString()}
            detail={`${pulse.operations.onlineStaff} staff online`}
          />

        </section>

        {/* Heatmap + Signals */}

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_0.85fr]">

          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 md:p-8">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                  Operational map
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  Live Heatmap
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  Station activity over the last 15 minutes.
                </p>

              </div>

              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                {heatmap.mode}
              </span>

            </div>

            <div className="mt-8 rounded-[28px] border border-white/10 bg-background/50 p-4 md:p-6">

              <div className="relative aspect-[16/9] overflow-hidden rounded-[22px] border border-white/10 bg-surface/40">

                <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(32,184,208,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(32,184,208,0.08)_1px,transparent_1px)] [background-size:40px_40px]" />

                {heatmap.cells.map(
                  (
                    cell,
                  ) => (

                    <div
                      key={
                        cell.id
                      }
                      className="absolute p-1 transition-all duration-700"
                      style={{
                        left: `${cell.x}%`,
                        top: `${cell.y}%`,
                        width: `${cell.width}%`,
                        height: `${cell.height}%`,
                      }}
                    >

                      <div
                        className="group relative flex h-full w-full flex-col justify-end overflow-hidden rounded-2xl border border-white/10 p-4"
                        style={{
                          backgroundColor:
                            intensityBackground(
                              cell.intensity,
                            ),
                        }}
                      >

                        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />

                        <div className="relative z-10">

                          <p className="truncate text-xs font-bold text-white">
                            {cell.label}
                          </p>

                          <div className="mt-1 flex items-center justify-between gap-2">

                            <span className="text-[10px] text-white/55">
                              {
                                cell.activity
                              }{" "}
                              activity
                            </span>

                            <span className="text-xs font-bold">
                              {
                                cell.intensity
                              }
                              %
                            </span>

                          </div>

                        </div>

                      </div>

                    </div>

                  ),
                )}

              </div>

              <div className="mt-5 flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-white/30">

                <span>
                  Low
                </span>

                <div className="flex items-center gap-1.5">

                  {[
                    15,
                    35,
                    55,
                    75,
                    95,
                  ].map(
                    (
                      value,
                    ) => (

                      <span
                        key={
                          value
                        }
                        className="h-3 w-8 rounded-sm"
                        style={{
                          backgroundColor:
                            intensityBackground(
                              value,
                            ),
                        }}
                      />

                    ),
                  )}

                </div>

                <span>
                  Critical
                </span>

              </div>

            </div>

          </div>

          {/* Signals */}

          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 md:p-8">

            <div className="flex items-center gap-3">

              <Zap className="h-5 w-5 text-primary" />

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                  Intelligence
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Signals
                </h2>

              </div>

            </div>

            <div className="mt-6 space-y-3">

              {pulse.signals.map(
                (
                  signal,
                ) => (

                  <div
                    key={`${signal.type}-${signal.title}`}
                    className="rounded-2xl border border-white/10 bg-background/30 p-4"
                  >

                    <div className="flex items-start gap-3">

                      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <p className="text-sm font-semibold">
                            {
                              signal.title
                            }
                          </p>

                          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/30">
                            {
                              signal.severity
                            }
                          </span>

                        </div>

                        <p className="mt-1 text-xs leading-5 text-white/40">
                          {
                            signal.message
                          }
                        </p>

                      </div>

                    </div>

                  </div>

                ),
              )}

            </div>

            <div className="mt-7 border-t border-white/10 pt-6">

              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
                Recommended attention
              </p>

              <div className="mt-4 space-y-3">

                {pulse.recommendations.length >
                0 ? (

                  pulse.recommendations.map(
                    (
                      recommendation,
                    ) => (

                      <div
                        key={`${recommendation.title}-${recommendation.action}`}
                        className="rounded-2xl border border-primary/10 bg-primary/[0.04] p-4"
                      >

                        <p className="text-sm font-semibold text-primary">
                          {
                            recommendation.title
                          }
                        </p>

                        <p className="mt-1 text-xs leading-5 text-white/40">
                          {
                            recommendation.action
                          }
                        </p>

                      </div>

                    ),
                  )

                ) : (

                  <p className="text-sm text-white/35">
                    No immediate operational intervention is indicated.
                  </p>

                )}

              </div>

            </div>

          </div>

        </section>

        {/* Capacity + Movement */}

        <section className="mt-6 grid gap-6 lg:grid-cols-2">

          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 md:p-8">

            <div className="flex items-end justify-between">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
                  Capacity pressure
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Occupancy
                </h2>

              </div>

              <span className="text-3xl font-black text-primary">
                {occupancy}%
              </span>

            </div>

            <div className="mt-7 h-3 overflow-hidden rounded-full bg-white/10">

              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{
                  width: `${occupancy}%`,
                }}
              />

            </div>

            <div className="mt-4 flex justify-between text-xs text-white/30">

              <span>
                {pulse.capacity.currentOccupancy.toLocaleString()}{" "}
                inside
              </span>

              <span>
                {pulse.capacity.capacity.toLocaleString()}{" "}
                capacity
              </span>

            </div>

          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 md:p-8">

            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
              Attendance movement
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Live flow
            </h2>

            <div className="mt-7 grid grid-cols-3 gap-3">

              <FlowMetric
                label="5 min"
                value={
                  pulse.movement
                    .arrivalsLast5Minutes
                }
              />

              <FlowMetric
                label="15 min"
                value={
                  pulse.movement
                    .arrivalsLast15Minutes
                }
              />

              <FlowMetric
                label="Total"
                value={
                  pulse.movement
                    .totalCheckIns
                }
              />

            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-background/30 p-4">

              <div className="flex items-center justify-between">

                <span className="text-xs text-white/35">
                  Flow direction
                </span>

                <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  {
                    pulse.movement
                      .direction
                  }
                </span>

              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-white/30">

                <span>
                  Check-ins{" "}
                  {
                    pulse.movement
                      .totalCheckIns
                  }
                </span>

                <span>
                  Check-outs{" "}
                  {
                    pulse.movement
                      .totalCheckOuts
                  }
                </span>

              </div>

            </div>

          </div>

        </section>

        <p className="mt-6 text-[10px] leading-5 text-white/20">
          Event Intelligence is derived from
          operational event data and should
          support—not replace—human operational
          judgement.
        </p>

      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Metric
|--------------------------------------------------------------------------
*/

function Metric({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

      <div className="flex items-center gap-2 text-primary">

        {icon}

        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
          {label}
        </span>

      </div>

      <p className="mt-4 text-3xl font-black">
        {value}
      </p>

      <p className="mt-1 text-xs text-white/30">
        {detail}
      </p>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Flow Metric
|--------------------------------------------------------------------------
*/

function FlowMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-background/30 p-4">

      <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
        {label}
      </p>

      <p className="mt-3 text-2xl font-bold">
        {value.toLocaleString()}
      </p>

    </div>
  );
}