"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  Store,
  X,
} from "lucide-react";

import {
  getDiscovery,
} from "@/services/discovery";

import {
  getMyApplications,
} from "@/services/vendor";

import {
  Event,
} from "@/services/event";

import {
  VendorApplication,
} from "@/services/vendor";

import {
  useRealtime,
} from "@/hooks/useRealtime";

export default function VendorPortalPage() {
  const [
    events,
    setEvents,
  ] = useState<Event[]>([]);

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

  /*
  |--------------------------------------------------------------------------
  | Load Portal
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const [
        discovery,
        mine,
      ] = await Promise.all([
        getDiscovery(),
        getMyApplications(),
      ]);

      setEvents(
        discovery.trending ??
          [],
      );

      setApplications(
        mine.applications ??
          [],
      );
    } catch (error) {
      console.error(
        "Unable to load vendor portal:",
        error,
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Realtime
  |--------------------------------------------------------------------------
  */

  useRealtime({
    onVendorApplicationCreated: (
      application:
        VendorApplication,
    ) => {
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

    onVendorApplicationUpdated: (
      application:
        VendorApplication,
    ) => {
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

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">

        <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">

          <div className="animate-pulse">

            <div className="h-3 w-28 rounded-full bg-white/[0.05]" />

            <div className="mt-5 h-12 w-72 rounded-xl bg-white/[0.05]" />

            <div className="mt-5 h-4 w-full max-w-xl rounded-full bg-white/[0.04]" />

            <div className="mt-12 grid gap-4 md:grid-cols-3">

              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="h-40 rounded-[24px] border border-white/[0.05] bg-white/[0.025]"
                  />
                ),
              )}

            </div>

            <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="h-[430px] rounded-[26px] border border-white/[0.05] bg-white/[0.025]"
                  />
                ),
              )}

            </div>

          </div>

        </section>

      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  const pending =
    applications.filter(
      (application) =>
        application.status ===
        "PENDING",
    ).length;

  const approved =
    applications.filter(
      (application) =>
        application.status ===
        "APPROVED",
    ).length;

  const rejected =
    applications.filter(
      (application) =>
        application.status ===
        "REJECTED",
    ).length;

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* Header */}

      <section
        className="
          border-b
          border-white/[0.06]
          bg-gradient-to-b
          from-[#0D0D0D]
          to-[#050505]
        "
      >

        <div
          className="
            mx-auto
            max-w-7xl
            px-5
            pb-12
            pt-14
            md:px-8
            md:pb-16
            md:pt-20
          "
        >

          <div
            className="
              flex
              flex-col
              gap-8
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >

            <div>

              <div className="flex items-center gap-3">

                <span className="h-px w-8 bg-[#D4AF37]" />

                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.24em]
                    text-[#D4AF37]
                  "
                >
                  Vendor Portal
                </p>

              </div>

              <h1
                className="
                  mt-5
                  text-4xl
                  font-black
                  tracking-tight
                  md:text-5xl
                  lg:text-6xl
                "
              >
                Your Business.
                <br />

                <span className="text-white/35">
                  More Opportunities.
                </span>
              </h1>

              <p
                className="
                  mt-6
                  max-w-xl
                  text-sm
                  leading-7
                  text-white/40
                  md:text-base
                "
              >
                Track your vendor applications,
                manage approvals and discover events
                looking for businesses like yours.
              </p>

            </div>

            <Link
              href="/vendor/portal/applications"
              className="
                group
                inline-flex
                h-12
                shrink-0
                items-center
                justify-center
                gap-3
                rounded-xl
                border
                border-white/[0.1]
                bg-white/[0.03]
                px-5
                text-sm
                font-bold
                transition
                hover:border-white/[0.18]
                hover:bg-white/[0.06]
              "
            >
              My Applications

              <ArrowRight
                className="
                  h-4
                  w-4
                  text-white/40
                  transition-transform
                  group-hover:translate-x-1
                "
              />
            </Link>

          </div>

          {/* Stats */}

          <div
            className="
              mt-12
              grid
              overflow-hidden
              rounded-[24px]
              border
              border-white/[0.07]
              bg-[#0B0B0B]
              md:grid-cols-3
            "
          >

            <StatCard
              label="Pending Review"
              value={pending}
              icon={Clock3}
              description="Awaiting organizer decision"
            />

            <StatCard
              label="Approved"
              value={approved}
              icon={Check}
              description="Applications accepted"
              divider
            />

            <StatCard
              label="Not Approved"
              value={rejected}
              icon={X}
              description="Applications declined"
              divider
            />

          </div>

        </div>

      </section>

      {/* Marketplace */}

      <section
        className="
          mx-auto
          max-w-7xl
          px-5
          py-14
          md:px-8
          md:py-20
        "
      >

        {/* Section Header */}

        <div
          className="
            flex
            flex-col
            gap-6
            border-b
            border-white/[0.07]
            pb-8
            md:flex-row
            md:items-end
            md:justify-between
          "
        >

          <div>

            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.22em]
                text-[#D4AF37]
              "
            >
              Vendor Marketplace
            </p>

            <h2
              className="
                mt-3
                text-3xl
                font-black
                tracking-tight
                md:text-4xl
              "
            >
              Events Accepting Vendors
            </h2>

            <p className="mt-3 text-sm text-white/35">
              Find the right event for your business.
            </p>

          </div>

          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              text-white/30
            "
          >
            <Store className="h-4 w-4" />

            {events.length}{" "}
            {events.length === 1
              ? "opportunity"
              : "opportunities"}
          </div>

        </div>

        {/* Empty Marketplace */}

        {events.length === 0 ? (

          <div
            className="
              mt-8
              flex
              min-h-[340px]
              flex-col
              items-center
              justify-center
              rounded-[26px]
              border
              border-dashed
              border-white/[0.1]
              bg-white/[0.015]
              px-6
              text-center
            "
          >

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                border
                border-white/[0.07]
                bg-white/[0.03]
              "
            >
              <Store className="h-5 w-5 text-[#D4AF37]" />
            </div>

            <h3 className="mt-6 text-xl font-bold">
              No Vendor Opportunities Yet
            </h3>

            <p
              className="
                mt-2
                max-w-md
                text-sm
                leading-6
                text-white/30
              "
            >
              New events accepting vendor applications
              will appear here.
            </p>

          </div>

        ) : (

          <div
            className="
              mt-8
              grid
              gap-6
              md:grid-cols-2
              xl:grid-cols-3
            "
          >

            {events.map(
              (event) => (

                <article
                  key={event.id}
                  className="
                    group
                    overflow-hidden
                    rounded-[26px]
                    border
                    border-white/[0.07]
                    bg-[#0D0D0D]
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:border-white/[0.12]
                  "
                >

                  {/* Image */}

                  <div className="relative h-64 overflow-hidden">

                    <img
                      src={
                        event.coverImage ??
                        event.bannerUrl ??
                        "/images/placeholder-event.jpg"
                      }
                      alt={
                        event.title
                      }
                      className="
                        h-full
                        w-full
                        object-cover
                        transition
                        duration-700
                        group-hover:scale-[1.04]
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-[#0D0D0D]
                        via-transparent
                        to-transparent
                      "
                    />

                    <div
                      className="
                        absolute
                        left-5
                        top-5
                        rounded-full
                        border
                        border-white/10
                        bg-black/60
                        px-3
                        py-1.5
                        backdrop-blur-xl
                      "
                    >
                      <span
                        className="
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-[0.16em]
                          text-[#D4AF37]
                        "
                      >
                        Accepting Vendors
                      </span>
                    </div>

                  </div>

                  {/* Information */}

                  <div className="p-6">

                    <h3
                      className="
                        line-clamp-2
                        text-xl
                        font-black
                        leading-tight
                        tracking-tight
                      "
                    >
                      {event.title}
                    </h3>

                    <div className="mt-5 space-y-3">

                      <EventMeta
                        icon={
                          CalendarDays
                        }
                      >
                        {new Date(
                          event.startDate,
                        ).toLocaleDateString(
                          "en-US",
                          {
                            month:
                              "long",
                            day:
                              "numeric",
                            year:
                              "numeric",
                          },
                        )}
                      </EventMeta>

                      <EventMeta
                        icon={
                          MapPin
                        }
                      >
                        {event.venue}
                      </EventMeta>

                    </div>

                    <div
                      className="
                        mt-6
                        border-t
                        border-white/[0.07]
                        pt-5
                      "
                    >

                      <Link
                        href={`/vendor/apply/${event.id}`}
                        className="
                          group/button
                          flex
                          h-12
                          w-full
                          items-center
                          justify-between
                          rounded-xl
                          bg-[#D4AF37]
                          px-5
                          text-sm
                          font-black
                          text-black
                          transition
                          hover:bg-[#E0BE4A]
                        "
                      >
                        Apply as Vendor

                        <ArrowRight
                          className="
                            h-4
                            w-4
                            transition-transform
                            group-hover/button:translate-x-1
                          "
                        />
                      </Link>

                    </div>

                  </div>

                </article>

              ),
            )}

          </div>

        )}

      </section>

    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Stat Card
|--------------------------------------------------------------------------
*/

function StatCard({
  label,
  value,
  icon: Icon,
  description,
  divider = false,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  description: string;
  divider?: boolean;
}) {
  return (
    <div
      className={`
        relative
        p-6
        md:p-7
        ${
          divider
            ? "border-t border-white/[0.07] md:border-l md:border-t-0"
            : ""
        }
      `}
    >

      <div className="flex items-start justify-between">

        <div>

          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.15em]
              text-white/30
            "
          >
            {label}
          </p>

          <p
            className="
              mt-3
              text-4xl
              font-black
              tracking-tight
            "
          >
            {value}
          </p>

        </div>

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-white/[0.07]
            bg-white/[0.03]
          "
        >
          <Icon className="h-4 w-4 text-[#D4AF37]" />
        </div>

      </div>

      <p className="mt-5 text-xs text-white/25">
        {description}
      </p>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Event Metadata
|--------------------------------------------------------------------------
*/

function EventMeta({
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
        gap-3
        text-sm
        text-white/40
      "
    >
      <Icon className="h-4 w-4 shrink-0 text-white/25" />

      <span className="line-clamp-1">
        {children}
      </span>
    </div>
  );
}