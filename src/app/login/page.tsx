"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
loginUser,
} from "@/services/auth";

export default function LoginPage() {
const router =
useRouter();

const [email, setEmail] =
useState("");

const [password, setPassword] =
useState("");

const [loading, setLoading] =
useState(false);

const [error, setError] =
useState("");

async function submit() {
try {
setLoading(true);
setError("");


  const data =
    await loginUser(
      email,
      password
    );

  console.log(
    "LOGIN RESPONSE:",
    data
  );

  if (!data.success) {
    setError(
      data.message ||
        "Login failed"
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
} catch (error) {
  console.error(
    "LOGIN ERROR:",
    error
  );

  setError(
    "Something went wrong"
  );
} finally {
  setLoading(false);
}


}

return ( <main className="min-h-screen flex items-center justify-center p-6"> <div className="w-full max-w-md space-y-4">


    <h1 className="text-3xl font-bold">
      Login
    </h1>

    {error && (
      <div className="rounded border border-red-500 bg-red-50 p-3 text-red-600">
        {error}
      </div>
    )}

    <input
      className="w-full border rounded p-3"
      placeholder="Email"
      value={email}
      onChange={(e) =>
        setEmail(
          e.target.value
        )
      }
    />

    <input
      type="password"
      className="w-full border rounded p-3"
      placeholder="Password"
      value={password}
      onChange={(e) =>
        setPassword(
          e.target.value
        )
      }
    />

    <button
      onClick={submit}
      disabled={loading}
      className="w-full rounded bg-black text-white p-3 disabled:opacity-50"
    >
      {loading
        ? "Logging in..."
        : "Login"}
    </button>
  </div>
</main>


);
}
