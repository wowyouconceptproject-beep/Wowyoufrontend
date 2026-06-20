"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  loginUser,
} from "@/services/auth";

export default function LoginPage() {
  const router =
    useRouter();

  const [email,
    setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  async function submit() {
    const data =
      await loginUser(
        email,
        password
      );

    if (data.token) {
      localStorage.setItem(
        "token",
        data.token
      );

      router.push(
        "/dashboard"
      );
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-4">

        <h1 className="text-3xl font-bold">
          Login
        </h1>

        <input
          className="w-full border p-3"
          placeholder="Email"
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <input
          type="password"
          className="w-full border p-3"
          placeholder="Password"
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button
          onClick={submit}
          className="w-full bg-black text-white p-3"
        >
          Login
        </button>
      </div>
    </main>
  );
}