"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import {
  Activity as ActivityIcon,
  AlertCircle,
  Clock3,
  MapPin,
  Radio,
  RefreshCw,
  Ticket,
  User,
  Users,
  Zap,
} from "lucide-react";

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
      <main className="min-h-screen bg-[#050505] p-6 text-white md:p-8">

        <div className="mx-auto max-w-7xl">

          <div className="animate-pulse">

            <div className="space-y-3">

              <div className="h-3 w-40 rounded-full bg-white/[0.06]" />

              <div className="h-10 w-72 rounded-lg bg-white/[0.06]" />

              <div className="h-4 w-96 max-w-full rounded bg-white/[0.04]" />

            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">

              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="
                      h-36
                      rounded-[24px]
                      border
                      border-white/[0.04]
                      bg-white/[0.025]
                    "
                  />
                ),
              )}

            </div>

            <div
              className="
                mt-6
                h-[460px]
                rounded-[28px]
                border
                border-white/[0.04]
                bg-white/[0.025]
              "
            />

          </div>

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
      <main className="min-h-screen bg-[#050505] p-6 text-white md:p-8">

        <div className="mx-auto max-w-7xl">

          <div className="flex items-center gap-2">

            <span className="h-px w-8 bg-[#D4AF37]" />

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.24em]
                text-[#D4AF37]
              "
            >
              Event Operations
            </p>

          </div>

          <h1 className="mt-4 text-4xl font-black tracking-tight">
            Live Activity
          </h1>

          <div
            className="
              mt-10
              rounded-[28px]
              border
              border-red-500/15
              bg-red-500/[0.04]
              p-8
            "
          >

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-red-500/10
              "
            >
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>

            <h2 className="mt-6 text-xl font-bold">
              Failed to Load Activity
            </h2>

            <p className="mt-2 max-w-lg text-sm leading-6 text-white/40">
              {error}
            </p>

            <button
              type="button"
              onClick={
                loadActivity
              }
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-white
                px-5
                py-3
                text-sm
                font-bold
                text-black
                transition
                hover:bg-white/90
              "
            >
              <RefreshCw className="h-4 w-4" />

              Try Again
            </button>

          </div>

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
    <main className="min-h-screen bg-[#050505] p-6 text-white md:p-8">

      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}

        <header
          className="
            flex
            flex-col
            gap-6
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >

          <div>

            <div className="flex items-center gap-2">

              <span className="h-px w-8 bg-[#D4AF37]" />

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.24em]
                  text-[#D4AF37]
                "
              >
                Event Operations
              </p>

            </div>

            <h1
              className="
                mt-4
                text-3xl
                font-black
                tracking-tight
                md:text-4xl
              "
            >
              Live Activity
            </h1>

            <p
              className="
                mt-3
                max-w-2xl
                text-sm
                leading-6
                text-white/40
              "
            >
              Follow operational activity across
              your event as it happens.
            </p>

          </div>

          {/* Live Status */}

          <div
            className="
              flex
              w-fit
              items-center
              gap-3
              rounded-xl
              border
              border-emerald-500/15
              bg-emerald-500/[0.05]
              px-4
              py-3
            "
          >

            <div className="relative">

              <span
                className="
                  absolute
                  inset-0
                  animate-ping
                  rounded-full
                  bg-emerald-400/40
                "
              />

              <span
                className="
                  relative
                  block
                  h-2
                  w-2
                  rounded-full
                  bg-emerald-400
                "
              />

            </div>

            <div>

              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-emerald-400/60
                "
              >
                Operations Feed
              </p>

              <p className="mt-0.5 text-xs font-bold text-emerald-400">
                Live
              </p>

            </div>

          </div>

        </header>

        {/* Overview */}

        <section className="grid gap-4 md:grid-cols-3">

          <OverviewCard
            icon={ActivityIcon}
            label="Activity Records"
            value={
              activities.length
            }
            description="Operational events recorded during this event."
          />

          <OverviewCard
            icon={Radio}
            label="Feed"
            value="Realtime"
            description="New operational activity appears as it happens."
          />

          <OverviewCard
            icon={Zap}
            label="Operations"
            value="Active"
            description="The event activity channel is currently available."
          />

        </section>

        {/* Activity Feed */}

        <section
          className="
            overflow-hidden
            rounded-[28px]
            border
            border-white/[0.08]
            bg-[#0D0D0D]
          "
        >

          {/* Feed Header */}

          <div
            className="
              flex
              flex-col
              gap-5
              border-b
              border-white/[0.07]
              px-6
              py-6
              md:flex-row
              md:items-center
              md:justify-between
              md:px-7
            "
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#D4AF37]/15
                  bg-[#D4AF37]/[0.06]
                "
              >
                <ActivityIcon className="h-5 w-5 text-[#D4AF37]" />
              </div>

              <div>

                <h2 className="text-lg font-bold">
                  Operations Feed
                </h2>

                <p className="mt-1 text-sm text-white/35">
                  Latest event activity appears first.
                </p>

              </div>

            </div>

            <div
              className="
                flex
                w-fit
                items-center
                gap-2
                rounded-lg
                border
                border-white/[0.06]
                bg-black/20
                px-3
                py-2
              "
            >

              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />

              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  text-white/35
                "
              >
                {activities.length}{" "}
                {activities.length === 1
                  ? "Record"
                  : "Records"}
              </span>

            </div>

          </div>

          {/* Empty State */}

          {activities.length === 0 ? (

            <div className="px-6 py-20 text-center">

              <div
                className="
                  relative
                  mx-auto
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#D4AF37]/15
                  bg-[#D4AF37]/[0.05]
                "
              >

                <div
                  className="
                    absolute
                    inset-2
                    rounded-full
                    border
                    border-[#D4AF37]/10
                  "
                />

                <ActivityIcon className="relative h-8 w-8 text-[#D4AF37]" />

              </div>

              <h2 className="mt-6 text-xl font-bold">
                No Activity Yet
              </h2>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-md
                  text-sm
                  leading-6
                  text-white/35
                "
              >
                Operational events will appear here
                as your team begins interacting with
                attendees and managing the event.
              </p>

            </div>

          ) : (

            /* Timeline */

            <div className="px-5 py-3 md:px-7">

              {activities.map(
                (
                  activity,
                  index,
                ) => (
                  <ActivityItem
                    key={
                      activity.id
                    }
                    activity={
                      activity
                    }
                    isLast={
                      index ===
                      activities.length -
                        1
                    }
                  />
                ),
              )}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Activity Item
|--------------------------------------------------------------------------
*/

function ActivityItem({
  activity,
  isLast,
}: {
  activity: Activity;
  isLast: boolean;
}) {
  return (
    <div className="relative flex gap-4 md:gap-6">

      {/* Timeline */}

      <div
        className="
          relative
          flex
          w-10
          shrink-0
          justify-center
        "
      >

        {!isLast && (
          <div
            className="
              absolute
              left-1/2
              top-10
              bottom-0
              w-px
              -translate-x-1/2
              bg-white/[0.07]
            "
          />
        )}

        <div
          className="
            relative
            z-10
            mt-6
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            border
            border-[#D4AF37]/20
            bg-[#121212]
          "
        >
          <ActivityIcon className="h-3.5 w-3.5 text-[#D4AF37]" />
        </div>

      </div>

      {/* Content */}

      <article
        className={`
          min-w-0
          flex-1
          py-6
          ${
            !isLast
              ? "border-b border-white/[0.06]"
              : ""
          }
        `}
      >

        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-start
            sm:justify-between
          "
        >

          <div className="min-w-0">

            <h3
              className="
                text-sm
                font-bold
                leading-6
                text-white
                md:text-base
              "
            >
              {activity.title}
            </h3>

            <p
              className="
                mt-2
                max-w-3xl
                text-sm
                leading-6
                text-white/40
              "
            >
              {activity.description}
            </p>

          </div>

          <span
            className="
              w-fit
              shrink-0
              rounded-lg
              border
              border-[#D4AF37]/15
              bg-[#D4AF37]/[0.05]
              px-2.5
              py-1.5
              text-[9px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-[#D4AF37]
            "
          >
            {formatType(
              activity.type
            )}
          </span>

        </div>

        {/* Metadata */}

        <div
          className="
            mt-5
            flex
            flex-wrap
            items-center
            gap-x-5
            gap-y-3
          "
        >

          {activity.station && (
            <Metadata
              icon={MapPin}
            >
              {
                activity.station
              }
            </Metadata>
          )}

          {activity.actorName && (
            <Metadata
              icon={User}
            >
              {activity.actorName}

              {activity.actorRole &&
                ` · ${formatType(
                  activity.actorRole
                )}`}
            </Metadata>
          )}

          {activity.attendeeName && (
            <Metadata
              icon={Users}
            >
              {
                activity.attendeeName
              }
            </Metadata>
          )}

          {activity.ticketTypeName && (
            <Metadata
              icon={Ticket}
            >
              {
                activity.ticketTypeName
              }
            </Metadata>
          )}

          <Metadata
            icon={Clock3}
          >
            {formatDate(
              activity.createdAt
            )}
          </Metadata>

        </div>

      </article>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Metadata
|--------------------------------------------------------------------------
*/

function Metadata({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-1.5
        text-xs
        text-white/30
      "
    >
      <Icon className="h-3.5 w-3.5 shrink-0 text-white/20" />

      <span>
        {children}
      </span>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Overview Card
|--------------------------------------------------------------------------
*/

function OverviewCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: React.ElementType;
  label: string;
  value:
    | number
    | string;
  description: string;
}) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-[22px]
        border
        border-white/[0.08]
        bg-[#0D0D0D]
        p-6
        transition
        hover:border-[#D4AF37]/20
      "
    >

      <div
        className="
          pointer-events-none
          absolute
          -right-12
          -top-12
          h-32
          w-32
          rounded-full
          bg-[#D4AF37]/[0.035]
          blur-3xl
        "
      />

      <div className="relative">

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-[#D4AF37]/15
            bg-[#D4AF37]/[0.06]
          "
        >
          <Icon className="h-4 w-4 text-[#D4AF37]" />
        </div>

        <p
          className="
            mt-6
            text-[11px]
            font-bold
            uppercase
            tracking-[0.16em]
            text-white/30
          "
        >
          {label}
        </p>

        <p className="mt-2 text-3xl font-black tracking-tight">
          {value}
        </p>

        <p className="mt-2 text-xs leading-5 text-white/30">
          {description}
        </p>

      </div>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function formatType(
  value: string
) {
  return value
    .replaceAll(
      "_",
      " "
    )
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    );
}

function formatDate(
  date: string
) {
  return new Date(
    date
  ).toLocaleString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
}