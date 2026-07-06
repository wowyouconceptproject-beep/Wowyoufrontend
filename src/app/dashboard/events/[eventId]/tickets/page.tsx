"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import {
  createTicket,
  getTickets,
} from "@/services/ticket";

export default function TicketsPage() {
  const params =
    useParams<{
      eventId: string;
    }>();

  const eventId =
    params.eventId;

  const [
    tickets,
    setTickets,
  ] = useState<any[]>([]);

  const [
    currency,
    setCurrency,
  ] = useState("USD");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    name,
    setName,
  ] = useState("");

  const [
    price,
    setPrice,
  ] = useState("");

  const [
    quantity,
    setQuantity,
  ] = useState("");

  function currencySymbol(
    currency: string
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
        return currency;
    }
  }

  async function loadTickets() {
    try {
      setLoading(true);

      console.log(
        "Loading tickets for:",
        eventId
      );

      const result =
        await getTickets(
          eventId
        );

      console.log(
        "Tickets response:",
        result
      );

      if (
        result.success
      ) {
        setTickets(
          result.tickets ?? []
        );

        if (
          result.currency
        ) {
          setCurrency(
            result.currency
          );
        }
      }

    } catch (error) {

      console.error(
        "Ticket load failed:",
        error
      );

      alert(
        "Unable to load tickets."
      );

    } finally {

      setLoading(false);

    }
  }

  async function submit() {
    try {
      const result =
        await createTicket(
          eventId,
          {
            name,
            price:
              Number(
                price
              ),
            quantity:
              Number(
                quantity
              ),
          }
        );

      if (
        !result.success
      ) {
        alert(
          result.message ??
            "Unable to create ticket."
        );

        return;
      }

      setName("");
      setPrice("");
      setQuantity("");

      await loadTickets();

    } catch (error: any) {

      alert(
        error.message ??
          "Failed to create ticket."
      );

    }
  }

  useEffect(() => {

    if (!eventId) {
      return;
    }

    loadTickets();

  }, [eventId]);

  if (loading) {
    return (
      <main className="p-8">
        Loading tickets...
      </main>
    );
  }

  return (
    <main className="space-y-8 p-8">

      <div>

        <h1 className="text-3xl font-bold">
          Ticket Management
        </h1>

        <p className="mt-2 text-gray-500">
          Currency: {currency}
        </p>

      </div>

      <div className="rounded-xl border p-6">

        <h2 className="mb-4 text-xl font-bold">
          Create Ticket
        </h2>

        <input
          className="mb-4 w-full rounded border p-3"
          placeholder="Ticket Name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
        />

        <input
          type="number"
          className="mb-4 w-full rounded border p-3"
          placeholder={`Price (${currency})`}
          value={price}
          onChange={(e) =>
            setPrice(
              e.target.value
            )
          }
        />

        <input
          type="number"
          className="mb-6 w-full rounded border p-3"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) =>
            setQuantity(
              e.target.value
            )
          }
        />

        <button
          onClick={
            submit
          }
          className="rounded bg-black px-6 py-3 text-white"
        >
          Create Ticket
        </button>

      </div>

      <div>

        <h2 className="mb-4 text-2xl font-bold">
          Existing Tickets
        </h2>

        {tickets.length ===
        0 ? (

          <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">

            No tickets created yet.

          </div>

        ) : (

          <div className="space-y-4">

            {tickets.map(
              (
                ticket
              ) => (

                <div
                  key={
                    ticket.id
                  }
                  className="rounded-xl border p-5"
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="text-lg font-bold">
                        {
                          ticket.name
                        }
                      </h3>

                    </div>

                    <div className="text-xl font-bold">

                      {currencySymbol(
                        currency
                      )}

                      {Number(
                        ticket.price
                      ).toLocaleString()}

                    </div>

                  </div>

                  <div className="mt-5 flex flex-wrap gap-6 text-sm text-gray-500">

                    <span>
                      Quantity:{" "}
                      {
                        ticket.quantity
                      }
                    </span>

                    <span>
                      Sold:{" "}
                      {ticket.sold ??
                        0}
                    </span>

                    <span>
                      Remaining:{" "}
                      {(ticket.quantity ??
                        0) -
                        (ticket.sold ??
                          0)}
                    </span>

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