"use client";

interface DashboardStatsProps {
  ticketsSold: number;
  checkedIn: number;
  revenue: number;
  currency?: string;
  onlineStaff: number;
}

export default function DashboardStats({
  ticketsSold,
  checkedIn,
  revenue,
  currency = "₦",
  onlineStaff,
}: DashboardStatsProps) {
  return (
    <div
      className="
        grid
        gap-6
        sm:grid-cols-2
        xl:grid-cols-4
      "
    >
      <div className="rounded-xl border bg-white p-6">

        <p className="text-sm text-gray-500">
          Tickets Sold
        </p>

        <h2 className="mt-3 text-4xl font-bold">
          {ticketsSold.toLocaleString()}
        </h2>

      </div>

      <div className="rounded-xl border bg-white p-6">

        <p className="text-sm text-gray-500">
          Checked In
        </p>

        <h2 className="mt-3 text-4xl font-bold">
          {checkedIn.toLocaleString()}
        </h2>

      </div>

      <div className="rounded-xl border bg-white p-6">

        <p className="text-sm text-gray-500">
          Revenue
        </p>

        <h2 className="mt-3 text-4xl font-bold">
          {currency}{" "}
          {revenue.toLocaleString()}
        </h2>

      </div>

      <div className="rounded-xl border bg-white p-6">

        <div className="flex items-center justify-between">

          <p className="text-sm text-gray-500">
            Staff Online
          </p>

          <span
            className={`
              h-3
              w-3
              rounded-full
              ${
                onlineStaff > 0
                  ? "bg-green-500"
                  : "bg-gray-300"
              }
            `}
          />

        </div>

        <h2 className="mt-3 text-4xl font-bold">
          {onlineStaff}
        </h2>

      </div>
    </div>
  );
}