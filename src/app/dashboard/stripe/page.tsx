"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ArrowUpRight,
  CheckCircle2,
  CircleAlert,
  Clock3,
  ExternalLink,
  Loader2,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  createStripeConnectOnboarding,
  getStripeConnectDashboard,
  getStripeConnectStatus,
  type StripeConnectStatus,
} from "@/services/stripe-connect.service";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function getStatusLabel(
  status: StripeConnectStatus | null,
) {
  if (!status?.stripeAccountId) {
    return "Not connected";
  }

  if (status.disabledReason) {
    return "Action required";
  }

  if (status.onboardingComplete) {
    return "Connected";
  }

  return "Setup incomplete";
}

function getStatusDescription(
  status: StripeConnectStatus | null,
) {
  if (!status?.stripeAccountId) {
    return "Connect your Stripe account to receive event earnings.";
  }

  if (status.disabledReason) {
    return "Stripe requires additional information before your account can receive payouts.";
  }

  if (status.onboardingComplete) {
    return "Your Stripe account is connected and ready to receive event settlements.";
  }

  return "Complete your Stripe onboarding to activate your payout account.";
}

/*
|--------------------------------------------------------------------------
| Status Indicator
|--------------------------------------------------------------------------
*/

function StatusIcon({
  status,
}: {
  status: StripeConnectStatus | null;
}) {
  if (
    status?.onboardingComplete
  ) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle2 className="h-5 w-5 text-primary" />
      </div>
    );
  }

  if (
    status?.disabledReason
  ) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
        <CircleAlert className="h-5 w-5 text-destructive" />
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/10">
      <Clock3 className="h-5 w-5 text-muted" />
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Page
|--------------------------------------------------------------------------
*/

export default function StripeConnectPage() {
  const {
    organization,
    user,
    loading: authLoading,
  } = useAuth();

  const [status, setStatus] =
    useState<StripeConnectStatus | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState<
      "connect" | "dashboard" | null
    >(null);

  const [error, setError] =
    useState<string | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Load Stripe Status
  |--------------------------------------------------------------------------
  */

  const loadStatus =
    useCallback(async () => {
      if (!organization?.id) {
        setLoading(false);
        return;
      }

      try {
        setError(null);

        const response =
          await getStripeConnectStatus(
            organization.id,
          );

        if (!response.success) {
          throw new Error(
            response.message ||
              "Unable to load Stripe account status.",
          );
        }

        setStatus(
          response.stripe,
        );
      } catch (err) {
        console.error(
          "Stripe Connect status error:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load Stripe account status.",
        );
      } finally {
        setLoading(false);
      }
    }, [
      organization?.id,
    ]);

  useEffect(() => {
    if (!authLoading) {
      loadStatus();
    }
  }, [
    authLoading,
    loadStatus,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Start / Continue Stripe Onboarding
  |--------------------------------------------------------------------------
  */

  async function handleConnect() {
    if (!organization?.id) {
      return;
    }

    setActionLoading("connect");
    setError(null);

    try {
      const response =
        await createStripeConnectOnboarding({
          organizationId:
            organization.id,

          email:
            user?.email || undefined,
        });

      if (!response.success) {
        throw new Error(
          response.message ||
            "Unable to start Stripe onboarding.",
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Redirect to Stripe
      |--------------------------------------------------------------------------
      */

      window.location.href =
        response.url;
    } catch (err) {
      console.error(
        "Stripe onboarding error:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to start Stripe onboarding.",
      );

      setActionLoading(null);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Open Stripe Dashboard
  |--------------------------------------------------------------------------
  */

  async function handleDashboard() {
    if (!organization?.id) {
      return;
    }

    setActionLoading("dashboard");
    setError(null);

    try {
      const response =
        await getStripeConnectDashboard(
          organization.id,
        );

      if (!response.success) {
        throw new Error(
          response.message ||
            "Unable to open Stripe Dashboard.",
        );
      }

      window.open(
        response.url,
        "_blank",
        "noopener,noreferrer",
      );
    } catch (err) {
      console.error(
        "Stripe dashboard error:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to open Stripe Dashboard.",
      );
    } finally {
      setActionLoading(null);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (
    authLoading ||
    loading
  ) {
    return (
      <main className="px-6 pb-12 pt-6 md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading Stripe Connect...
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | No Organization
  |--------------------------------------------------------------------------
  */

  if (!organization) {
    return (
      <main className="px-6 pb-12 pt-6 md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-divider bg-card p-8">
            <h1 className="text-xl font-semibold text-foreground">
              Stripe Connect
            </h1>

            <p className="mt-2 text-sm text-muted">
              Create an organization before
              connecting a Stripe account.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const isConnected =
    status?.onboardingComplete === true;

  /*
  |--------------------------------------------------------------------------
  | Page
  |--------------------------------------------------------------------------
  */

  return (
    <main className="px-6 pb-12 pt-6 md:px-8">
      <div className="mx-auto max-w-5xl">
        {/*
        |--------------------------------------------------------------------------
        | Header
        |--------------------------------------------------------------------------
        */}

        <div className="mb-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-primary">
                Payments & payouts
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                Stripe Connect
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                Connect your Stripe account to
                receive settlements from events
                hosted through WowYou.
              </p>
            </div>

            {status && (
              <div
                className="
                  hidden
                  rounded-full
                  border
                  border-divider
                  bg-card
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  text-foreground
                  sm:flex
                  sm:items-center
                  sm:gap-2
                "
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isConnected
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                />

                {getStatusLabel(
                  status,
                )}
              </div>
            )}
          </div>
        </div>

        {/*
        |--------------------------------------------------------------------------
        | Error
        |--------------------------------------------------------------------------
        */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

            <div>
              <p className="text-sm font-medium text-foreground">
                Something went wrong
              </p>

              <p className="mt-1 text-sm text-muted">
                {error}
              </p>

              <button
                type="button"
                onClick={loadStatus}
                className="mt-3 text-sm font-medium text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/*
        |--------------------------------------------------------------------------
        | Main Status Card
        |--------------------------------------------------------------------------
        */}

        <section className="rounded-2xl border border-divider bg-card">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex gap-4">
                <StatusIcon
                  status={status}
                />

                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {getStatusLabel(
                      status,
                    )}
                  </h2>

                  <p className="mt-1 max-w-xl text-sm leading-6 text-muted">
                    {getStatusDescription(
                      status,
                    )}
                  </p>

                  {status?.stripeAccountId && (
                    <p className="mt-3 text-xs text-muted">
                      Stripe account ending in{" "}
                      <span className="font-medium text-foreground">
                        {status.stripeAccountId.slice(
                          -8,
                        )}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                {!isConnected ? (
                  <button
                    type="button"
                    onClick={
                      handleConnect
                    }
                    disabled={
                      actionLoading !==
                      null
                    }
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-primary
                      px-5
                      py-3
                      text-sm
                      font-medium
                      text-primary-foreground
                      transition
                      hover:opacity-90
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {actionLoading ===
                    "connect" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}

                    {status?.stripeAccountId
                      ? "Continue setup"
                      : "Connect Stripe"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={
                      handleDashboard
                    }
                    disabled={
                      actionLoading !==
                      null
                    }
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-divider
                      bg-background
                      px-5
                      py-3
                      text-sm
                      font-medium
                      text-foreground
                      transition
                      hover:bg-muted/5
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {actionLoading ===
                    "dashboard" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ExternalLink className="h-4 w-4" />
                    )}

                    Open Stripe Dashboard
                  </button>
                )}
              </div>
            </div>
          </div>

          {/*
          |--------------------------------------------------------------------------
          | Capabilities
          |--------------------------------------------------------------------------
          */}

          <div className="grid border-t border-divider md:grid-cols-3">
            <Capability
              icon={
                <ShieldCheck className="h-5 w-5" />
              }
              title="Account verification"
              enabled={
                status?.detailsSubmitted ===
                true
              }
              description="Your business information is submitted to Stripe."
            />

            <Capability
              icon={
                <Wallet className="h-5 w-5" />
              }
              title="Receive settlements"
              enabled={
                status?.payoutsEnabled ===
                true
              }
              description="Your connected account can receive event settlements."
            />

            <Capability
              icon={
                <CheckCircle2 className="h-5 w-5" />
              }
              title="Stripe connected"
              enabled={
                status?.onboardingComplete ===
                true
              }
              description="Your Stripe Connect setup is complete."
            />
          </div>
        </section>

        {/*
        |--------------------------------------------------------------------------
        | How Settlements Work
        |--------------------------------------------------------------------------
        */}

        <section className="mt-6 rounded-2xl border border-divider bg-card p-6 md:p-8">
          <h2 className="text-lg font-semibold text-foreground">
            How event settlements work
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            WowYou holds ticket proceeds while
            your event is running. After the event
            ends and the settlement period is
            reached, your eligible balance is
            transferred to your connected Stripe
            account.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <SettlementStep
              number="01"
              title="Sell tickets"
              description="Attendees pay through WowYou Checkout."
            />

            <SettlementStep
              number="02"
              title="Event completes"
              description="WowYou calculates the final event settlement."
            />

            <SettlementStep
              number="03"
              title="Receive settlement"
              description="Your eligible balance is transferred to Stripe."
            />
          </div>
        </section>

        {/*
        |--------------------------------------------------------------------------
        | Requirements
        |--------------------------------------------------------------------------
        */}

        {status &&
          status.currentlyDue.length >
            0 && (
            <section className="mt-6 rounded-2xl border border-divider bg-card p-6">
              <div className="flex items-start gap-3">
                <CircleAlert className="mt-0.5 h-5 w-5 text-foreground" />

                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    Information required
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-muted">
                    Stripe needs additional
                    information before your
                    account can be fully activated.
                  </p>

                  <button
                    type="button"
                    onClick={
                      handleConnect
                    }
                    disabled={
                      actionLoading !==
                      null
                    }
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    Continue Stripe setup
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </section>
          )}
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Capability
|--------------------------------------------------------------------------
*/

function Capability({
  icon,
  title,
  description,
  enabled,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
}) {
  return (
    <div className="flex gap-3 p-5 md:p-6">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          enabled
            ? "bg-primary/10 text-primary"
            : "bg-muted/10 text-muted"
        }`}
      >
        {icon}
      </div>

      <div>
        <p className="text-sm font-medium text-foreground">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-muted">
          {description}
        </p>

        <p
          className={`mt-2 text-xs font-medium ${
            enabled
              ? "text-primary"
              : "text-muted"
          }`}
        >
          {enabled
            ? "Active"
            : "Pending"}
        </p>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Settlement Step
|--------------------------------------------------------------------------
*/

function SettlementStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-divider bg-background p-5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
        {number}
      </div>

      <h3 className="mt-4 text-sm font-semibold text-foreground">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-muted">
        {description}
      </p>
    </div>
  );
}