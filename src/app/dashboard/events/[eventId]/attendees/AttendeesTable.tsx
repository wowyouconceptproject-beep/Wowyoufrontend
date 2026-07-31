"use client";

import {
  useState,
} from "react";

import {
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  Ticket,
  Users,
} from "lucide-react";

interface Attendee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  checkedIn: boolean;
  checkedInAt?: string;
  ticketType: string;
}

interface Props {
  attendees: Attendee[];
}

type StatusFilter =
  | "ALL"
  | "CHECKED_IN"
  | "PENDING";

export function AttendeesTable({
  attendees,
}: Props) {
  const [
    status,
    setStatus,
  ] = useState<StatusFilter>(
    "ALL"
  );

  /*
  |--------------------------------------------------------------------------
  | Counts
  |--------------------------------------------------------------------------
  */

  const checkedInCount =
    attendees.filter(
      (attendee) =>
        attendee.checkedIn
    ).length;

  const pendingCount =
    attendees.length -
    checkedInCount;

  /*
  |--------------------------------------------------------------------------
  | Filter
  |--------------------------------------------------------------------------
  */

  const filtered =
    attendees.filter(
      (attendee) => {
        if (
          status ===
          "CHECKED_IN"
        ) {
          return attendee.checkedIn;
        }

        if (
          status ===
          "PENDING"
        ) {
          return !attendee.checkedIn;
        }

        return true;
      }
    );

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  function initials(
    firstName: string,
    lastName: string
  ) {
    return `${firstName?.[0] ?? ""}${
      lastName?.[0] ?? ""
    }`.toUpperCase();
  }

  function formatCheckInTime(
    date?: string
  ) {
    if (!date) {
      return null;
    }

    return new Date(
      date
    ).toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  }

  return (
    <div className="space-y-6">

      {/* Status Filters */}

      <div
        className="
          flex
          flex-col
          gap-4
          border-b
          border-white/[0.06]
          pb-6
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <div
          className="
            flex
            w-fit
            flex-wrap
            items-center
            gap-1
            rounded-xl
            border
            border-white/[0.07]
            bg-black/30
            p-1
          "
        >

          <FilterButton
            active={
              status === "ALL"
            }
            onClick={() =>
              setStatus("ALL")
            }
            label="All"
            count={
              attendees.length
            }
          />

          <FilterButton
            active={
              status ===
              "CHECKED_IN"
            }
            onClick={() =>
              setStatus(
                "CHECKED_IN"
              )
            }
            label="Checked In"
            count={
              checkedInCount
            }
          />

          <FilterButton
            active={
              status ===
              "PENDING"
            }
            onClick={() =>
              setStatus(
                "PENDING"
              )
            }
            label="Pending"
            count={
              pendingCount
            }
          />

        </div>

        <p
          className="
            text-xs
            font-medium
            text-white/30
          "
        >
          Showing{" "}
          <span className="text-white/60">
            {filtered.length}
          </span>{" "}
          of{" "}
          <span className="text-white/60">
            {attendees.length}
          </span>{" "}
          attendees
        </p>

      </div>

      {/* Desktop Table */}

      <div
        className="
          hidden
          overflow-hidden
          rounded-[20px]
          border
          border-white/[0.07]
          bg-black/20
          md:block
        "
      >

        <table className="w-full border-collapse">

          <thead>

            <tr
              className="
                border-b
                border-white/[0.07]
                bg-white/[0.025]
              "
            >

              <TableHeading>
                Attendee
              </TableHeading>

              <TableHeading>
                Ticket
              </TableHeading>

              <TableHeading>
                Status
              </TableHeading>

              <TableHeading>
                Check In
              </TableHeading>

            </tr>

          </thead>

          <tbody>

            {filtered.map(
              (
                attendee,
                index
              ) => (

                <tr
                  key={
                    attendee.id
                  }
                  className={`
                    group
                    transition-colors
                    hover:bg-white/[0.025]
                    ${
                      index !==
                      filtered.length -
                        1
                        ? "border-b border-white/[0.055]"
                        : ""
                    }
                  `}
                >

                  {/* Attendee */}

                  <td className="px-5 py-5">

                    <div className="flex items-center gap-4">

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
                          bg-[#3E86A4]/[0.06]
                          text-xs
                          font-black
                          tracking-wide
                          text-[#3E86A4]
                        "
                      >
                        {initials(
                          attendee.firstName,
                          attendee.lastName
                        )}
                      </div>

                      <div className="min-w-0">

                        <p
                          className="
                            truncate
                            text-sm
                            font-bold
                            text-white
                          "
                        >
                          {
                            attendee.firstName
                          }{" "}
                          {
                            attendee.lastName
                          }
                        </p>

                        <div
                          className="
                            mt-1.5
                            flex
                            items-center
                            gap-1.5
                            text-xs
                            text-white/35
                          "
                        >
                          <Mail className="h-3 w-3 shrink-0" />

                          <span className="truncate">
                            {
                              attendee.email
                            }
                          </span>
                        </div>

                        {attendee.phone && (
                          <div
                            className="
                              mt-1
                              flex
                              items-center
                              gap-1.5
                              text-xs
                              text-white/25
                            "
                          >
                            <Phone className="h-3 w-3 shrink-0" />

                            <span>
                              {
                                attendee.phone
                              }
                            </span>
                          </div>
                        )}

                      </div>

                    </div>

                  </td>

                  {/* Ticket */}

                  <td className="px-5 py-5">

                    <div
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-lg
                        border
                        border-white/[0.07]
                        bg-white/[0.025]
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-white/65
                      "
                    >
                      <Ticket className="h-3.5 w-3.5 text-[#3E86A4]" />

                      {
                        attendee.ticketType
                      }
                    </div>

                  </td>

                  {/* Status */}

                  <td className="px-5 py-5">

                    {attendee.checkedIn ? (

                      <div
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-full
                          border
                          border-emerald-500/15
                          bg-emerald-500/[0.07]
                          px-3
                          py-1.5
                        "
                      >

                        <span
                          className="
                            h-1.5
                            w-1.5
                            rounded-full
                            bg-emerald-400
                          "
                        />

                        <span
                          className="
                            text-xs
                            font-bold
                            text-emerald-400
                          "
                        >
                          Checked In
                        </span>

                      </div>

                    ) : (

                      <div
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-full
                          border
                          border-[#3E86A4]/15
                          bg-[#3E86A4]/[0.06]
                          px-3
                          py-1.5
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

                        <span
                          className="
                            text-xs
                            font-bold
                            text-[#3E86A4]
                          "
                        >
                          Pending
                        </span>

                      </div>

                    )}

                  </td>

                  {/* Check In */}

                  <td className="px-5 py-5">

                    {attendee.checkedInAt ? (

                      <div>

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            font-semibold
                            text-white/70
                          "
                        >
                          <Clock3 className="h-3.5 w-3.5 text-white/25" />

                          {formatCheckInTime(
                            attendee.checkedInAt
                          )}
                        </div>

                        <p className="mt-1 text-[11px] text-white/25">
                          {new Date(
                            attendee.checkedInAt
                          ).toLocaleDateString(
                            "en-US",
                            {
                              month:
                                "short",
                              day: "numeric",
                            }
                          )}
                        </p>

                      </div>

                    ) : (

                      <span className="text-sm text-white/20">
                        Not checked in
                      </span>

                    )}

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

        {filtered.length ===
          0 && (
          <EmptyFilter />
        )}

      </div>

      {/* Mobile Cards */}

      <div className="space-y-3 md:hidden">

        {filtered.map(
          (attendee) => (

            <div
              key={
                attendee.id
              }
              className="
                rounded-[20px]
                border
                border-white/[0.07]
                bg-black/20
                p-5
              "
            >

              <div className="flex items-start gap-3">

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
                    bg-[#3E86A4]/[0.06]
                    text-xs
                    font-black
                    text-[#3E86A4]
                  "
                >
                  {initials(
                    attendee.firstName,
                    attendee.lastName
                  )}
                </div>

                <div className="min-w-0 flex-1">

                  <h3 className="font-bold">
                    {
                      attendee.firstName
                    }{" "}
                    {
                      attendee.lastName
                    }
                  </h3>

                  <p
                    className="
                      mt-1
                      truncate
                      text-xs
                      text-white/35
                    "
                  >
                    {
                      attendee.email
                    }
                  </p>

                </div>

                {attendee.checkedIn ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                ) : (
                  <Clock3 className="h-5 w-5 shrink-0 text-[#3E86A4]" />
                )}

              </div>

              <div
                className="
                  mt-5
                  grid
                  grid-cols-2
                  gap-3
                  border-t
                  border-white/[0.06]
                  pt-4
                "
              >

                <MobileField
                  label="Ticket"
                  value={
                    attendee.ticketType
                  }
                />

                <MobileField
                  label="Status"
                  value={
                    attendee.checkedIn
                      ? "Checked In"
                      : "Pending"
                  }
                  highlighted={
                    attendee.checkedIn
                  }
                />

                {attendee.phone && (
                  <MobileField
                    label="Phone"
                    value={
                      attendee.phone
                    }
                  />
                )}

                <MobileField
                  label="Check In"
                  value={
                    formatCheckInTime(
                      attendee.checkedInAt
                    ) ??
                    "Not yet"
                  }
                />

              </div>

            </div>

          )
        )}

        {filtered.length ===
          0 && (
          <div
            className="
              rounded-[20px]
              border
              border-dashed
              border-white/[0.08]
            "
          >
            <EmptyFilter />
          </div>
        )}

      </div>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Filter Button
|--------------------------------------------------------------------------
*/

function FilterButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        items-center
        gap-2
        rounded-lg
        px-3.5
        py-2
        text-xs
        font-bold
        transition-all
        ${
          active
            ? "bg-[#3E86A4] text-white"
            : "text-white/40 hover:bg-white/[0.05] hover:text-white"
        }
      `}
    >
      {label}

      <span
        className={`
          rounded-md
          px-1.5
          py-0.5
          text-[10px]
          ${
            active
              ? "bg-black/10 text-white/70"
              : "bg-white/[0.06] text-white/30"
          }
        `}
      >
        {count}
      </span>

    </button>
  );
}

/*
|--------------------------------------------------------------------------
| Table Heading
|--------------------------------------------------------------------------
*/

function TableHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th
      className="
        px-5
        py-4
        text-left
        text-[10px]
        font-bold
        uppercase
        tracking-[0.16em]
        text-white/25
      "
    >
      {children}
    </th>
  );
}

/*
|--------------------------------------------------------------------------
| Mobile Field
|--------------------------------------------------------------------------
*/

function MobileField({
  label,
  value,
  highlighted = false,
}: {
  label: string;
  value: string;
  highlighted?: boolean;
}) {
  return (
    <div>

      <p
        className="
          text-[9px]
          font-bold
          uppercase
          tracking-[0.16em]
          text-white/25
        "
      >
        {label}
      </p>

      <p
        className={`
          mt-1.5
          text-xs
          font-semibold
          ${
            highlighted
              ? "text-emerald-400"
              : "text-white/65"
          }
        `}
      >
        {value}
      </p>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Empty Filter
|--------------------------------------------------------------------------
*/

function EmptyFilter() {
  return (
    <div className="px-6 py-16 text-center">

      <div
        className="
          mx-auto
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-xl
          border
          border-white/[0.07]
          bg-white/[0.025]
        "
      >
        <Users className="h-5 w-5 text-white/25" />
      </div>

      <h3 className="mt-4 text-sm font-bold">
        No Attendees Found
      </h3>

      <p className="mt-1.5 text-xs text-white/30">
        There are no attendees matching this status.
      </p>

    </div>
  );
}