"use client";

import {
  useEffect,
  useState,
} from "react";

export default function Dashboard() {
  const [user,
    setUser] =
    useState<any>(null);

  useEffect(() => {
    async function load() {
      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await fetch(
          "http://localhost:5000/auth/me",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      setUser(
        data.user
      );
    }

    load();
  }, []);

  if (!user) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">
        Welcome{" "}
        {user.firstName}
      </h1>

      <pre>
        {JSON.stringify(
          user,
          null,
          2
        )}
      </pre>
    </main>
  );
}