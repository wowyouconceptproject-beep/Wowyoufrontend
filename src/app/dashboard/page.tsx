"use client";

import { useEffect, useState } from "react";

import {
  createOrganization,
  getMyOrganization,
} from "@/services/organization";

const API_URL =
  process.env
    .NEXT_PUBLIC_API_URL
    ?.replace(/\/$/, "");

export default function Dashboard() {
  const [user, setUser] =
    useState<any>(null);

  const [
    organization,
    setOrganization,
  ] = useState<any>(null);

  const [name, setName] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  async function loadDashboard() {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        window.location.href =
          "/login";
        return;
      }

      const userResponse =
        await fetch(
          `${API_URL}/auth/me`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const userData =
        await userResponse.json();

      if (!userData.success) {
        localStorage.removeItem(
          "token"
        );

        window.location.href =
          "/login";

        return;
      }

      setUser(userData.user);

      const orgData =
        await getMyOrganization(
          token
        );

      if (orgData.success) {
        setOrganization(
          orgData.organization
        );
      }
    } catch (error) {
      console.error(
        "Dashboard Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) return;

      const result =
        await createOrganization(
          token,
          name,
          slug
        );

      if (!result.success) {
        alert(
          result.message
        );

        return;
      }

      await loadDashboard();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to create organization"
      );
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="p-8">
        Loading...
      </main>
    );
  }

  if (!organization) {
    return (
      <main className="max-w-xl p-8">
        <h1 className="text-3xl font-bold mb-6">
          Create Organization
        </h1>

        <p className="mb-6 text-gray-500">
          Welcome{" "}
          {user?.firstName}
        </p>

        <input
          className="w-full border p-3 mb-4"
          placeholder="Organization Name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
        />

        <input
          className="w-full border p-3 mb-4"
          placeholder="Organization Slug"
          value={slug}
          onChange={(e) =>
            setSlug(
              e.target.value
            )
          }
        />

        <button
          onClick={
            handleCreate
          }
          className="bg-black text-white px-6 py-3"
        >
          Create Organization
        </button>
      </main>
    );
  }

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            {organization.name}
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome{" "}
            {user?.firstName}
          </p>

          <p className="mt-2">
            Slug:{" "}
            {organization.slug}
          </p>

          <p className="mt-2">
            Events:{" "}
            {
              organization.events
                ?.length
            }
          </p>
        </div>

        <a
          href="/dashboard/events/create"
          className="bg-black text-white px-6 py-3"
        >
          Create Event
        </a>
      </div>

      <div className="grid gap-4">
        {organization.events
          ?.length === 0 && (
          <div className="border rounded p-6">
            <h3 className="font-semibold">
              No events yet
            </h3>

            <p className="text-gray-500 mt-2">
              Create your first
              event to get
              started.
            </p>
          </div>
        )}

        {organization.events?.map(
          (event: any) => (
            <a
              key={event.id}
              href={`/dashboard/events/${event.id}`}
              className="block border rounded p-6 hover:border-gray-400 transition"
            >
              <h3 className="text-xl font-bold">
                {event.title}
              </h3>

              <p className="mt-2">
                📍 {event.venue}
              </p>

              <p className="mt-1">
                👥 Capacity:{" "}
                {
                  event.capacity
                }
              </p>

              <p className="mt-1">
                Status:{" "}
                {event.status}
              </p>

              <p className="mt-4 text-sm text-gray-500">
                View Event →
              </p>
            </a>
          )
        )}
      </div>
    </main>
  );
}