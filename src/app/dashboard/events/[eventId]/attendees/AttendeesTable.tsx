"use client";

import { useState } from "react";

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

export function AttendeesTable({
  attendees,
}: Props) {
  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<
      "ALL" | "CHECKED_IN" | "PENDING"
    >("ALL");

  const filtered =
    attendees.filter((a) => {
      const matchesSearch =
        `${a.firstName} ${a.lastName}`
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        a.email
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesStatus =
        status === "ALL"
          ? true
          : status ===
            "CHECKED_IN"
          ? a.checkedIn
          : !a.checkedIn;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  return (
    <div className="space-y-6">

      <div className="flex gap-3">

        <button
          onClick={() =>
            setStatus("ALL")
          }
          className="rounded border px-4 py-2"
        >
          All
        </button>

        <button
          onClick={() =>
            setStatus(
              "CHECKED_IN"
            )
          }
          className="rounded border px-4 py-2"
        >
          Checked In
        </button>

        <button
          onClick={() =>
            setStatus(
              "PENDING"
            )
          }
          className="rounded border px-4 py-2"
        >
          Pending
        </button>

      </div>

      <input
        placeholder="Search attendee..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        className="w-full rounded-lg border p-3"
      />

      <div className="overflow-hidden rounded-xl border">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="p-4 text-left">
                Name
              </th>

              <th className="text-left">
                Ticket
              </th>

              <th className="text-left">
                Status
              </th>

              <th className="text-left">
                Check In
              </th>

            </tr>

          </thead>

          <tbody>

            {filtered.map(
              (attendee) => (
                <tr
                  key={attendee.id}
                  className="border-t"
                >
                  <td className="p-4">

                    <div className="font-semibold">
                      {attendee.firstName}{" "}
                      {attendee.lastName}
                    </div>

                    <div className="text-sm text-gray-500">
                      {attendee.email}
                    </div>

                  </td>

                  <td>
                    {attendee.ticketType}
                  </td>

                  <td>

                    {attendee.checkedIn ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                        Checked In
                      </span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
                        Pending
                      </span>
                    )}

                  </td>

                  <td>

                    {attendee.checkedInAt
                      ? new Date(
                          attendee.checkedInAt
                        ).toLocaleTimeString()
                      : "-"}

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}