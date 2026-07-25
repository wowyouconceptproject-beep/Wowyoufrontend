"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import {
  Users,
  UserCheck,
  TicketCheck,
  Search,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import {
  getAttendees,
} from "@/services/attendees";

import {
  AttendeesTable,
} from "./AttendeesTable";

export default function AttendeesPage() {
  const params =
    useParams<{
      eventId: string;
    }>();

  const eventId =
    params.eventId;

  const [
    attendees,
    setAttendees,
  ] = useState<any[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  async function loadAttendees() {
    try {
      setLoading(true);

      const result =
        await getAttendees(
          eventId
        );

      if (
        result.success
      ) {
        setAttendees(
          result.attendees ?? []
        );

        setError("");
      }
    } catch (err: any) {
      console.error(
        "Attendees page error:",
        err
      );

      setError(
        err.message ??
          "Unable to load attendees."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (eventId) {
      loadAttendees();
    }
  }, [eventId]);

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  const filteredAttendees =
    attendees.filter(
      (attendee) => {
        const query =
          search
            .trim()
            .toLowerCase();

        if (!query) {
          return true;
        }

        const values = [
          attendee.name,
          attendee.firstName,
          attendee.lastName,
          attendee.email,
          attendee.phone,
          attendee.ticketName,
          attendee.ticket?.name,
        ];

        return values.some(
          (value) =>
            String(
              value ?? ""
            )
              .toLowerCase()
              .includes(
                query
              )
        );
      }
    );

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

              <div className="h-3 w-32 rounded-full bg-white/[0.06]" />

              <div className="h-10 w-64 rounded-lg bg-white/[0.06]" />

              <div className="h-4 w-96 max-w-full rounded bg-white/[0.04]" />

            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">

              {[
                1,
                2,
                3,
              ].map(
                (item) => (
                  <div
                    key={
                      item
                    }
                    className="h-36 rounded-[24px] bg-white/[0.04]"
                  />
                )
              )}

            </div>

            <div className="mt-6 h-96 rounded-[28px] bg-white/[0.04]" />

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

          <div>

            <div className="flex items-center gap-2">

              <span className="h-px w-8 bg-[#D4AF37]" />

              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
                Guest Management
              </p>

            </div>

            <h1 className="mt-4 text-4xl font-black tracking-tight">
              Attendees
            </h1>

          </div>

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
              Failed to Load Attendees
            </h2>

            <p className="mt-2 max-w-lg text-sm leading-6 text-white/40">
              {error}
            </p>

            <button
              onClick={
                loadAttendees
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
  | Page
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
                Guest Management
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
              Attendees
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
              View the people attending your event and manage
              your guest list from one place.
            </p>

          </div>

          <div
            className="
              inline-flex
              w-fit
              items-center
              gap-3
              rounded-xl
              border
              border-white/[0.07]
              bg-white/[0.025]
              px-4
              py-3
            "
          >

            <Users className="h-4 w-4 text-[#D4AF37]" />

            <div>

              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-white/30
                "
              >
                Guest List
              </p>

              <p className="mt-0.5 text-sm font-bold">
                {attendees.length}{" "}
                {attendees.length ===
                1
                  ? "Attendee"
                  : "Attendees"}
              </p>

            </div>

          </div>

        </header>

        {/* Overview */}

        <section className="grid gap-4 md:grid-cols-3">

          <StatCard
            icon={
              Users
            }
            label="Total Attendees"
            value={
              attendees.length
            }
            description="People currently registered for this event."
          />

          <StatCard
            icon={
              TicketCheck
            }
            label="Guest Records"
            value={
              attendees.length
            }
            description="Attendee records available to event operations."
          />

          <StatCard
            icon={
              UserCheck
            }
            label="Event Access"
            value="Active"
            description="Guest management is available for this event."
          />

        </section>

        {/* Attendee Directory */}

        <section
          className="
            overflow-hidden
            rounded-[28px]
            border
            border-white/[0.08]
            bg-[#0D0D0D]
          "
        >

          {/* Directory Header */}

          <div
            className="
              flex
              flex-col
              gap-5
              border-b
              border-white/[0.07]
              px-6
              py-6
              lg:flex-row
              lg:items-center
              lg:justify-between
              md:px-7
            "
          >

            <div>

              <h2 className="text-lg font-bold">
                Attendee Directory
              </h2>

              <p className="mt-1 text-sm text-white/35">
                Everyone registered for this event.
              </p>

            </div>

            {attendees.length >
              0 && (
              <div
                className="
                  relative
                  w-full
                  lg:w-[320px]
                "
              >

                <Search
                  className="
                    absolute
                    left-4
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-white/25
                  "
                />

                <input
                  type="text"
                  value={
                    search
                  }
                  onChange={(
                    e
                  ) =>
                    setSearch(
                      e.target
                        .value
                    )
                  }
                  placeholder="Search attendees..."
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-white/[0.08]
                    bg-white/[0.035]
                    pl-11
                    pr-4
                    text-sm
                    text-white
                    outline-none
                    transition
                    placeholder:text-white/25
                    focus:border-[#D4AF37]/40
                    focus:bg-white/[0.05]
                  "
                />

              </div>
            )}

          </div>

          {/* Empty */}

          {attendees.length ===
          0 ? (

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

                <Users className="relative h-8 w-8 text-[#D4AF37]" />

              </div>

              <h2 className="mt-6 text-xl font-bold">
                No Attendees Yet
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
                Your guest list is currently empty. Attendees
                will automatically appear here once tickets are
                purchased.
              </p>

            </div>

          ) : filteredAttendees
              .length ===
            0 ? (

            <div className="px-6 py-16 text-center">

              <div
                className="
                  mx-auto
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
                <Search className="h-5 w-5 text-white/35" />
              </div>

              <h3 className="mt-5 font-bold">
                No Matching Attendees
              </h3>

              <p className="mt-2 text-sm text-white/35">
                No attendee matches &quot;{search}&quot;.
              </p>

              <button
                onClick={() =>
                  setSearch("")
                }
                className="
                  mt-5
                  text-sm
                  font-semibold
                  text-[#D4AF37]
                  transition
                  hover:text-[#E7C85A]
                "
              >
                Clear search
              </button>

            </div>

          ) : (

            <div className="p-4 md:p-6">

              <AttendeesTable
                attendees={
                  filteredAttendees
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
| Stat Card
|--------------------------------------------------------------------------
*/

function StatCard({
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