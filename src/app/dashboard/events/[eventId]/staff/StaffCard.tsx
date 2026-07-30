"use client";

import {
  useState,
} from "react";

import {
  ChevronRight,
  Clock3,
  KeyRound,
  MapPin,
  ShieldCheck,
  Smartphone,
  UserRound,
  Wifi,
  WifiOff,
} from "lucide-react";

import {
  AccessCodeDialog,
} from "./AccessCodeDialog";

interface Staff {
  id: string;

  name: string;

  phone?: string;

  email?: string;

  role: string;

  station?: string;

  accessCode: string;

  permissions: string[];

  isActive: boolean;

  isRevoked: boolean;

  online?: boolean;

  lastUsedAt?: string;
}

interface Props {
  eventId: string;

  staff: Staff;
}

function formatRole(
  role: string
) {
  return role
    .replaceAll(
      "_",
      " "
    )
    .toLowerCase()
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase()
    );
}

export function StaffCard({
  eventId,
  staff,
}: Props) {
  const [
    open,
    setOpen,
  ] = useState(false);

  const accountStatus =
    staff.isRevoked
      ? "Revoked"
      : staff.isActive
        ? "Active"
        : "Disabled";

  const canBeOnline =
    staff.isActive &&
    !staff.isRevoked;

  const isOnline =
    canBeOnline &&
    staff.online === true;

  const initials =
    staff.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (part) =>
          part[0]
      )
      .join("")
      .toUpperCase();

  return (
    <>
      <article
        onClick={() =>
          setOpen(true)
        }
        className="
          group
          relative
          cursor-pointer
          overflow-hidden
          rounded-[26px]
          border
          border-white/[0.08]
          bg-[#0D0D0D]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-[#D4AF37]/25
          hover:shadow-2xl
          hover:shadow-black/30
        "
      >

        {/* Top accent */}

        <div
          className="
            absolute
            inset-x-0
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-[#D4AF37]/50
            to-transparent
            opacity-0
            transition
            duration-300
            group-hover:opacity-100
          "
        />

        <div className="p-6">

          {/* Identity */}

          <div className="flex items-start justify-between gap-4">

            <div className="flex min-w-0 items-center gap-4">

              <div className="relative shrink-0">

                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-[#D4AF37]/20
                    bg-[#0F766E]/10
                    text-sm
                    font-black
                    tracking-wider
                    text-[#D4AF37]
                  "
                >
                  {initials ||
                    (
                      <UserRound className="h-5 w-5" />
                    )}
                </div>

                {/* Presence dot */}

                <span
                  className={`
                    absolute
                    -bottom-1
                    -right-1
                    h-4
                    w-4
                    rounded-full
                    border-[3px]
                    border-[#0D0D0D]
                    ${
                      isOnline
                        ? "bg-emerald-500"
                        : "bg-white/20"
                    }
                  `}
                />

              </div>

              <div className="min-w-0">

                <h3 className="truncate text-lg font-bold tracking-tight text-white">
                  {staff.name}
                </h3>

                <div className="mt-1 flex flex-wrap items-center gap-2">

                  <span className="text-sm text-white/45">
                    {formatRole(
                      staff.role
                    )}
                  </span>

                  <span className="h-1 w-1 rounded-full bg-white/20" />

                  <span
                    className={`
                      text-xs
                      font-semibold
                      ${
                        staff.isRevoked
                          ? "text-red-400"
                          : staff.isActive
                            ? "text-emerald-400"
                            : "text-teal-500"
                      }
                    `}
                  >
                    {accountStatus}
                  </span>

                </div>

              </div>

            </div>

            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.07]
                bg-white/[0.03]
                text-white/30
                transition
                group-hover:border-[#D4AF37]/20
                group-hover:text-[#D4AF37]
              "
            >
              <ChevronRight className="h-4 w-4" />
            </div>

          </div>

          {/* Assignment */}

          <div
            className="
              mt-6
              grid
              grid-cols-2
              overflow-hidden
              rounded-2xl
              border
              border-white/[0.07]
              bg-white/[0.025]
            "
          >

            <div className="border-r border-white/[0.07] p-4">

              <div className="flex items-center gap-2 text-white/35">

                <MapPin className="h-3.5 w-3.5" />

                <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                  Station
                </span>

              </div>

              <p className="mt-2 truncate text-sm font-semibold text-white/90">
                {staff.station ??
                  "Unassigned"}
              </p>

            </div>

            <div className="p-4">

              <div className="flex items-center gap-2 text-white/35">

                {isOnline ? (
                  <Wifi className="h-3.5 w-3.5" />
                ) : (
                  <WifiOff className="h-3.5 w-3.5" />
                )}

                <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                  Presence
                </span>

              </div>

              <div className="mt-2 flex items-center gap-2">

                <span
                  className={`
                    h-2
                    w-2
                    rounded-full
                    ${
                      isOnline
                        ? "bg-emerald-500"
                        : "bg-white/20"
                    }
                  `}
                />

                <p
                  className={`
                    text-sm
                    font-semibold
                    ${
                      isOnline
                        ? "text-emerald-400"
                        : "text-white/60"
                    }
                  `}
                >
                  {isOnline
                    ? "Online"
                    : "Offline"}
                </p>

              </div>

            </div>

          </div>

          {/* Permissions */}

          <div className="mt-6">

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-2">

                <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />

                <p className="text-sm font-bold text-white">
                  Permissions
                </p>

              </div>

              <span className="text-xs text-white/30">
                {
                  staff
                    .permissions
                    .length
                }{" "}
                assigned
              </span>

            </div>

            {staff.permissions
              .length ===
            0 ? (

              <div
                className="
                  mt-3
                  rounded-xl
                  border
                  border-dashed
                  border-white/[0.08]
                  px-4
                  py-3
                "
              >
                <p className="text-xs text-white/35">
                  No additional permissions assigned.
                </p>
              </div>

            ) : (

              <div className="mt-3 flex flex-wrap gap-2">

                {staff.permissions
                  .slice(
                    0,
                    3
                  )
                  .map(
                    (
                      permission
                    ) => (

                      <span
                        key={
                          permission
                        }
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-full
                          border
                          border-[#D4AF37]/15
                          bg-[#0F766E]/[0.06]
                          px-3
                          py-1.5
                          text-xs
                          font-medium
                          text-white/65
                        "
                      >

                        <ShieldCheck className="h-3 w-3 text-[#D4AF37]" />

                        {formatRole(
                          permission
                        )}

                      </span>

                    )
                  )}

                {staff.permissions
                  .length >
                  3 && (

                  <span
                    className="
                      inline-flex
                      items-center
                      rounded-full
                      border
                      border-white/[0.07]
                      bg-white/[0.03]
                      px-3
                      py-1.5
                      text-xs
                      font-medium
                      text-white/40
                    "
                  >
                    +
                    {staff
                      .permissions
                      .length -
                      3}{" "}
                    more
                  </span>

                )}

              </div>

            )}

          </div>

        </div>

        {/* Footer */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            border-t
            border-white/[0.07]
            bg-black/20
            px-6
            py-4
          "
        >

          <div className="flex min-w-0 items-center gap-2">

            {staff.lastUsedAt ? (
              <Clock3 className="h-3.5 w-3.5 shrink-0 text-white/30" />
            ) : (
              <Smartphone className="h-3.5 w-3.5 shrink-0 text-white/30" />
            )}

            <span className="truncate text-xs text-white/35">

              {staff.lastUsedAt
                ? `Last active ${new Date(
                    staff.lastUsedAt
                  ).toLocaleString()}`
                : "Never logged in"}

            </span>

          </div>

          <div
            className="
              flex
              shrink-0
              items-center
              gap-1.5
              text-xs
              font-semibold
              text-[#D4AF37]/70
              transition
              group-hover:text-[#D4AF37]
            "
          >

            <KeyRound className="h-3.5 w-3.5" />

            Manage

          </div>

        </div>

      </article>

      <AccessCodeDialog
        open={open}
        onOpenChange={
          setOpen
        }
        eventId={
          eventId
        }
        staff={
          staff
        }
      />

    </>
  );
}