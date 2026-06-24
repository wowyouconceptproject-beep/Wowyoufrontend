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
    useParams();

  const eventId =
    params.id as string;

  const [tickets, setTickets] =
    useState<any[]>([]);

  const [currency, setCurrency] =
    useState("USD");

  const [name, setName] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [quantity,
    setQuantity] =
    useState("");

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
      const result =
        await getTickets(
          eventId
        );

      if (result.success) {
        setTickets(
          result.tickets || []
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
        error
      );
    }
  }

  async function submit() {
    const result =
      await createTicket(
        eventId,
        {
          name,
          price:
            Number(price),
          quantity:
            Number(
              quantity
            ),
        }
      );

    if (!result.success) {
      alert(
        result.message
      );

      return;
    }

    setName("");
    setPrice("");
    setQuantity("");

    loadTickets();
  }

  useEffect(() => {
    if (eventId) {
      loadTickets();
    }
  }, [eventId]);

  return (
    <main className="max-w-5xl p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Ticket Management
        </h1>

        <p className="text-gray-500 mt-2">
          Event Currency:
          {" "}
          {currency}
        </p>
      </div>

      <div className="border rounded p-6 mb-8">
        <h2 className="font-bold mb-4">
          Create Ticket
        </h2>

        <input
          className="w-full border p-3 mb-4"
          placeholder="Ticket Name (VIP, Regular, VVIP)"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
        />

        <input
          type="number"
          className="w-full border p-3 mb-4"
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
          className="w-full border p-3 mb-4"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) =>
            setQuantity(
              e.target.value
            )
          }
        />

        <button
          onClick={submit}
          className="bg-black text-white px-6 py-3"
        >
          Create Ticket
        </button>
      </div>

      <div>
        <h2 className="font-bold text-xl mb-4">
          Existing Tickets
        </h2>

        {tickets.length ===
        0 ? (
          <div className="border rounded p-6 text-gray-500">
            No tickets
            created yet
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
                  className="border rounded p-5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">
                      {
                        ticket.name
                      }
                    </h3>

                    <span className="font-semibold text-lg">
                      {currencySymbol(
                        currency
                      )}
                      {Number(
                        ticket.price
                      ).toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-500">
                    <span>
                      Quantity:
                      {" "}
                      {
                        ticket.quantity
                      }
                    </span>

                    <span>
                      Sold:
                      {" "}
                      {ticket.sold ??
                        0}
                    </span>

                    <span>
                      Remaining:
                      {" "}
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