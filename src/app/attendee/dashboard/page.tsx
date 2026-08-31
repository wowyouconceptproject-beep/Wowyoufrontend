"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { QRCodeSVG } from "qrcode.react";

import {
  getMyTickets,
  getPurchasePaymentStatus,
  type MyTicket,
} from "@/services/purchase";

import { apiFetch } from "@/lib/api";

/*
|--------------------------------------------------------------------------
| Attendee Profile
|--------------------------------------------------------------------------
*/

interface AttendeeProfile {
  profession?: string | null;
  industry?: string | null;
  company?: string | null;
  jobTitle?: string | null;
  linkedin?: string | null;
  goals?: unknown;
  skills?: unknown;
  bio?: string | null;
}

/*
|--------------------------------------------------------------------------
| Profile Response
|--------------------------------------------------------------------------
*/

interface ProfileResponse {
  success: boolean;
  profile: AttendeeProfile | null;
  message?: string;
}

/*
|--------------------------------------------------------------------------
| Attendee Dashboard Content
|--------------------------------------------------------------------------
*/

function AttendeeDashboardContent() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const purchaseId = searchParams.get("purchase");

  /*
  |--------------------------------------------------------------------------
  | Dashboard State
  |--------------------------------------------------------------------------
  */

  const [tickets, setTickets] =
    useState<MyTicket[]>([]);

  const [profile, setProfile] =
    useState<AttendeeProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Profile State
  |--------------------------------------------------------------------------
  */

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [profileMessage, setProfileMessage] =
    useState<string | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Payment State
  |--------------------------------------------------------------------------
  */

  const [paymentChecking, setPaymentChecking] =
    useState(false);

  const [paymentMessage, setPaymentMessage] =
    useState<string | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Profile Form
  |--------------------------------------------------------------------------
  */

  const [profession, setProfession] =
    useState("");

  const [industry, setIndustry] =
    useState("");

  const [company, setCompany] =
    useState("");

  const [jobTitle, setJobTitle] =
    useState("");

  const [linkedin, setLinkedin] =
    useState("");

  const [bio, setBio] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | Authentication Error
  |--------------------------------------------------------------------------
  */

  function handleAuthenticationError(
    err: unknown,
  ) {
    const message = String(
      (err as { message?: unknown })?.message ?? "",
    ).toLowerCase();

    if (
      message.includes("authentication") ||
      message.includes("unauthorized") ||
      message.includes("token")
    ) {
      localStorage.removeItem("token");

      router.push("/attendee/login");

      return true;
    }

    return false;
  }

  /*
  |--------------------------------------------------------------------------
  | Load Dashboard
  |--------------------------------------------------------------------------
  */

  async function loadDashboard() {
    setLoading(true);
    setError(null);

    try {
      const [
        ticketResponse,
        profileResponse,
      ] = await Promise.all([
        getMyTickets(),

        apiFetch<ProfileResponse>(
          "/attendee-profile/me",
        ),
      ]);

      /*
      |--------------------------------------------------------------------------
      | Tickets
      |--------------------------------------------------------------------------
      */

      if (ticketResponse.success) {
        setTickets(
          ticketResponse.tickets ?? [],
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Profile
      |--------------------------------------------------------------------------
      */

      if (profileResponse.success) {
        const nextProfile =
          profileResponse.profile;

        setProfile(nextProfile);

        if (nextProfile) {
          setProfession(
            nextProfile.profession ?? "",
          );

          setIndustry(
            nextProfile.industry ?? "",
          );

          setCompany(
            nextProfile.company ?? "",
          );

          setJobTitle(
            nextProfile.jobTitle ?? "",
          );

          setLinkedin(
            nextProfile.linkedin ?? "",
          );

          setBio(
            nextProfile.bio ?? "",
          );
        }
      }
    } catch (err: unknown) {
      console.error(
        "ATTENDEE DASHBOARD ERROR:",
        err,
      );

      if (
        handleAuthenticationError(err)
      ) {
        return;
      }

      setError(
        (err as { message?: string })?.message ??
          "Unable to load your dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Check Purchase Status
  |--------------------------------------------------------------------------
  |
  | Revolut returns the attendee here with:
  |
  | ?purchase=<purchaseId>
  |
  | The redirect itself does NOT confirm payment.
  |
  | The backend webhook remains the source of truth.
  |
  */

  async function checkPurchaseStatus() {
    if (!purchaseId) {
      return;
    }

    setPaymentChecking(true);

    setPaymentMessage(
      "Confirming your payment...",
    );

    try {
      const response =
        await getPurchasePaymentStatus(
          purchaseId,
        );

      const status = String(
        response?.purchase?.status ?? "",
      ).toUpperCase();

      const gatewayStatus = String(
        response?.purchase?.gatewayStatus ?? "",
      ).toUpperCase();

      /*
      |--------------------------------------------------------------------------
      | Paid
      |--------------------------------------------------------------------------
      */

      if (
        status === "PAID" ||
        gatewayStatus === "COMPLETED"
      ) {
        setPaymentMessage(
          "Payment confirmed. Your ticket is ready.",
        );

        await loadDashboard();

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Failed
      |--------------------------------------------------------------------------
      */

      if (
        status === "FAILED" ||
        status === "CANCELLED" ||
        gatewayStatus === "FAILED" ||
        gatewayStatus === "CANCELLED"
      ) {
        setPaymentMessage(
          "Your payment was not completed.",
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Pending
      |--------------------------------------------------------------------------
      */

      setPaymentMessage(
        "Payment is still being confirmed. Your ticket will appear here once confirmed.",
      );
    } catch (err: unknown) {
      console.error(
        "PURCHASE STATUS ERROR:",
        err,
      );

      if (
        handleAuthenticationError(err)
      ) {
        return;
      }

      setPaymentMessage(
        (err as { message?: string })?.message ??
          "We could not confirm the payment yet.",
      );
    } finally {
      setPaymentChecking(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Initial Dashboard Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    void loadDashboard();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Payment Return Handling
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!purchaseId) {
      return;
    }

    void checkPurchaseStatus();
  }, [purchaseId]);

  /*
  |--------------------------------------------------------------------------
  | Profile Completion
  |--------------------------------------------------------------------------
  */

  const profileCompletion =
    useMemo(() => {
      if (!profile) {
        return 0;
      }

      const fields = [
        profile.profession,
        profile.industry,
        profile.company,
        profile.jobTitle,
        profile.linkedin,
        profile.bio,
      ];

      const completed =
        fields.filter(
          (value) =>
            value &&
            String(value).trim().length > 0,
        ).length;

      return Math.round(
        (completed / fields.length) * 100,
      );
    }, [profile]);

  /*
  |--------------------------------------------------------------------------
  | Save Profile
  |--------------------------------------------------------------------------
  */

  async function saveProfile() {
    setSavingProfile(true);
    setProfileMessage(null);

    try {
      const payload = {
        profession: profession.trim(),
        industry: industry.trim(),
        company: company.trim(),
        jobTitle: jobTitle.trim(),
        linkedin: linkedin.trim(),
        bio: bio.trim(),
      };

      let response: ProfileResponse;

      if (profile) {
        response =
          await apiFetch<ProfileResponse>(
            "/attendee-profile",
            {
              method: "PATCH",
              body: JSON.stringify(
                payload,
              ),
            },
          );
      } else {
        response =
          await apiFetch<ProfileResponse>(
            "/attendee-profile",
            {
              method: "POST",
              body: JSON.stringify(
                payload,
              ),
            },
          );
      }

      if (!response.success) {
        throw new Error(
          response.message ??
            "Unable to save profile.",
        );
      }

      setProfile(
        response.profile,
      );

      setProfileMessage(
        "Profile updated successfully.",
      );
    } catch (err: unknown) {
      console.error(
        "SAVE PROFILE ERROR:",
        err,
      );

      if (
        handleAuthenticationError(err)
      ) {
        return;
      }

      setProfileMessage(
        (err as { message?: string })?.message ??
          "Unable to save profile.",
      );
    } finally {
      setSavingProfile(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Sign Out
  |--------------------------------------------------------------------------
  */

  function signOut() {
    localStorage.removeItem("token");

    router.push("/attendee/login");
  }

  /*
  |--------------------------------------------------------------------------
  | Upcoming Events
  |--------------------------------------------------------------------------
  */

  const upcomingTickets =
    useMemo(() => {
      const now = new Date();

      return tickets.filter(
        (ticket) => {
          const date =
            ticket.event?.startDate;

          if (!date) {
            return true;
          }

          return new Date(date) >= now;
        },
      );
    }, [tickets]);

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl animate-pulse">

          <div className="h-4 w-24 rounded bg-white/10" />

          <div className="mt-5 h-12 w-72 rounded bg-white/10" />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <div className="h-36 rounded-[28px] bg-white/[0.04]" />
            <div className="h-36 rounded-[28px] bg-white/[0.04]" />
            <div className="h-36 rounded-[28px] bg-white/[0.04]" />
          </div>

          <div className="mt-8 h-96 rounded-[28px] bg-white/[0.04]" />

        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">
        <div className="max-w-md text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#3E86A4]">
            WOWYOU
          </p>

          <h1 className="mt-5 text-3xl font-bold">
            Something went wrong
          </h1>

          <p className="mt-4 text-white/40">
            {error}
          </p>

          <button
            type="button"
            onClick={() => {
              void loadDashboard();
            }}
            className="mt-7 rounded-full bg-[#3E86A4] px-7 py-3 text-sm font-bold transition hover:bg-[#1F7197]"
          >
            Try Again
          </button>

        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Dashboard
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* HEADER */}

      <header className="border-b border-white/[0.07]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10 lg:px-12">

          <div>
            <p className="text-xs font-black tracking-[0.3em] text-[#3E86A4]">
              WOWYOU
            </p>

            <p className="mt-1 text-xs text-white/30">
              ATTENDEE
            </p>
          </div>

          <button
            type="button"
            onClick={signOut}
            className="rounded-full border border-white/10 px-5 py-2.5 text-xs font-semibold text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            Sign Out
          </button>

        </div>
      </header>

      {/* PAYMENT RETURN */}

      {purchaseId && (
        <section className="border-b border-[#3E86A4]/15 bg-[#3E86A4]/[0.04]">

          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-10 lg:px-12">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3E86A4]">
                Payment Return
              </p>

              <p className="mt-1 text-sm text-white/60">
                {paymentMessage ??
                  "Checking your payment..."}
              </p>

            </div>

            <button
              type="button"
              onClick={() => {
                void checkPurchaseStatus();
              }}
              disabled={paymentChecking}
              className="rounded-full border border-[#3E86A4]/30 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#3E86A4]/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {paymentChecking
                ? "Checking..."
                : "Check Payment"}
            </button>

          </div>

        </section>
      )}

      {/* CONTENT */}

      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-14 lg:px-12">

        {/* WELCOME */}

        <section>

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3E86A4]">
            Your Event Hub
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
            Your experience
            <br />
            starts here.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/40">
            Manage your tickets,
            event access and
            networking profile
            from one place.
          </p>

        </section>

        {/* STATS */}

        <section className="mt-10 grid gap-4 md:grid-cols-3">

          <StatCard
            label="Tickets"
            value={String(
              tickets.length,
            )}
          />

          <StatCard
            label="Upcoming Events"
            value={String(
              upcomingTickets.length,
            )}
          />

          <StatCard
            label="Profile"
            value={`${profileCompletion}%`}
          />

        </section>

        {/* TICKETS */}

        <section className="mt-12">

          <div className="flex items-end justify-between gap-5">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3E86A4]">
                Your Access
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                My Tickets
              </h2>

            </div>

            {tickets.length > 0 && (
              <span className="text-sm text-white/30">
                {tickets.length} ticket
                {tickets.length === 1
                  ? ""
                  : "s"}
              </span>
            )}

          </div>

          {tickets.length === 0 ? (
            <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.025] px-7 py-16 text-center">

              <p className="text-4xl">
                ◇
              </p>

              <h3 className="mt-5 text-xl font-bold">
                No tickets yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/35">
                Once you purchase a
                ticket, it will appear
                here with your event
                access and QR code.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/events")
                }
                className="mt-6 rounded-full bg-[#3E86A4] px-7 py-3 text-sm font-bold transition hover:bg-[#1F7197]"
              >
                Discover Events
              </button>

            </div>
          ) : (
            <div className="mt-6 grid gap-5 lg:grid-cols-2">

              {tickets.map(
                (ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    highlighted={
                      ticket.id ===
                      purchaseId
                    }
                  />
                ),
              )}

            </div>
          )}

        </section>

        {/* PROFILE */}

        <section className="mt-14">

          <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.025]">

            <div className="relative overflow-hidden border-b border-white/10 px-7 py-8 md:px-10">

              <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full bg-[#3E86A4]/10 blur-3xl" />

              <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3E86A4]">
                    AI Networking
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Build your attendee profile
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
                    Tell us what you do,
                    what you know and
                    what you are looking
                    for. This helps WOWYOU
                    identify meaningful
                    connections at events.
                  </p>

                </div>

                <div className="shrink-0">

                  <div className="flex items-center gap-4">

                    <div className="relative h-16 w-16">

                      <svg
                        viewBox="0 0 36 36"
                        className="h-full w-full -rotate-90"
                      >

                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="text-white/10"
                        />

                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray={`${profileCompletion}, 100`}
                          className="text-[#3E86A4]"
                        />

                      </svg>

                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                        {profileCompletion}%
                      </span>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setProfileOpen(
                          !profileOpen,
                        )
                      }
                      className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5"
                    >
                      {profileOpen
                        ? "Close"
                        : "Update Profile"}
                    </button>

                  </div>

                </div>

              </div>

            </div>

            {profileOpen && (
              <div className="px-7 py-8 md:px-10">

                <div className="grid gap-5 md:grid-cols-2">

                  <ProfileInput
                    label="Profession"
                    value={profession}
                    onChange={
                      setProfession
                    }
                    placeholder="e.g. Product Designer"
                  />

                  <ProfileInput
                    label="Industry"
                    value={industry}
                    onChange={
                      setIndustry
                    }
                    placeholder="e.g. Technology"
                  />

                  <ProfileInput
                    label="Company"
                    value={company}
                    onChange={
                      setCompany
                    }
                    placeholder="Company name"
                  />

                  <ProfileInput
                    label="Job Title"
                    value={jobTitle}
                    onChange={
                      setJobTitle
                    }
                    placeholder="e.g. Founder"
                  />

                  <ProfileInput
                    label="LinkedIn"
                    value={linkedin}
                    onChange={
                      setLinkedin
                    }
                    placeholder="https://linkedin.com/in/..."
                  />

                </div>

                <div className="mt-5">

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/30">
                    Bio
                  </label>

                  <textarea
                    value={bio}
                    onChange={(e) =>
                      setBio(
                        e.target.value,
                      )
                    }
                    rows={5}
                    placeholder="Tell other attendees a little about yourself..."
                    className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-[#3E86A4]"
                  />

                </div>

                {profileMessage && (
                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/60">
                    {profileMessage}
                  </div>
                )}

                <div className="mt-6 flex justify-end">

                  <button
                    type="button"
                    onClick={() => {
                      void saveProfile();
                    }}
                    disabled={savingProfile}
                    className="rounded-full bg-[#3E86A4] px-7 py-3.5 text-sm font-bold transition hover:bg-[#1F7197] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingProfile
                      ? "Saving..."
                      : "Save Profile"}
                  </button>

                </div>

              </div>
            )}

          </div>

        </section>

        {/* APP CTA */}

        <section className="mt-8 overflow-hidden rounded-[30px] border border-[#3E86A4]/15 bg-[#3E86A4]/[0.045]">

          <div className="relative px-7 py-10 md:px-10 md:py-12">

            <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#3E86A4]/10 blur-3xl" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-2xl">

                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3E86A4]">
                  Take WOWYOU With You
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  Your event experience
                  belongs in your pocket.
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/40">
                  Get the WOWYOU attendee
                  app for faster access to
                  your tickets, QR codes,
                  event information and
                  networking experience.
                </p>

              </div>

              <div className="flex shrink-0 flex-wrap gap-3">

                <a
                  href="#"
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-sm font-bold transition hover:bg-white/[0.08]"
                >
                  App Store
                </a>

                <a
                  href="#"
                  className="rounded-2xl bg-[#3E86A4] px-6 py-4 text-sm font-bold transition hover:bg-[#1F7197]"
                >
                  Google Play
                </a>

              </div>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Ticket Card
|--------------------------------------------------------------------------
*/

function TicketCard({
  ticket,
  highlighted,
}: {
  ticket: MyTicket;
  highlighted: boolean;
}) {
  const event = ticket.event;

  const ticketType = ticket.ticket;

  const firstPass =
    ticket.passes?.[0] ?? null;

  const eventTitle =
    event?.title ?? "Event";

  const venue =
    event?.venue ?? "Venue TBA";

  const startDate =
    event?.startDate
      ? new Date(event.startDate)
      : null;

  /*
  |--------------------------------------------------------------------------
  | Pass Number
  |--------------------------------------------------------------------------
  */

  const passNumber =
    firstPass?.passNumber ??
    ticket.id;

  /*
  |--------------------------------------------------------------------------
  | QR Payload
  |--------------------------------------------------------------------------
  |
  | The backend generates qrToken when the EventPass is issued.
  |
  */

  const qrToken =
    firstPass?.qrToken ?? null;

  /*
  |--------------------------------------------------------------------------
  | Check-In State
  |--------------------------------------------------------------------------
  */

  const checkedIn =
    ticket.checkIn != null;

  return (
    <article
      className={`overflow-hidden rounded-[28px] border bg-white/[0.025] transition ${
        highlighted
          ? "border-[#3E86A4]/60 ring-1 ring-[#3E86A4]/30"
          : "border-white/10"
      }`}
    >

      {/* TICKET HEADER */}

      <div className="border-b border-white/10 px-6 py-6">

        <div className="flex items-start justify-between gap-5">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3E86A4]">
              {ticketType?.name ??
                "Admission Ticket"}
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              {eventTitle}
            </h3>

          </div>

          <div className="flex flex-col items-end gap-2">

            <span className="rounded-full bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">
              {ticket.status}
            </span>

            {checkedIn && (
              <span className="rounded-full bg-[#3E86A4]/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#3E86A4]">
                Checked In
              </span>
            )}

          </div>

        </div>

        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">

          <div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">
              Date
            </p>

            <p className="mt-1 text-white/65">
              {startDate
                ? startDate.toLocaleDateString(
                    "en-US",
                    {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    },
                  )
                : "TBA"}
            </p>

          </div>

          <div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">
              Venue
            </p>

            <p className="mt-1 text-white/65">
              {venue}
            </p>

          </div>

        </div>

      </div>

      {/* TICKET BODY */}

      <div className="grid gap-7 px-6 py-7 sm:grid-cols-[1fr_150px]">

        <div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
            Pass Number
          </p>

          <p className="mt-2 break-all font-mono text-sm text-white/75">
            {passNumber}
          </p>

          <div className="mt-6">

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
              Ticket Type
            </p>

            <p className="mt-2 text-sm text-white/65">
              {ticketType?.name ??
                "Admission Ticket"}
            </p>

          </div>

          <div className="mt-6">

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
              Quantity
            </p>

            <p className="mt-2 text-sm text-white/65">
              {ticket.quantity}
            </p>

          </div>

          <div className="mt-6">

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
              Access
            </p>

            <p className="mt-2 text-sm leading-6 text-white/45">
              Present this QR code
              at the event entrance
              for check-in.
            </p>

          </div>

        </div>

        {/* QR CODE */}

        <div className="flex flex-col items-center">

          {qrToken ? (
            <>
              <div className="rounded-2xl bg-white p-3">

                <QRCodeSVG
                  value={qrToken}
                  size={124}
                  level="H"
                  includeMargin={false}
                />

              </div>

              <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/20">
                Scan to enter
              </p>
            </>
          ) : (
            <>
              <div className="flex h-[150px] w-[150px] items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02]">

                <span className="px-4 text-center text-xs text-white/25">
                  QR unavailable
                </span>

              </div>

              <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/20">
                Pass not issued
              </p>
            </>
          )}

        </div>

      </div>

    </article>
  );
}

/*
|--------------------------------------------------------------------------
| Stat Card
|--------------------------------------------------------------------------
*/

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.025] px-6 py-6">

      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black">
        {value}
      </p>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Profile Input
|--------------------------------------------------------------------------
*/

function ProfileInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/30">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#3E86A4]"
      />

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Attendee Dashboard Page
|--------------------------------------------------------------------------
|
| The dashboard uses useSearchParams(), so the content component must
| render inside Suspense for production builds.
|
*/

export default function AttendeeDashboard() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#050505] px-6 py-10 text-white">
          <div className="mx-auto max-w-7xl animate-pulse">

            <div className="h-4 w-24 rounded bg-white/10" />

            <div className="mt-5 h-12 w-72 rounded bg-white/10" />

            <div className="mt-10 grid gap-5 md:grid-cols-3">

              <div className="h-36 rounded-[28px] bg-white/[0.04]" />

              <div className="h-36 rounded-[28px] bg-white/[0.04]" />

              <div className="h-36 rounded-[28px] bg-white/[0.04]" />

            </div>

            <div className="mt-8 h-96 rounded-[28px] bg-white/[0.04]" />

          </div>
        </main>
      }
    >
      <AttendeeDashboardContent />
    </Suspense>
  );
}