"use client";

import {
  useEffect,
  useState,
} from "react";

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

    setUser(userData.user);

    const orgData =
      await getMyOrganization(
        token
      );

    setOrganization(
      orgData.organization
    );

    setLoading(false);
  }

  async function handleCreate() {
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
      <h1 className="text-4xl font-bold">
        {organization.name}
      </h1>

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

      <button className="mt-6 bg-black text-white px-6 py-3">
        Create Event
      </button>

      <pre className="mt-8">
        {JSON.stringify(
          organization,
          null,
          2
        )}
      </pre>
    </main>
  );
}