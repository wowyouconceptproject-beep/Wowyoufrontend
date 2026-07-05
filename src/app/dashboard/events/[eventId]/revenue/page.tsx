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
    useParams<{
      id: string;
    }>();

  const eventId =
    params.id;

  const [data, setData] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  async function loadRevenue() {
    try {
      setLoading(true);

      const result =
        await getRevenue(
          eventId
        );

      if (
        result.success
      ) {
        setData(
          result.revenue
        );
      }
    } catch (error) {
      console.error(
        error
      );

      alert(
        "Unable to load revenue."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (eventId) {
      loadRevenue();
    }
  }, [eventId]);

  if (loading) {
    return (
      <main className="p-8">
        Loading revenue...
      </main>
    );
  }

  if (!data) {
    return (
      <main className="p-8">
        Revenue not available.
      </main>
    );
  }

  return (
    <main className="space-y-8 p-8">

      <div>

        <h1 className="text-3xl font-bold">
          Revenue Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Revenue overview for this
          event.
        </p>

      </div>

      <div className="grid gap-4 md:grid-cols-2">

        <div className="rounded-xl border p-6">

          <p className="text-sm text-gray-500">
            Total Revenue
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            ₦
            {data.totalRevenue.toLocaleString()}
          </h2>

        </div>

        <div className="rounded-xl border p-6">

          <p className="text-sm text-gray-500">
            Tickets Sold
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            {data.ticketsSold}
          </h2>

        </div>

      </div>

      <div className="rounded-xl border p-6">

        <h2 className="mb-6 text-xl font-bold">
          Ticket Breakdown
        </h2>

        {data.breakdown.length ===
        0 ? (

          <div className="rounded border border-dashed p-6 text-center text-gray-500">
            No ticket sales yet.
          </div>

        ) : (

          <div className="space-y-4">

            {data.breakdown.map(
              (
                ticket: any
              ) => (

                <div
                  key={
                    ticket.name
                  }
                  className="flex items-center justify-between rounded-lg border p-4"
                >

                  <div>

                    <h3 className="font-semibold">
                      {
                        ticket.name
                      }
                    </h3>

                    <p className="text-sm text-gray-500">
                      Sold:{" "}
                      {
                        ticket.sold
                      }
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-sm text-gray-500">
                      Revenue
                    </p>

                    <p className="text-lg font-bold">
                      ₦
                      {ticket.revenue.toLocaleString()}
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </main>
  );
}