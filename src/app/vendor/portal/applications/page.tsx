"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Clock3,
  FileText,
  X,
} from "lucide-react";

import {
  getMyApplications,
  VendorApplication,
} from "@/services/vendor";

export default function VendorApplicationsPage() {
  const [
    applications,
    setApplications,
  ] = useState<
    VendorApplication[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | Load Applications
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const result =
        await getMyApplications();

      setApplications(
        result.applications ??
          [],
      );
    } catch (error) {
      console.error(
        "Unable to load vendor applications:",
        error,
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">

        <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">

          <div className="animate-pulse">

            <div className="h-3 w-28 rounded-full bg-white/[0.05]" />

            <div className="mt-5 h-12 w-80 rounded-xl bg-white/[0.05]" />

            <div className="mt-12 grid gap-4 md:grid-cols-3">

              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="h-36 rounded-[24px] border border-white/[0.05] bg-white/[0.025]"
                  />
                ),
              )}

            </div>

            <div className="mt-16 space-y-5">

              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="h-40 rounded-[24px] border border-white/[0.05] bg-white/[0.025]"
                  />
                ),
              )}

            </div>

          </div>

        </section>

      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Groups
  |--------------------------------------------------------------------------
  */

  const pending =
    applications.filter(
      (item) =>
        item.status ===
        "PENDING",
    );

  const approved =
    applications.filter(
      (item) =>
        item.status ===
        "APPROVED",
    );

  const rejected =
    applications.filter(
      (item) =>
        item.status ===
        "REJECTED",
    );

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* Header */}

      <section
        className="
          border-b
          border-white/[0.06]
          bg-gradient-to-b
          from-[#0D0D0D]
          to-[#050505]
        "
      >

        <div
          className="
            mx-auto
            max-w-7xl
            px-5
            pb-12
            pt-14
            md:px-8
            md:pb-16
            md:pt-20
          "
        >

          <div
            className="
              flex
              flex-col
              gap-8
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >

            <div>

              <div className="flex items-center gap-3">

                <span className="h-px w-8 bg-[#0F766E]" />

                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.24em]
                    text-[#D4AF37]
                  "
                >
                  Vendor Portal
                </p>

              </div>

              <h1
                className="
                  mt-5
                  text-4xl
                  font-black
                  tracking-tight
                  md:text-5xl
                  lg:text-6xl
                "
              >
                My Applications
              </h1>

              <p
                className="
                  mt-5
                  max-w-xl
                  text-sm
                  leading-7
                  text-white/40
                  md:text-base
                "
              >
                Track every event application,
                review decisions and manage your
                vendor opportunities from one place.
              </p>

            </div>

            <Link
              href="/vendor/portal"
              className="
                inline-flex
                h-12
                shrink-0
                items-center
                justify-center
                gap-3
                rounded-xl
                border
                border-white/[0.1]
                bg-white/[0.03]
                px-5
                text-sm
                font-bold
                transition
                hover:border-white/[0.18]
                hover:bg-white/[0.06]
              "
            >
              <ArrowLeft className="h-4 w-4 text-white/40" />

              Back to Portal
            </Link>

          </div>

          {/* Summary */}

          <div
            className="
              mt-12
              grid
              overflow-hidden
              rounded-[24px]
              border
              border-white/[0.07]
              bg-[#0B0B0B]
              md:grid-cols-3
            "
          >

            <SummaryCard
              label="Pending Review"
              value={pending.length}
              description="Awaiting organizer decision"
              icon={Clock3}
            />

            <SummaryCard
              label="Approved"
              value={approved.length}
              description="Applications accepted"
              icon={Check}
              divider
            />

            <SummaryCard
              label="Not Approved"
              value={rejected.length}
              description="Applications declined"
              icon={X}
              divider
            />

          </div>

        </div>

      </section>

      {/* Applications */}

      <section
        className="
          mx-auto
          max-w-7xl
          px-5
          py-14
          md:px-8
          md:py-20
        "
      >

        {applications.length ===
        0 ? (

          <EmptyApplications />

        ) : (
          <div className="space-y-20">

            <ApplicationSection
              title="Pending Review"
              description="Applications currently being reviewed by event organizers."
              items={pending}
              icon={Clock3}
            />

            <ApplicationSection
              title="Approved"
              description="Events where your vendor application has been accepted."
              items={approved}
              icon={Check}
            />

            <ApplicationSection
              title="Not Approved"
              description="Applications that were not selected by the organizer."
              items={rejected}
              icon={X}
            />

          </div>
        )}

      </section>

    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Summary Card
|--------------------------------------------------------------------------
*/

function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
  divider = false,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ElementType;
  divider?: boolean;
}) {
  return (
    <div
      className={`
        p-6
        md:p-7
        ${
          divider
            ? "border-t border-white/[0.07] md:border-l md:border-t-0"
            : ""
        }
      `}
    >

      <div className="flex items-start justify-between">

        <div>

          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.15em]
              text-white/30
            "
          >
            {label}
          </p>

          <p
            className="
              mt-3
              text-4xl
              font-black
              tracking-tight
            "
          >
            {value}
          </p>

        </div>

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-white/[0.07]
            bg-white/[0.03]
          "
        >
          <Icon className="h-4 w-4 text-[#D4AF37]" />
        </div>

      </div>

      <p className="mt-5 text-xs text-white/25">
        {description}
      </p>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Application Section
|--------------------------------------------------------------------------
*/

interface SectionProps {
  title: string;
  description: string;
  items: VendorApplication[];
  icon: React.ElementType;
}

function ApplicationSection({
  title,
  description,
  items,
  icon: Icon,
}: SectionProps) {
  return (
    <section>

      <div
        className="
          flex
          items-end
          justify-between
          gap-6
          border-b
          border-white/[0.07]
          pb-6
        "
      >

        <div>

          <div className="flex items-center gap-3">

            <Icon className="h-4 w-4 text-[#D4AF37]" />

            <h2
              className="
                text-2xl
                font-black
                tracking-tight
                md:text-3xl
              "
            >
              {title}
            </h2>

          </div>

          <p
            className="
              mt-3
              max-w-xl
              text-sm
              leading-6
              text-white/30
            "
          >
            {description}
          </p>

        </div>

        <div
          className="
            flex
            h-9
            min-w-9
            items-center
            justify-center
            rounded-full
            border
            border-white/[0.08]
            bg-white/[0.03]
            px-3
            text-xs
            font-bold
            text-white/45
          "
        >
          {items.length}
        </div>

      </div>

      {items.length === 0 ? (

        <div
          className="
            mt-6
            rounded-[22px]
            border
            border-dashed
            border-white/[0.08]
            bg-white/[0.01]
            px-6
            py-10
            text-center
          "
        >
          <p className="text-sm text-white/25">
            No applications in this category.
          </p>
        </div>

      ) : (

        <div className="mt-6 space-y-4">

          {items.map(
            (application) => (
              <ApplicationCard
                key={
                  application.id
                }
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

/*
|--------------------------------------------------------------------------
| Application Card
|--------------------------------------------------------------------------
*/

interface CardProps {
  application:
    VendorApplication;
}

function ApplicationCard({
  application,
}: CardProps) {
  return (
    <article
      className="
        group
        rounded-[24px]
        border
        border-white/[0.07]
        bg-[#0D0D0D]
        p-6
        transition
        duration-300
        hover:border-white/[0.13]
        md:p-7
      "
    >

      <div
        className="
          flex
          flex-col
          gap-7
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        {/* Main Information */}

        <div className="min-w-0">

          <div
            className="
              flex
              items-center
              gap-2
              text-[10px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-[#D4AF37]
            "
          >
            <Building2 className="h-3.5 w-3.5" />

            {application.category}
          </div>

          <h3
            className="
              mt-4
              text-xl
              font-black
              tracking-tight
              md:text-2xl
            "
          >
            {application.eventTitle}
          </h3>

          <p
            className="
              mt-2
              text-sm
              font-medium
              text-white/45
            "
          >
            {application.businessName}
          </p>

          <div
            className="
              mt-5
              flex
              flex-wrap
              items-center
              gap-x-6
              gap-y-3
              text-xs
              text-white/25
            "
          >

            <div className="flex items-center gap-2">

              <FileText className="h-3.5 w-3.5" />

              Submitted{" "}

              {new Date(
                application.createdAt,
              ).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                },
              )}

            </div>

          </div>

        </div>

        {/* Status */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            gap-5
            border-t
            border-white/[0.06]
            pt-5
            lg:border-l
            lg:border-t-0
            lg:pl-8
            lg:pt-0
          "
        >

          <StatusBadge
            status={
              application.status
            }
          />

          <ArrowRight
            className="
              h-4
              w-4
              text-white/15
              transition
              group-hover:translate-x-1
              group-hover:text-white/40
            "
          />

        </div>

      </div>

    </article>
  );
}

/*
|--------------------------------------------------------------------------
| Status
|--------------------------------------------------------------------------
*/

function StatusBadge({
  status,
}: {
  status: string;
}) {
  if (status === "APPROVED") {
    return (
      <div
        className="
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          border-emerald-500/15
          bg-emerald-500/[0.07]
          px-4
          py-2
          text-xs
          font-bold
          text-emerald-400
        "
      >
        <Check className="h-3.5 w-3.5" />

        Approved
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div
        className="
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          border-red-500/15
          bg-red-500/[0.07]
          px-4
          py-2
          text-xs
          font-bold
          text-red-400
        "
      >
        <X className="h-3.5 w-3.5" />

        Not Approved
      </div>
    );
  }

  return (
    <div
      className="
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        border-[#D4AF37]/15
        bg-[#0F766E]/[0.06]
        px-4
        py-2
        text-xs
        font-bold
        text-[#D4AF37]
      "
    >
      <Clock3 className="h-3.5 w-3.5" />

      Pending Review
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Empty State
|--------------------------------------------------------------------------
*/

function EmptyApplications() {
  return (
    <div
      className="
        flex
        min-h-[420px]
        flex-col
        items-center
        justify-center
        rounded-[28px]
        border
        border-dashed
        border-white/[0.1]
        bg-white/[0.015]
        px-6
        text-center
      "
    >

      <div
        className="
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-2xl
          border
          border-white/[0.07]
          bg-white/[0.03]
        "
      >
        <FileText className="h-6 w-6 text-[#D4AF37]" />
      </div>

      <h2 className="mt-7 text-2xl font-black">
        No Applications Yet
      </h2>

      <p
        className="
          mt-3
          max-w-md
          text-sm
          leading-7
          text-white/30
        "
      >
        When you apply to become a vendor
        at an event, your applications and
        their current status will appear here.
      </p>

      <Link
        href="/vendor/portal"
        className="
          mt-8
          inline-flex
          h-12
          items-center
          gap-3
          rounded-xl
          bg-[#0F766E]
          px-6
          text-sm
          font-black
          text-white
          transition
          hover:bg-[#115E59]
        "
      >
        Find Opportunities

        <ArrowRight className="h-4 w-4" />
      </Link>

    </div>
  );
}