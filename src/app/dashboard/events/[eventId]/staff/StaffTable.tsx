import {
  ShieldCheck,
  UserRoundCheck,
  UserRoundX,
  UsersRound,
} from "lucide-react";

import {
  StaffCard,
} from "./StaffCard";

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
  createdAt: string;
}

interface Props {
  eventId: string;
  staff: Staff[];
}

export function StaffTable({
  eventId,
  staff,
}: Props) {
  const totalStaff =
    staff.length;

  const activeStaff =
    staff.filter(
      (member) =>
        member.isActive &&
        !member.isRevoked
    ).length;

  const revokedStaff =
    staff.filter(
      (member) =>
        member.isRevoked
    ).length;

  const onlineStaff =
    staff.filter(
      (member) =>
        member.online &&
        member.isActive &&
        !member.isRevoked
    ).length;

  if (staff.length === 0) {
    return (
      <div
        className="
          relative
          overflow-hidden
          rounded-[28px]
          border
          border-dashed
          border-white/[0.10]
          bg-[#0D0D0D]
          px-6
          py-20
          text-center
        "
      >
        {/* Subtle glow */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-40
            w-40
            -translate-x-1/2
            rounded-full
            bg-[#3E86A4]/[0.06]
            blur-3xl
          "
        />

        <div className="relative">

          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              border
              border-[#3E86A4]/20
              bg-[#53A6C7]/12
            "
          >
            <UsersRound className="h-7 w-7 text-[#3E86A4]" />
          </div>

          <h2 className="mt-6 text-xl font-bold text-white">
            No Staff Yet
          </h2>

          <p
            className="
              mx-auto
              mt-2
              max-w-md
              text-sm
              leading-6
              text-white/40
            "
          >
            Build your event operations team by adding
            staff and assigning their roles, stations
            and access permissions.
          </p>

          <div
            className="
              mx-auto
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-white/[0.07]
              bg-white/[0.03]
              px-4
              py-2
              text-xs
              text-white/40
            "
          >
            <ShieldCheck className="h-3.5 w-3.5 text-[#3E86A4]" />

            Staff access is managed securely
          </div>

        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6">

      {/* Roster Summary */}

      <div
        className="
          overflow-hidden
          rounded-[24px]
          border
          border-white/[0.08]
          bg-[#0D0D0D]
        "
      >
        <div
          className="
            flex
            flex-col
            gap-5
            px-6
            py-5
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          {/* Heading */}

          <div>

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#3E86A4]/20
                  bg-[#53A6C7]/12
                "
              >
                <UsersRound className="h-4 w-4 text-[#3E86A4]" />
              </div>

              <div>

                <h2 className="font-bold text-white">
                  Event Operations Team
                </h2>

                <p className="mt-0.5 text-xs text-white/35">
                  Staff access, assignments and operational
                  status.
                </p>

              </div>

            </div>

          </div>

          {/* Stats */}

          <div className="flex flex-wrap items-center gap-2">

            <SummaryBadge
              icon={
                UsersRound
              }
              value={
                totalStaff
              }
              label="Total"
            />

            <SummaryBadge
              icon={
                UserRoundCheck
              }
              value={
                activeStaff
              }
              label="Active"
            />

            <SummaryBadge
              icon={
                ShieldCheck
              }
              value={
                onlineStaff
              }
              label="Online"
              highlight
            />

            {revokedStaff >
              0 && (
              <SummaryBadge
                icon={
                  UserRoundX
                }
                value={
                  revokedStaff
                }
                label="Revoked"
                danger
              />
            )}

          </div>

        </div>
      </div>

      {/* Staff count */}

      <div className="flex items-end justify-between gap-4 px-1">

        <div>

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.18em]
              text-white/30
            "
          >
            Staff Roster
          </p>

          <p className="mt-1 text-sm text-white/50">
            {totalStaff === 1
              ? "1 staff member assigned"
              : `${totalStaff} staff members assigned`}
          </p>

        </div>

        <p className="hidden text-xs text-white/25 sm:block">
          Select a staff member to manage access
        </p>

      </div>

      {/* Cards */}

      <div
        className="
          grid
          gap-5
          md:grid-cols-2
          2xl:grid-cols-3
        "
      >
        {staff.map(
          (member) => (
            <StaffCard
              key={
                member.id
              }
              eventId={
                eventId
              }
              staff={
                member
              }
            />
          )
        )}
      </div>

    </section>
  );
}

function SummaryBadge({
  icon: Icon,
  value,
  label,
  highlight = false,
  danger = false,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  highlight?: boolean;
  danger?: boolean;
}) {
  return (
    <div
      className={`
        flex
        items-center
        gap-2.5
        rounded-xl
        border
        px-3.5
        py-2.5
        ${
          danger
            ? "border-red-500/15 bg-red-500/[0.05]"
            : highlight
              ? "border-[#3E86A4]/15 bg-[#3E86A4]/[0.05]"
              : "border-white/[0.07] bg-white/[0.025]"
        }
      `}
    >

      <Icon
        className={`
          h-3.5
          w-3.5
          ${
            danger
              ? "text-red-400"
              : highlight
                ? "text-[#3E86A4]"
                : "text-white/35"
          }
        `}
      />

      <div className="flex items-baseline gap-1.5">

        <span
          className={`
            text-sm
            font-black
            ${
              danger
                ? "text-red-400"
                : highlight
                  ? "text-[#3E86A4]"
                  : "text-white"
            }
          `}
        >
          {value}
        </span>

        <span className="text-[11px] font-medium text-white/35">
          {label}
        </span>

      </div>

    </div>
  );
}