"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  getMyApplications,
  VendorApplication,
} from "@/services/vendor";

export default function VendorApplicationsPage() {
  const [
    applications,
    setApplications,
  ] = useState<VendorApplication[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const result =
        await getMyApplications();

      setApplications(
        result.applications ?? [],
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background" />
    );
  }

  const pending =
    applications.filter(
      (item) =>
        item.status === "PENDING",
    );

  const approved =
    applications.filter(
      (item) =>
        item.status === "APPROVED",
    );

  const rejected =
    applications.filter(
      (item) =>
        item.status === "REJECTED",
    );

  return (
    <main className="min-h-screen bg-background">

      <section className="mx-auto max-w-7xl px-8 py-14">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm uppercase tracking-[0.35em] text-gold">

              Vendor Portal

            </p>

            <h1 className="mt-3 text-5xl font-black">

              My Applications

            </h1>

          </div>

          <Link
            href="/vendor/portal"
            className="rounded-full border border-divider px-6 py-3 transition hover:bg-surface-hover"
          >
            Dashboard
          </Link>

        </div>

        <Section
          title="Pending"
          items={pending}
        />

        <Section
          title="Approved"
          items={approved}
        />

        <Section
          title="Rejected"
          items={rejected}
        />

      </section>

    </main>
  );
}

interface SectionProps {
  title: string;

  items: VendorApplication[];
}

function Section({
  title,
  items,
}: SectionProps) {
  return (
    <section className="mt-16">

      <h2 className="mb-8 text-3xl font-bold">

        {title}

      </h2>

      {items.length === 0 ? (
        <div className="rounded-[28px] border border-divider bg-surface p-10 text-muted">

          No applications.

        </div>
      ) : (
        <div className="grid gap-6">

          {items.map(
            (application) => (
              <ApplicationCard
                key={application.id}
                application={
                  application
                }
              />
            ),
          )}

        </div>
      )}

    </section>
  );
}

interface CardProps {
  application: VendorApplication;
}

function ApplicationCard({
  application,
}: CardProps) {
  return (
    <div className="rounded-[28px] bg-surface p-8">

      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h3 className="text-2xl font-bold">

            {application.eventTitle}

          </h3>

          <p className="mt-3 text-muted">

            {application.businessName}

          </p>

          <p className="mt-2 text-sm text-muted">

            {application.category}

          </p>

        </div>

        <div className="text-right">

          <div
            className={`inline-flex rounded-full px-5 py-2 text-sm font-semibold ${
              application.status ===
              "APPROVED"
                ? "bg-green-500/20 text-green-400"
                : application.status ===
                  "REJECTED"
                ? "bg-red-500/20 text-red-400"
                : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {application.status}
          </div>

          <p className="mt-4 text-sm text-muted">

            {new Date(
              application.createdAt,
            ).toLocaleDateString()}

          </p>

        </div>

      </div>

    </div>
  );
}