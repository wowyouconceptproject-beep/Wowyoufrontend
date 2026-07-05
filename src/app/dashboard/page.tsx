"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  createOrganization,
  getMyOrganization,
} from "@/services/organization";

import {
  getCurrentUser,
} from "@/services/auth";

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
      const userResult =
        await getCurrentUser();

      if (!userResult.success) {
        localStorage.removeItem(
          "token"
        );

        window.location.href =
          "/login";

        return;
      }

      setUser(
        userResult.user
      );

      const orgResult =
        await getMyOrganization();

      if (
        orgResult.success
      ) {
        setOrganization(
          orgResult.organization
        );
      }

    } catch (error) {

      console.error(error);

      localStorage.removeItem(
        "token"
      );

      window.location.href =
        "/login";

    } finally {

      setLoading(false);

    }
  }

  async function handleCreate() {
    try {
      const result =
        await createOrganization(
          name,
          slug
        );

      if (
        !result.success
      ) {
        alert(
          result.message ??
            "Unable to create organization."
        );

        return;
      }

      setOrganization(
        result.organization
      );

      await loadDashboard();

    } catch (error: any) {

      alert(
        error.message ??
          "Failed to create organization."
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

        <h1 className="mb-6 text-3xl font-bold">
          Create Organization
        </h1>

        <p className="mb-6 text-gray-500">
          Welcome {user?.firstName}
        </p>

        <input
          className="mb-4 w-full border p-3"
          placeholder="Organization Name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
        />

        <input
          className="mb-6 w-full border p-3"
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
          className="rounded bg-black px-6 py-3 text-white"
        >
          Create Organization
        </button>

      </main>
    );
  }

  return (
    <main className="space-y-8 p-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            {organization.name}
          </h1>

          <p className="mt-2 text-gray-500">
            Welcome{" "}
            {user?.firstName}
          </p>

          <p className="mt-1">
            Slug:{" "}
            {organization.slug}
          </p>

          <p className="mt-1">
            Events:{" "}
            {
              organization.events
                ?.length ?? 0
            }
          </p>

        </div>

        <Link
          href="/dashboard/events/create"
          className="rounded bg-black px-6 py-3 text-white"
        >
          Create Event
        </Link>

      </div>

      <div className="grid gap-4">

        {organization.events?.length ===
          0 && (

          <div className="rounded border p-6">

            <h3 className="font-semibold">
              No events yet
            </h3>

            <p className="mt-2 text-gray-500">
              Create your first
              event to get
              started.
            </p>

          </div>

        )}

        {organization.events?.map(
          (event: any) => (

            <Link
              key={event.id}
              href={`/dashboard/events/${event.id}`}
              className="block rounded border p-6 transition hover:border-gray-400"
            >

              <h3 className="text-xl font-bold">
                {event.title}
              </h3>

              <p className="mt-2">
                📍 {event.venue}
              </p>

              <p className="mt-1">
                👥 Capacity:{" "}
                {event.capacity}
              </p>

              <p className="mt-1">
                Status:{" "}
                {event.status}
              </p>

              <p className="mt-4 text-sm text-gray-500">
                View Event →
              </p>

            </Link>

          )
        )}

      </div>

    </main>
  );
}