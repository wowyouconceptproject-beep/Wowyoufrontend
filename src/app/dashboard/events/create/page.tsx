"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  createEvent,
} from "@/services/event";

export default function CreateEventPage() {
  const router =
    useRouter();

  const [form, setForm] =
    useState({
      title: "",
      description: "",
      venue: "",
      capacity: 100,
      currency: "USD",
      startDate: "",
      endDate: "",
    });

    <select
  className="w-full border p-3 mb-4"
  onChange={(e) =>
    setForm({
      ...form,
      currency:
        e.target.value,
    })
  }
>
  <option value="USD">
    USD
  </option>

  <option value="EUR">
    EUR
  </option>

  <option value="GBP">
    GBP
  </option>

  <option value="NGN">
    NGN
  </option>

  <option value="KES">
    KES
  </option>

  <option value="ZAR">
    ZAR
  </option>
</select>

  async function submit() {
    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) return;

    const result =
      await createEvent(
        token,
        form
      );

    if (!result.success) {
      alert(
        result.message
      );
      return;
    }

    router.push(
      "/dashboard"
    );
  }

  return (
    <main className="max-w-2xl p-8">
      <h1 className="text-3xl font-bold mb-6">
        Create Event
      </h1>

      <input
        className="w-full border p-3 mb-4"
        placeholder="Title"
        onChange={(e) =>
          setForm({
            ...form,
            title:
              e.target.value,
          })
        }
      />

      <textarea
        className="w-full border p-3 mb-4"
        placeholder="Description"
        onChange={(e) =>
          setForm({
            ...form,
            description:
              e.target.value,
          })
        }
      />

      <input
        className="w-full border p-3 mb-4"
        placeholder="Venue"
        onChange={(e) =>
          setForm({
            ...form,
            venue:
              e.target.value,
          })
        }
      />

      <input
        type="number"
        className="w-full border p-3 mb-4"
        placeholder="Capacity"
        onChange={(e) =>
          setForm({
            ...form,
            capacity:
              Number(
                e.target.value
              ),
          })
        }
      />

      <input
        type="datetime-local"
        className="w-full border p-3 mb-4"
        onChange={(e) =>
          setForm({
            ...form,
            startDate:
              e.target.value,
          })
        }
      />

      <input
        type="datetime-local"
        className="w-full border p-3 mb-4"
        onChange={(e) =>
          setForm({
            ...form,
            endDate:
              e.target.value,
          })
        }
      />

      <button
        onClick={submit}
        className="bg-black text-white px-6 py-3"
      >
        Create Event
      </button>
    </main>
  );
}