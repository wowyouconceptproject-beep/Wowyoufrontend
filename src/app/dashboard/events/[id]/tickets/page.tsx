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

  const [name, setName] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [quantity,
    setQuantity] =
    useState("");

  async function loadTickets() {
    const result =
      await getTickets(
        eventId
      );

    if (result.success) {
      setTickets(
        result.tickets
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
    <main className="max-w-4xl p-8">
      <h1 className="text-3xl font-bold mb-8">
        Ticket Management
      </h1>

      <div className="border rounded p-6 mb-8">

        <h2 className="font-bold mb-4">
          Create Ticket
        </h2>

        <input
          className="w-full border p-3 mb-4"
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
          className="w-full border p-3 mb-4"
          placeholder="Price"
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

        <div className="space-y-4">

          {tickets.map(
            (ticket) => (
              <div
                key={
                  ticket.id
                }
                className="border rounded p-4"
              >
                <h3 className="font-bold">
                  {
                    ticket.name
                  }
                </h3>

                <p>
                  Price:
                  ₦
                  {
                    ticket.price
                  }
                </p>

                <p>
                  Quantity:
                  {
                    ticket.quantity
                  }
                </p>

                <p>
                  Sold:
                  {
                    ticket.sold
                  }
                </p>

              </div>
            )
          )}

        </div>

      </div>
    </main>
  );
}