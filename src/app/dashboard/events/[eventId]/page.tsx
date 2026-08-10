"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  useParams,
} from "next/navigation";

import DashboardStats from "@/components/dashboard/DashboardStats";
import ShareButton from "@/components/dashboard/events/ShareButton";

import {
  getEvent,
  publishEvent,
} from "@/services/event";

export default function EventPage() {
  const params =
    useParams<{
      eventId: string;
    }>();

  const eventId =
    params.eventId;

  const [event, setEvent] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  async function loadEvent() {
    try {
      const result =
        await getEvent(
          eventId
        );

      if (result.success) {
        setEvent(
          result.event
        );
      } else {
        console.error(
          result.message
        );
      }
    } catch (error) {
      console.error(
        "Failed to load event:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish() {
    try {
      const result =
        await publishEvent(
          event.id
        );

      if (!result.success) {
        alert(
          result.message ??
            "Unable to publish event."
        );

        return;
      }

      await loadEvent();
    } catch (error: any) {
      alert(
        error.message ??
          "Failed to publish event."
      );
    }
  }

  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  if (loading) {
    return (
      <main
        className="
          min-h-screen
          bg-[#050505]
          px-6
          py-8
          text-white
          lg:px-10
        "
      >
        <div
          className="
            flex
            min-h-[60vh]
            items-center
            justify-center
          "
        >
          <div className="text-center">
            <div
              className="
                mx-auto
                h-10
                w-10
                animate-spin
                rounded-full
                border-2
                border-white/10
                border-t-[#3E86A4]
              "
            />

            <p
              className="
                mt-5
                text-sm
                text-white/40
              "
            >
              Loading event command center...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main
        className="
          min-h-screen
          bg-[#050505]
          p-8
          text-white
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
          "
        >
          <h1
            className="
              text-3xl
              font-bold
            "
          >
            Event
          </h1>

          <p
            className="
              mt-4
              text-white/40
            "
          >
            Event not found.
          </p>
        </div>
      </main>
    );
  }

  const startDate =
    new Date(
      event.startDate
    );

  const endDate =
    new Date(
      event.endDate
    );

  const managementItems = [
    {
      title: "Tickets",
      description:
        "Create, manage and monitor ticket sales.",
      href: `/dashboard/events/${event.id}/tickets`,
      icon: "◫",
    },
    {
      title: "Attendees",
      description:
        "View registrations and attendee information.",
      href: `/dashboard/events/${event.id}/attendees`,
      icon: "◎",
    },
    {
  title: "Live Capacity",
  description:
    "Monitor event occupancy and capacity in real time.",
  href: `/dashboard/events/${event.id}/capacity`,
  icon: "◉",
},

    {
      title: "Staff",
      description:
        "Manage your event team and staff access.",
      href: `/dashboard/events/${event.id}/staff`,
      icon: "◇",
    },
    {
      title: "Revenue",
      description:
        "Track sales, revenue and event performance.",
      href: `/dashboard/events/${event.id}/revenue`,
      icon: "₦",
    },
    {
      title: "Activity",
      description:
        "Follow operational activity across your event.",
      href: `/dashboard/events/${event.id}/activity`,
      icon: "↗",
    },
    {
      title: "Announcements",
      description:
        "Send updates and information to attendees.",
      href: `/dashboard/events/${event.id}/announcements`,
      icon: "◉",
    },
    {
      title: "Vendor Applications",
      description:
        "Review and manage vendors participating in your event.",
      href: `/dashboard/events/${event.id}/vendors`,
      icon: "▦",
    },
  ];

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#050505]
        text-white
      "
    >
      {/* Background atmosphere */}

      <div
        className="
          pointer-events-none
          absolute
          right-[-200px]
          top-[-200px]
          h-[600px]
          w-[600px]
          rounded-full
          bg-[#3E86A4]/[0.06]
          blur-[160px]
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1500px]
          px-6
          py-8
          lg:px-10
          lg:py-10
        "
      >
        {/* Breadcrumb */}

        <div
          className="
            mb-8
            flex
            items-center
            gap-2
            text-sm
            text-white/35
          "
        >
          <Link
            href="/dashboard"
            className="
              transition
              hover:text-white
            "
          >
            Dashboard
          </Link>

          <span>/</span>

          <span>Events</span>

          <span>/</span>

          <span
            className="
              max-w-[240px]
              truncate
              text-white/60
            "
          >
            {event.title}
          </span>
        </div>

        {/* ==================================================
            EVENT COMMAND HEADER
        ================================================== */}

        <section
  className="
    relative
    overflow-hidden
    rounded-[28px]
    border
    border-white/[0.07]
    bg-[#0B0B0B]
    p-7
    lg:p-9
  "
>
  <div
    className="
      pointer-events-none
      absolute
      right-[-80px]
      top-[-100px]
      h-[320px]
      w-[320px]
      rounded-full
      bg-[#53A6C7]/12
      blur-[100px]
    "
  />

  <div
    className="
      relative
      z-10
      flex
      flex-col
      gap-8
      xl:flex-row
      xl:items-end
      xl:justify-between
    "
  >
    <div
      className="
        max-w-3xl
      "
    >
            
              {/* Status */}

              <div
                className="
                  mb-5
                  flex
                  flex-wrap
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-[#3E86A4]/20
                    bg-[#53A6C7]/12
                    px-3
                    py-1.5
                    text-xs
                    font-bold
                    tracking-wider
                    text-[#3E86A4]
                  "
                >
                  <span
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-[#3E86A4]
                    "
                  />

                  {event.status}
                </span>

                <span
                  className="
                    text-sm
                    text-white/35
                  "
                >
                  Event Command Center
                </span>
              </div>

              <h1
                className="
                  text-4xl
                  font-black
                  tracking-tight
                  text-white
                  md:text-5xl
                  xl:text-6xl
                "
              >
                {event.title}
              </h1>

              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  items-center
                  gap-x-6
                  gap-y-3
                  text-sm
                  text-white/50
                "
              >
                <span>
                  {event.venue}
                </span>

                <span
                  className="
                    hidden
                    h-1
                    w-1
                    rounded-full
                    bg-white/20
                    sm:block
                  "
                />

                <span>
                  {startDate.toLocaleDateString(
                    undefined,
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </span>

                <span
                  className="
                    hidden
                    h-1
                    w-1
                    rounded-full
                    bg-white/20
                    sm:block
                  "
                />

                <span>
                  Capacity{" "}
                  {event.capacity}
                </span>
              </div>
            </div>

            {/* Actions */}

            <div
  className="
    flex
    flex-wrap
    gap-3
  "
>
  {event.status === "DRAFT" && (
    <button
      onClick={handlePublish}
      className="
        h-12
        rounded-xl
        bg-[#3E86A4]
        px-6
        text-sm
        font-bold
        text-white
        transition
        hover:bg-[#1F7197]
      "
    >
      Publish Event
    </button>
  )}

  <button
    className="
      h-12
      rounded-xl
      border
      border-white/10
      bg-white/[0.04]
      px-6
      text-sm
      font-semibold
      text-white
      transition
      hover:border-[#3E86A4]/30
      hover:bg-white/[0.08]
    "
  >
    Edit Event
  </button>

  <ShareButton
  event={{
    id: event.id,
    title: event.title,
    description: event.description,
  }}
/>
</div>

</div>

</section>
        {/* ==================================================
            PERFORMANCE
        ================================================== */}

        <section
          className="
            mt-10
          "
        >
          <div
            className="
              mb-5
              flex
              items-end
              justify-between
            "
          >
            <div>
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.22em]
                  text-[#3E86A4]
                "
              >
                Live Performance
              </p>

              <h2
                className="
                  mt-2
                  text-2xl
                  font-bold
                  tracking-tight
                "
              >
                Event Overview
              </h2>
            </div>
          </div>

          <DashboardStats
            ticketsSold={
              event.stats
                ?.ticketSold ?? 0
            }
            checkedIn={
              event.stats
                ?.checkedIn ?? 0
            }
            revenue={
              event.stats
                ?.revenue ?? 0
            }
            currency={
              event.currency
            }
            onlineStaff={
              event.stats
                ?.onlineStaff ?? 0
            }
          />
        </section>

        {/* ==================================================
            EVENT CONTROL CENTER
        ================================================== */}

        <section
          className="
            mt-12
          "
        >
          <div
            className="
              mb-6
            "
          >
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.22em]
                text-[#3E86A4]
              "
            >
              Management
            </p>

            <h2
              className="
                mt-2
                text-2xl
                font-bold
                tracking-tight
              "
            >
              Event Control Center
            </h2>

            <p
              className="
                mt-2
                max-w-2xl
                text-sm
                leading-6
                text-white/40
              "
            >
              Manage every operational
              part of your event from
              one place.
            </p>
          </div>

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {managementItems.map(
              (item) => (
                <Link
                  key={
                    item.title
                  }
                  href={
                    item.href
                  }
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[22px]
                    border
                    border-white/[0.07]
                    bg-[#0B0B0B]
                    p-6
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#3E86A4]/25
                    hover:bg-[#101010]
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-5
                    "
                  >
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-[#3E86A4]/15
                        bg-[#53A6C7]/12
                        text-lg
                        font-bold
                        text-[#3E86A4]
                      "
                    >
                      {item.icon}
                    </div>

                    <span
                      className="
                        text-lg
                        text-white/20
                        transition
                        group-hover:translate-x-1
                        group-hover:text-[#3E86A4]
                      "
                    >
                      →
                    </span>
                  </div>

                  <h3
                    className="
                      mt-6
                      text-lg
                      font-bold
                      text-white
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      mt-2
                      max-w-sm
                      text-sm
                      leading-6
                      text-white/40
                    "
                  >
                    {
                      item.description
                    }
                  </p>
                </Link>
              )
            )}
          </div>
        </section>

        {/* ==================================================
            EVENT INFORMATION
        ================================================== */}

        <section
          className="
            mt-12
            grid
            gap-5
            xl:grid-cols-[1.4fr_0.6fr]
          "
        >
          {/* Description */}

          <div
            className="
              rounded-[24px]
              border
              border-white/[0.07]
              bg-[#0B0B0B]
              p-7
            "
          >
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#3E86A4]
              "
            >
              About
            </p>

            <h2
              className="
                mt-3
                text-xl
                font-bold
              "
            >
              Event Description
            </h2>

            <p
              className="
                mt-5
                max-w-4xl
                whitespace-pre-line
                text-[15px]
                leading-7
                text-white/50
              "
            >
              {event.description ||
                "No event description has been added."}
            </p>
          </div>

          {/* Event details */}

          <div
            className="
              rounded-[24px]
              border
              border-white/[0.07]
              bg-[#0B0B0B]
              p-7
            "
          >
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#3E86A4]
              "
            >
              Event Details
            </p>

            <div
              className="
                mt-6
                divide-y
                divide-white/[0.06]
              "
            >
              <DetailRow
                label="Venue"
                value={
                  event.venue ||
                  "Not specified"
                }
              />

              <DetailRow
                label="Capacity"
                value={String(
                  event.capacity ??
                    "—"
                )}
              />

              <DetailRow
                label="Status"
                value={
                  event.status
                }
              />

              <DetailRow
                label="Currency"
                value={
                  event.currency ||
                  "—"
                }
              />
            </div>
          </div>
        </section>

        {/* ==================================================
            SCHEDULE
        ================================================== */}

        <section
          className="
            mt-5
            grid
            gap-5
            md:grid-cols-2
          "
        >
          <DateCard
            eyebrow="EVENT START"
            date={startDate}
          />

          <DateCard
            eyebrow="EVENT END"
            date={endDate}
          />
        </section>

        <div className="h-12" />
      </div>
    </main>
  );
}

/* ==========================================================
   DETAIL ROW
========================================================== */

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-5
        py-4
        first:pt-0
        last:pb-0
      "
    >
      <span
        className="
          text-sm
          text-white/35
        "
      >
        {label}
      </span>

      <span
        className="
          text-right
          text-sm
          font-semibold
          text-white/80
        "
      >
        {value}
      </span>
    </div>
  );
}

/* ==========================================================
   DATE CARD
========================================================== */

function DateCard({
  eyebrow,
  date,
}: {
  eyebrow: string;
  date: Date;
}) {
  return (
    <div
      className="
        rounded-[22px]
        border
        border-white/[0.07]
        bg-[#0B0B0B]
        p-6
      "
    >
      <p
        className="
          text-[10px]
          font-bold
          tracking-[0.2em]
          text-white/30
        "
      >
        {eyebrow}
      </p>

      <p
        className="
          mt-4
          text-xl
          font-bold
          text-white
        "
      >
        {date.toLocaleDateString(
          undefined,
          {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        )}
      </p>

      <p
        className="
          mt-2
          text-sm
          font-medium
          text-[#3E86A4]
        "
      >
        {date.toLocaleTimeString(
          undefined,
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )}
      </p>
    </div>
  );
}