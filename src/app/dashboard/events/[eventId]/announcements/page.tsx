"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import {
  Bell,
  Radio,
  RefreshCw,
  AlertCircle,
  Megaphone,
  Activity,
} from "lucide-react";

import AnnouncementList from "@/components/dashboard/announcements/AnnouncementList";

import {
  Announcement,
  getAnnouncements,
} from "@/services/announcement";

import {
  useRealtime,
} from "@/hooks/useRealtime";

export default function AnnouncementPage() {
  const params =
    useParams<{
      eventId: string;
    }>();

  const eventId =
    params.eventId;

  const [
    announcements,
    setAnnouncements,
  ] = useState<
    Announcement[]
  >([]);

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
  | Load Announcements
  |--------------------------------------------------------------------------
  */

  async function loadAnnouncements() {
    if (!eventId) {
      return;
    }

    try {
      setLoading(true);

      const result =
        await getAnnouncements(
          eventId,
        );

      if (
        result.success
      ) {
        setAnnouncements(
          result.announcements ??
            [],
        );

        setError("");
      }
    } catch (err: any) {
      console.error(
        err,
      );

      setError(
        err.message ??
          "Unable to load announcements.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!eventId) {
      return;
    }

    loadAnnouncements();
  }, [eventId]);

  /*
  |--------------------------------------------------------------------------
  | Realtime
  |--------------------------------------------------------------------------
  */

  useRealtime({
    eventId,

    onAnnouncementCreated(
      announcement,
    ) {
      setAnnouncements(
        (previous) => {
          const exists =
            previous.some(
              (item) =>
                item.id ===
                announcement.id,
            );

          if (exists) {
            return previous;
          }

          return [
            announcement,
            ...previous,
          ];
        },
      );
    },

    onAnnouncementUpdated(
      announcement,
    ) {
      setAnnouncements(
        (previous) =>
          previous.map(
            (item) =>
              item.id ===
              announcement.id
                ? announcement
                : item,
          ),
      );
    },

    onAnnouncementDeleted(
      payload,
    ) {
      setAnnouncements(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !==
              payload.id,
          ),
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

              <div className="h-10 w-80 rounded-lg bg-white/[0.06]" />

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
                h-[420px]
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
              Event Communications
            </p>

          </div>

          <h1 className="mt-4 text-4xl font-black tracking-tight">
            Live Announcements
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
              Failed to Load Announcements
            </h2>

            <p className="mt-2 max-w-lg text-sm leading-6 text-white/40">
              {error}
            </p>

            <button
              type="button"
              onClick={
                loadAnnouncements
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
                Event Communications
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
              Live Announcements
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
              Broadcast important information,
              operational updates and live event
              notices to your attendees.
            </p>

          </div>

          {/* Live Indicator */}

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
                Realtime
              </p>

              <p className="mt-0.5 text-xs font-bold text-emerald-400">
                Live Connection
              </p>

            </div>

          </div>

        </header>

        {/* Communication Overview */}

        <section className="grid gap-4 md:grid-cols-3">

          <OverviewCard
            icon={Megaphone}
            label="Announcements"
            value={
              announcements.length
            }
            description="Messages currently available for this event."
          />

          <OverviewCard
            icon={Radio}
            label="Delivery"
            value="Realtime"
            description="New announcements are delivered through the live event channel."
          />

          <OverviewCard
            icon={Activity}
            label="Communication"
            value="Active"
            description="Your event communication channel is operational."
          />

        </section>

        {/* Announcement Feed */}

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
                <Bell className="h-5 w-5 text-[#D4AF37]" />
              </div>

              <div>

                <h2 className="text-lg font-bold">
                  Announcement Feed
                </h2>

                <p className="mt-1 text-sm text-white/35">
                  Live communication history for this event.
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
                {announcements.length}{" "}
                {announcements.length === 1
                  ? "Message"
                  : "Messages"}
              </span>

            </div>

          </div>

          {/* Feed */}

          {announcements.length === 0 ? (

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

                <Megaphone className="relative h-8 w-8 text-[#D4AF37]" />

              </div>

              <h2 className="mt-6 text-xl font-bold">
                No Announcements Yet
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
                Your event communication feed is
                currently quiet. New announcements
                will appear here as they are created.
              </p>

            </div>

          ) : (

            <div className="p-4 md:p-6">

              <AnnouncementList
                announcements={
                  announcements
                }
              />

            </div>

          )}

        </section>

      </div>

    </main>
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