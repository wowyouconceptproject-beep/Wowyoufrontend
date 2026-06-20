"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { registerUser } from "@/services/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function submit() {
    try {
      setLoading(true);
      setError("");

      const data =
        await registerUser({
          ...form,
          role: "ORGANIZER",
        });

      console.log(
        "REGISTER RESPONSE:",
        data
      );

      if (!data.success) {
        setError(
          data.message ||
            "Registration failed"
        );

        return;
      }

      if (data.token) {
        localStorage.setItem(
          "token",
          data.token
        );

        router.push(
          "/dashboard"
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">

        <h1 className="text-3xl font-bold">
          Create Account
        </h1>

        {error && (
          <div className="rounded border border-red-500 bg-red-50 p-3 text-red-600">
            {error}
          </div>
        )}

        <input
          className="w-full border rounded p-3"
          placeholder="First Name"
          value={form.firstName}
          onChange={(e) =>
            setForm({
              ...form,
              firstName:
                e.target.value,
            })
          }
        />

        <input
          className="w-full border rounded p-3"
          placeholder="Last Name"
          value={form.lastName}
          onChange={(e) =>
            setForm({
              ...form,
              lastName:
                e.target.value,
            })
          }
        />

        <input
          className="w-full border rounded p-3"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email:
                e.target.value,
            })
          }
        />

        <input
          type="password"
          className="w-full border rounded p-3"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password:
                e.target.value,
            })
          }
        />

        <button
          onClick={submit}
          disabled={loading}
          className="w-full rounded bg-black text-white p-3 disabled:opacity-50"
        >
          {loading
            ? "Creating..."
            : "Create Account"}
        </button>
      </div>
    </main>
  );
}