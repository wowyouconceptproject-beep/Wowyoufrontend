"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import {
  getRevenue,
} from "@/services/revenue";

export default function RevenuePage() {
  const params =
    useParams();

  const [data, setData] =
    useState<any>(null);

  async function load() {
    const result =
      await getRevenue(
        params.id as string
      );

    if (
      result.success
    ) {
      setData(
        result.revenue
      );
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (!data) {
    return (
      <main className="p-8">
        Loading...
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Revenue Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-4 mb-8">

        <div className="border rounded p-6">
          <p>Total Revenue</p>

          <h2 className="text-3xl font-bold">
            ₦
            {data.totalRevenue.toLocaleString()}
          </h2>
        </div>

        <div className="border rounded p-6">
          <p>Tickets Sold</p>

          <h2 className="text-3xl font-bold">
            {data.ticketsSold}
          </h2>
        </div>

      </div>

      <div className="border rounded p-6">

        <h2 className="font-bold mb-4">
          Ticket Breakdown
        </h2>

        {data.breakdown.map(
          (ticket: any) => (
            <div
              key={
                ticket.name
              }
              className="border-b py-4"
            >
              <p className="font-bold">
                {ticket.name}
              </p>

              <p>
                Sold:
                {" "}
                {ticket.sold}
              </p>

              <p>
                Revenue:
                {" "}
                ₦
                {ticket.revenue.toLocaleString()}
              </p>
            </div>
          )
        )}

      </div>
    </main>
  );
}