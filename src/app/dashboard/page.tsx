"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  Building2,
  CalendarDays,
  MapPin,
  Plus,
  Users,
} from "lucide-react";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  createOrganization,
} from "@/services/organization";

export default function Dashboard() {
  const {
    user,
    organization,
    subscription,
    loading,
    isTrialing,
    trialDaysRemaining,
    hasActiveSubscription,
    refresh,
  } = useAuth();

  const [name, setName] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [
    creatingOrganization,
    setCreatingOrganization,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Create Organization
  |--------------------------------------------------------------------------
  */

  async function handleCreate() {
    if (!name.trim()) {
      alert(
        "Please enter your organization name.",
      );

      return;
    }

    if (!slug.trim()) {
      alert(
        "Please enter an organization slug.",
      );

      return;
    }

    try {
      setCreatingOrganization(
        true,
      );

      const result =
        await createOrganization(
          name.trim(),
          slug.trim(),
        );

      if (!result.success) {
        alert(
          result.message ??
            "Unable to create organization.",
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Refresh Auth Context
      |--------------------------------------------------------------------------
      |
      | The backend creates the organization and its 14-day trial together.
      |
      | AuthContext then reloads:
      |
      | User
      | Organization
      | Subscription
      |
      */

      await refresh();
    } catch (error: any) {
      console.error(
        "CREATE ORGANIZATION ERROR:",
        error,
      );

      alert(
        error?.message ??
          "Failed to create organization.",
      );
    } finally {
      setCreatingOrganization(
        false,
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-6 py-10 lg:px-10">
        <div className="mx-auto max-w-7xl">

          <div className="animate-pulse">

            <div className="h-4 w-32 rounded-full bg-surface" />

            <div className="mt-5 h-12 w-80 rounded-xl bg-surface" />

            <div className="mt-4 h-5 w-56 rounded-lg bg-surface" />

            <div className="mt-12 grid gap-6 md:grid-cols-3">

              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="h-36 rounded-[28px] bg-surface"
                  />
                ),
              )}

            </div>

          </div>

        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Organization Setup
  |--------------------------------------------------------------------------
  |
  | This is the existing onboarding flow.
  |
  | A newly registered organizer reaches this state before an organization
  | exists.
  |
  */

  if (!organization) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">

        <div className="w-full max-w-xl">

          <div className="mb-10">

            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-divider bg-surface">

              <Building2
                className="h-6 w-6 text-[#3E86A4]"
              />

            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#3E86A4]">
              Organizer Setup
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Create your
              organization.
            </h1>

            <p className="mt-5 max-w-md leading-7 text-muted">
              Welcome{" "}
              {user?.firstName}.
              Your organization is
              the home for your
              events, teams and
              operations.
            </p>

          </div>

          <div className="rounded-[32px] border border-divider bg-surface p-6 md:p-8">

            <div>

              <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Organization Name
              </label>

              <input
                className="
                  w-full
                  rounded-2xl
                  border
                  border-divider
                  bg-background
                  px-5
                  py-4
                  outline-none
                  transition
                  placeholder:text-muted
                  focus:border-gold
                "
                placeholder="e.g. WOWYOU Experiences"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value,
                  )
                }
              />

            </div>

            <div className="mt-6">

              <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Organization Slug
              </label>

              <input
                className="
                  w-full
                  rounded-2xl
                  border
                  border-divider
                  bg-background
                  px-5
                  py-4
                  outline-none
                  transition
                  placeholder:text-muted
                  focus:border-gold
                "
                placeholder="e.g. wowyou-experiences"
                value={slug}
                onChange={(e) =>
                  setSlug(
                    e.target.value,
                  )
                }
              />

              <p className="mt-3 text-sm text-muted">
                This becomes your
                unique organization
                identifier.
              </p>

            </div>

            <button
              type="button"
              disabled={
                creatingOrganization
              }
              onClick={
                handleCreate
              }
              className="
                mt-8
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#3E86A4]
                px-6
                py-4
                font-semibold
                text-white
                transition
                hover:scale-[1.01]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {creatingOrganization
                ? "Creating..."
                : "Create Organization"}

              {!creatingOrganization && (
                <ArrowRight className="h-4 w-4" />
              )}

            </button>

            <p className="mt-4 text-center text-xs text-muted">
              Your organization starts
              with a 14-day free trial.
            </p>

          </div>

        </div>

      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Event Statistics
  |--------------------------------------------------------------------------
  */

  const eventCount =
    organization.events
      ?.length ?? 0;

  const publishedCount =
    organization.events
      ?.filter(
        (event: any) =>
          event.status ===
          "PUBLISHED",
      ).length ?? 0;

  const draftCount =
    organization.events
      ?.filter(
        (event: any) =>
          event.status ===
          "DRAFT",
      ).length ?? 0;

  /*
  |--------------------------------------------------------------------------
  | Dashboard
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-background px-6 py-10 lg:px-10">

      <div className="mx-auto max-w-7xl">

        {/* --------------------------------------------------------------- */}
        {/* Header */}
        {/* --------------------------------------------------------------- */}

        <section className="flex flex-col gap-8 border-b border-divider pb-10 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#3E86A4]">
              Organizer Dashboard
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              {organization.name}
            </h1>

            <p className="mt-4 text-muted">
              Welcome back,{" "}
              <span className="text-foreground">
                {user?.firstName}
              </span>
              . Manage your events
              and operations from
              here.
            </p>

          </div>

          <Link
            href="/dashboard/events/create"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-full
              bg-[#3E86A4]
              px-6
              py-4
              font-semibold
              text-white
              transition
              hover:scale-[1.02]
            "
          >
            <Plus className="h-5 w-5" />

            Create Event
          </Link>

        </section>

        {/* --------------------------------------------------------------- */}
        {/* Subscription / Trial Banner */}
        {/* --------------------------------------------------------------- */}

        {isTrialing &&
          subscription && (
            <section className="mt-8 rounded-[28px] border border-[#3E86A4]/20 bg-[#3E86A4]/5 p-6">

              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                <div>

                  <div className="flex flex-wrap items-center gap-3">

                    <span className="rounded-full bg-[#3E86A4] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                      Free Trial
                    </span>

                    <span className="text-sm font-semibold">
                      {subscription.plan}
                    </span>

                  </div>

                  <h2 className="mt-3 text-xl font-bold">
                    Your 14-day trial is
                    active.
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                    You have{" "}
                    <span className="font-semibold text-foreground">
                      {trialDaysRemaining}{" "}
                      {trialDaysRemaining ===
                      1
                        ? "day"
                        : "days"}
                    </span>{" "}
                    remaining to explore
                    WowYou before choosing
                    your monthly plan.
                  </p>

                </div>

                <Link
                  href="/dashboard/billing"
                  className="
                    inline-flex
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    border
                    border-divider
                    bg-surface
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    transition
                    hover:border-[#3E86A4]
                    hover:text-[#3E86A4]
                  "
                >
                  View Plans

                  <ArrowRight className="h-4 w-4" />
                </Link>

              </div>

            </section>
          )}

        {/* --------------------------------------------------------------- */}
        {/* Expired / Inactive Subscription */}
        {/* --------------------------------------------------------------- */}

        {!hasActiveSubscription &&
          subscription &&
          !isTrialing && (
            <section className="mt-8 rounded-[28px] border border-red-200 bg-red-50 p-6">

              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
                    Subscription Required
                  </p>

                  <h2 className="mt-2 text-xl font-bold text-red-950">
                    Choose a plan to continue.
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-red-800">
                    Your organizer access
                    requires an active
                    subscription.
                  </p>

                </div>

                <Link
                  href="/dashboard/billing"
                  className="
                    inline-flex
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-[#3E86A4]
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                  "
                >
                  Choose Plan

                  <ArrowRight className="h-4 w-4" />
                </Link>

              </div>

            </section>
          )}

        {/* --------------------------------------------------------------- */}
        {/* Paid Subscription */}
        {/* --------------------------------------------------------------- */}

        {subscription?.status ===
          "ACTIVE" && (
            <section className="mt-8 flex flex-col gap-4 rounded-[24px] border border-divider bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

                <p className="text-sm text-muted">
                  You're on the{" "}
                  <span className="font-semibold text-foreground">
                    {subscription.plan}
                  </span>{" "}
                  plan.
                </p>

              </div>

              <Link
                href="/dashboard/billing"
                className="inline-flex items-center gap-2 text-sm font-semibold hover:text-[#3E86A4]"
              >
                Manage plan

                <ArrowRight className="h-4 w-4" />
              </Link>

            </section>
          )}

        {/* --------------------------------------------------------------- */}
        {/* Overview */}
        {/* --------------------------------------------------------------- */}

        <section className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-[28px] border border-divider bg-surface p-6">

            <div className="flex items-center justify-between">

              <p className="text-sm text-muted">
                Total Events
              </p>

              <CalendarDays className="h-5 w-5 text-[#3E86A4]" />

            </div>

            <h2 className="mt-8 text-4xl font-black">
              {eventCount}
            </h2>

          </div>

          <div className="rounded-[28px] border border-divider bg-surface p-6">

            <p className="text-sm text-muted">
              Published
            </p>

            <h2 className="mt-8 text-4xl font-black">
              {publishedCount}
            </h2>

            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-green-400">
              Live Events
            </p>

          </div>

          <div className="rounded-[28px] border border-divider bg-surface p-6">

            <p className="text-sm text-muted">
              Drafts
            </p>

            <h2 className="mt-8 text-4xl font-black">
              {draftCount}
            </h2>

            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">
              In Preparation
            </p>

          </div>

          <div className="rounded-[28px] border border-divider bg-surface p-6">

            <p className="text-sm text-muted">
              Organization
            </p>

            <h2 className="mt-8 truncate text-xl font-bold">
              {organization.slug}
            </h2>

            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">
              Organization ID
            </p>

          </div>

        </section>

        {/* --------------------------------------------------------------- */}
        {/* Events */}
        {/* --------------------------------------------------------------- */}

        <section className="mt-16">

          <div className="flex items-end justify-between gap-6">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#3E86A4]">
                Event Portfolio
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Your Events
              </h2>

              <p className="mt-2 text-muted">
                Open an event to
                manage tickets,
                attendees, staff,
                revenue and live
                operations.
              </p>

            </div>

          </div>

          {/* Empty */}

          {eventCount === 0 && (

            <div className="mt-8 flex min-h-[360px] flex-col items-center justify-center rounded-[32px] border border-dashed border-divider bg-surface/50 px-6 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-divider bg-background">

                <CalendarDays className="h-7 w-7 text-[#3E86A4]" />

              </div>

              <h3 className="mt-6 text-2xl font-bold">
                Your first event
                starts here.
              </h3>

              <p className="mt-3 max-w-md leading-7 text-muted">
                Create an event,
                configure tickets,
                build your staff
                team and start
                preparing your live
                operations.
              </p>

              <Link
                href="/dashboard/events/create"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#3E86A4] px-6 py-3 font-semibold text-white"
              >
                <Plus className="h-4 w-4" />

                Create Event
              </Link>

            </div>
          )}

          {/* Event Cards */}

          {eventCount > 0 && (

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {organization.events?.map(
                (event: any) => (

                  <Link
                    key={
                      event.id
                    }
                    href={`/dashboard/events/${event.id}`}
                    className="
                      group
                      overflow-hidden
                      rounded-[28px]
                      border
                      border-divider
                      bg-surface
                      transition
                      duration-300
                      hover:-translate-y-1
                      hover:border-[#3E86A4]/40
                    "
                  >

                    <div className="relative h-52 overflow-hidden bg-background">

                      {event.coverImage ? (

                        <img
                          src={
                            event.coverImage
                          }
                          alt={
                            event.title
                          }
                          className="
                            h-full
                            w-full
                            object-cover
                            transition
                            duration-500
                            group-hover:scale-105
                          "
                        />

                      ) : (

                        <div className="flex h-full items-center justify-center">

                          <CalendarDays className="h-10 w-10 text-muted" />

                        </div>

                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                      <div
                        className={`
                          absolute
                          right-4
                          top-4
                          rounded-full
                          border
                          px-3
                          py-1.5
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                          backdrop-blur-md
                          ${
                            event.status ===
                            "PUBLISHED"
                              ? "border-green-400/30 bg-green-500/20 text-green-300"
                              : "border-white/10 bg-black/40 text-white"
                          }
                        `}
                      >
                        {event.status}
                      </div>

                    </div>

                    <div className="p-6">

                      <h3 className="text-2xl font-bold transition group-hover:text-[#3E86A4]">
                        {event.title}
                      </h3>

                      <div className="mt-5 space-y-3">

                        <div className="flex items-center gap-3 text-sm text-muted">

                          <MapPin className="h-4 w-4 shrink-0" />

                          <span className="truncate">
                            {event.venue}
                          </span>

                        </div>

                        <div className="flex items-center gap-3 text-sm text-muted">

                          <Users className="h-4 w-4 shrink-0" />

                          <span>
                            Capacity{" "}
                            {event.capacity?.toLocaleString()}
                          </span>

                        </div>

                        {event.startDate && (

                          <div className="flex items-center gap-3 text-sm text-muted">

                            <CalendarDays className="h-4 w-4 shrink-0" />

                            <span>
                              {new Date(
                                event.startDate,
                              ).toLocaleDateString(
                                "en-US",
                                {
                                  month:
                                    "short",
                                  day:
                                    "numeric",
                                  year:
                                    "numeric",
                                },
                              )}
                            </span>

                          </div>

                        )}

                      </div>

                      <div className="mt-7 flex items-center justify-between border-t border-divider pt-5">

                        <span className="text-sm font-medium">
                          Manage Event
                        </span>

                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:text-[#3E86A4]" />

                      </div>

                    </div>

                  </Link>
                ),
              )}

            </div>
          )}

        </section>

      </div>

    </main>
  );
}