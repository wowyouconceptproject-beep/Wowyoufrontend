"use client";

import {
  BadgeCheck,
  Banknote,
  Ticket,
  UsersRound,
} from "lucide-react";

interface DashboardStatsProps {
  ticketsSold: number;
  checkedIn: number;
  revenue: number;
  currency?: string;
  onlineStaff: number;
}

/*
|--------------------------------------------------------------------------
| Currency
|--------------------------------------------------------------------------
*/

function currencySymbol(
  currency?: string,
) {
  switch (currency) {
    case "USD":
      return "$";

    case "EUR":
      return "€";

    case "GBP":
      return "£";

    case "NGN":
      return "₦";

    case "KES":
      return "KSh ";

    case "ZAR":
      return "R ";

    default:
      return currency ?? "";
  }
}

/*
|--------------------------------------------------------------------------
| Dashboard Stats
|--------------------------------------------------------------------------
*/

export default function DashboardStats({
  ticketsSold,
  checkedIn,
  revenue,
  currency = "NGN",
  onlineStaff,
}: DashboardStatsProps) {
  const symbol =
    currencySymbol(currency);

  return (
    <div
      className="
        grid
        overflow-hidden
        rounded-[24px]
        border
        border-divider
        bg-surface
        sm:grid-cols-2
        xl:grid-cols-4
      "
    >
      {/* Tickets Sold */}

      <StatCard
        label="Tickets Sold"
        value={ticketsSold.toLocaleString(
          "en-US",
        )}
        description="Total confirmed tickets"
        icon={Ticket}
      />

      {/* Checked In */}

      <StatCard
        label="Checked In"
        value={checkedIn.toLocaleString(
          "en-US",
        )}
        description="Attendees admitted"
        icon={BadgeCheck}
        divider
      />

      {/* Revenue */}

      <StatCard
        label="Revenue"
        value={`${symbol}${revenue.toLocaleString(
          "en-US",
        )}`}
        description="Gross ticket revenue"
        icon={Banknote}
        divider
        accent
      />

      {/* Staff Online */}

      <StatCard
        label="Staff Online"
        value={onlineStaff.toLocaleString(
          "en-US",
        )}
        description={
          onlineStaff > 0
            ? "Event team currently active"
            : "No staff currently online"
        }
        icon={UsersRound}
        divider
        live={onlineStaff > 0}
      />
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Stat Card
|--------------------------------------------------------------------------
*/

interface StatCardProps {
  label: string;
  value: string;
  description: string;
  icon: React.ElementType;
  divider?: boolean;
  accent?: boolean;
  live?: boolean;
}

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  divider = false,
  accent = false,
  live = false,
}: StatCardProps) {
  return (
    <div
      className={`
        group
        relative
        min-w-0
        p-6
        transition
        duration-300
        hover:bg-white/[0.03]
        md:p-7

        ${
          divider
            ? `
              border-t
              border-divider

              sm:border-l
              sm:border-t-0

              sm:[&:nth-child(3)]:border-l-0
              sm:[&:nth-child(3)]:border-t

              xl:[&:nth-child(3)]:border-l
              xl:[&:nth-child(3)]:border-t-0
            `
            : ""
        }
      `}
    >
      {/* Header */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-5
        "
      >
        <div>
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-muted
            "
          >
            {label}
          </p>
        </div>

        <div
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border

            ${
              accent
                ? `
                  border-primary/20
                  bg-primary/[0.08]
                  text-primary
                `
                : `
                  border-divider
                  bg-white/[0.04]
                  text-muted
                `
            }
          `}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>

      {/* Value */}

      <div
        className="
          mt-6
          flex
          items-center
          gap-3
        "
      >
        <h2
          className={`
            truncate
            text-3xl
            font-black
            tracking-tight
            md:text-4xl

            ${
              accent
                ? "text-primary"
                : "text-foreground"
            }
          `}
        >
          {value}
        </h2>

        {live && (
          <div
            className="
              flex
              items-center
              gap-1.5
              rounded-full
              border
              border-success/20
              bg-success/[0.08]
              px-2
              py-1
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-success
              "
            />

            <span
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-success
              "
            >
              Live
            </span>
          </div>
        )}
      </div>

      {/* Description */}

      <p
        className="
          mt-3
          text-xs
          leading-5
          text-muted
        "
      >
        {description}
      </p>

      {/* Revenue Accent */}

      {accent && (
        <div
          className="
            absolute
            bottom-0
            left-6
            right-6
            h-px
            bg-gradient-to-r
            from-transparent
            via-primary/40
            to-transparent
            opacity-0
            transition
            duration-300
            group-hover:opacity-100
          "
        />
      )}
    </div>
  );
}