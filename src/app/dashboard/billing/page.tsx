"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  createBillingCheckout,
  getBillingPlans,
  OrganizerPlan,
  OrganizerPlanConfig,
} from "@/services/billing";

/*
|--------------------------------------------------------------------------
| WOWYOU Brand
|--------------------------------------------------------------------------
|
| This page intentionally does NOT import a font.
| It inherits the font configured by the application layout.
|
*/

const BRAND = "#3E86A4";
const BRAND_HOVER = "#1F7197";

/*
|--------------------------------------------------------------------------
| Fallback Plans
|--------------------------------------------------------------------------
*/

const FALLBACK_PLANS: OrganizerPlanConfig[] = [
  {
    plan: "STARTER",
    name: "Starter",
    amount: 49,
    currency: "GBP",
    interval: "MONTH",
    description:
      "Everything you need to start running professional events.",
    features: [
      "Event creation",
      "Event publishing",
      "Ticketing",
      "Attendee management",
      "Basic analytics",
    ],
  },

  {
    plan: "PROFESSIONAL",
    name: "Professional",
    amount: 149,
    currency: "GBP",
    interval: "MONTH",
    description:
      "Advanced tools for growing event operations.",
    features: [
      "Everything in Starter",
      "Staff management",
      "Operations",
      "Announcements",
      "Advanced analytics",
      "Reports",
    ],
  },

  {
    plan: "BUSINESS",
    name: "Business",
    amount: 399,
    currency: "GBP",
    interval: "MONTH",
    description:
      "Complete infrastructure for serious event businesses.",
    features: [
      "Everything in Professional",
      "Vendor management",
      "AI features",
      "Multiple events",
      "Advanced operations",
    ],
  },

  {
    plan: "ENTERPRISE",
    name: "Enterprise",
    amount: 1500,
    currency: "GBP",
    interval: "MONTH",
    description:
      "Enterprise-grade event infrastructure and support.",
    features: [
      "Everything in Business",
      "Enterprise support",
      "Custom requirements",
      "Dedicated infrastructure",
    ],
  },
];

/*
|--------------------------------------------------------------------------
| Billing Page
|--------------------------------------------------------------------------
*/

export default function BillingPage() {
  const {
    user,
    organization,
    subscription,
    loading: authLoading,
    isTrialing,
    trialDaysRemaining,
    hasActiveSubscription,
  } = useAuth();

  const [
    plans,
    setPlans,
  ] = useState<OrganizerPlanConfig[]>(
    FALLBACK_PLANS,
  );

  const [
    billingLoading,
    setBillingLoading,
  ] = useState(true);

  const [
    checkoutPlan,
    setCheckoutPlan,
  ] = useState<OrganizerPlan | null>(
    null,
  );

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  /*
  |--------------------------------------------------------------------------
  | Load Billing Plans
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    loadBilling();
  }, [authLoading]);

  async function loadBilling() {
    try {
      setBillingLoading(true);
      setError(null);

      const response =
        await getBillingPlans();

      if (
        response.success &&
        response.plans?.length
      ) {
        setPlans(
          response.plans,
        );
      }
    } catch (err) {
      console.error(
        "Failed to load billing plans:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load billing information.",
      );
    } finally {
      setBillingLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Currency Formatting
  |--------------------------------------------------------------------------
  */

  function getCurrencySymbol(
    currency?: string,
  ) {
    switch (
      String(
        currency ?? "GBP",
      ).toUpperCase()
    ) {
      case "USD":
        return "$";

      case "EUR":
        return "€";

      case "GBP":
        return "£";

      case "NGN":
        return "₦";

      case "KES":
        return "KSh";

      case "ZAR":
        return "R";

      default:
        return currency ?? "£";
    }
  }

  function formatAmount(
    amount: string | number,
    currency?: string,
  ) {
    const numericAmount =
      Number(amount);

    if (
      Number.isNaN(
        numericAmount,
      )
    ) {
      return `${getCurrencySymbol(
        currency,
      )}${amount}`;
    }

    return `${getCurrencySymbol(
      currency,
    )}${numericAmount.toLocaleString(
      "en-US",
    )}`;
  }

  /*
  |--------------------------------------------------------------------------
  | Humanize Feature Names
  |--------------------------------------------------------------------------
  |
  | Protects the UI if the backend returns:
  |
  | EVENT_CREATION
  | STAFF_MANAGEMENT
  | AI_FEATURES
  |
  | Instead of:
  |
  | Event Creation
  | Staff Management
  | AI Features
  |
  */

  function formatFeature(
    feature: string,
  ) {
    const normalized =
      String(feature)
        .trim()
        .replace(
          /[_-]+/g,
          " ",
        )
        .replace(
          /\s+/g,
          " ",
        );

    return normalized
      .toLowerCase()
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase(),
      );
  }

  /*
  |--------------------------------------------------------------------------
  | Plan Name
  |--------------------------------------------------------------------------
  */

  function formatPlanName(
    plan?: string,
  ) {
    if (!plan) {
      return "Organizer Plan";
    }

    return String(plan)
      .replace(
        /[_-]+/g,
        " ",
      )
      .toLowerCase()
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase(),
      );
  }

  /*
  |--------------------------------------------------------------------------
  | Checkout
  |--------------------------------------------------------------------------
  */

  async function handleCheckout(
    plan: OrganizerPlan,
  ) {
    try {
      setCheckoutPlan(plan);
      setError(null);

      /*
      |--------------------------------------------------------------------------
      | Authentication Guard
      |--------------------------------------------------------------------------
      */

      if (!user) {
        throw new Error(
          "Your account information could not be loaded.",
        );
      }

      if (!organization) {
        throw new Error(
          "Your organization could not be loaded.",
        );
      }

      /*
      |--------------------------------------------------------------------------
      | User Information
      |--------------------------------------------------------------------------
      */

      const fullName =
        `${user.firstName ?? ""} ${
          user.lastName ?? ""
        }`.trim();

      const email =
        user.email?.trim();

      if (!fullName) {
        throw new Error(
          "Your account does not have a valid name.",
        );
      }

      if (!email) {
        throw new Error(
          "Your account does not have a valid email address.",
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Create Revolut Checkout
      |--------------------------------------------------------------------------
      */

      const response =
        await createBillingCheckout({
          plan,

          fullName,

          email,

          redirectUrl:
            `${window.location.origin}/dashboard/billing/success`,
        });

      if (
        !response.success ||
        !response.checkoutUrl
      ) {
        throw new Error(
          response.message ??
            "Unable to create checkout.",
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Redirect
      |--------------------------------------------------------------------------
      */

      window.location.href =
        response.checkoutUrl;
    } catch (err) {
      console.error(
        "Billing checkout error:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to start checkout.",
      );

      setCheckoutPlan(null);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Current Plan
  |--------------------------------------------------------------------------
  */

  function isCurrentPlan(
    plan: OrganizerPlan,
  ) {
    if (!subscription) {
      return false;
    }

    /*
    |--------------------------------------------------------------------------
    | Active Paid Subscription
    |--------------------------------------------------------------------------
    */

    if (
      subscription.status ===
      "ACTIVE"
    ) {
      return (
        subscription.plan ===
        plan
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Active Trial
    |--------------------------------------------------------------------------
    */

    if (
      subscription.status ===
        "TRIALING" &&
      hasActiveSubscription
    ) {
      return (
        subscription.plan ===
        plan
      );
    }

    return false;
  }

  /*
  |--------------------------------------------------------------------------
  | Trial Banner
  |--------------------------------------------------------------------------
  */

  function renderTrialBanner() {
    if (!isTrialing) {
      return null;
    }

    /*
    |--------------------------------------------------------------------------
    | Expired Trial
    |--------------------------------------------------------------------------
    */

    if (
      trialDaysRemaining <= 0
    ) {
      return (
        <section className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-[28px] border border-red-500/20 bg-red-500/[0.06]">
          <div className="flex flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">

            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 text-sm text-red-400">
                  !
                </span>

                <p className="text-sm font-semibold text-red-300">
                  Your free trial has ended
                </p>
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-red-200/50">
                Choose an organizer plan below
                to continue using WOWYOU's
                event management infrastructure.
              </p>
            </div>

          </div>
        </section>
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Active Trial
    |--------------------------------------------------------------------------
    */

    return (
      <section className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-[28px] border border-[#3E86A4]/20 bg-[#3E86A4]/[0.06]">
        <div className="flex flex-col gap-6 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">

          <div>

            <div className="flex flex-wrap items-center gap-3">

              <span className="rounded-full bg-[#3E86A4] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                Free Trial
              </span>

              <span className="text-sm font-semibold text-white/80">
                {formatPlanName(
                  subscription?.plan,
                )}
              </span>

            </div>

            <p className="mt-3 text-sm leading-6 text-white/50">
              Your 14-day organizer trial is
              active. You have{" "}
              <strong className="text-white">
                {trialDaysRemaining}{" "}
                {trialDaysRemaining ===
                1
                  ? "day"
                  : "days"}
              </strong>{" "}
              remaining.
            </p>

          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 md:min-w-[170px] md:text-right">

            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
              Trial Ends
            </p>

            <p className="mt-1 text-sm font-semibold text-white/80">
              {subscription?.currentPeriodEnd
                ? new Date(
                    subscription.currentPeriodEnd,
                  ).toLocaleDateString(
                    "en-GB",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    },
                  )
                : "—"}
            </p>

          </div>

        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-[#3E86A4]/30" />

          <p className="mt-5 text-sm text-white/40">
            Loading your account...
          </p>

        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* ================================================================ */}
      {/* HERO */}
      {/* ================================================================ */}

      <section className="relative overflow-hidden border-b border-white/[0.07]">

        {/* Background glow */}

        <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#3E86A4]/10 blur-[120px]" />

        <div className="pointer-events-none absolute -right-40 top-20 h-[450px] w-[450px] rounded-full bg-[#3E86A4]/[0.06] blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-14 pt-12 md:px-10 md:pb-20 md:pt-16 lg:px-12">

          {/* Brand */}

          <div className="flex items-center gap-3">

            <div className="h-px w-10 bg-[#3E86A4]" />

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#3E86A4]">
              WOWYOU
            </p>

          </div>

          {/* Heading */}

          <div className="mt-8 max-w-4xl">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/30">
              Organizer Infrastructure
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl lg:text-7xl">
              Build events
              <br />
              <span className="text-white/35">
                without the complexity.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/45 md:text-lg">
              Everything you need to create,
              sell, manage and operate
              professional events from one
              intelligent platform.
            </p>

          </div>

          {/* Organization */}

          {organization && (
            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2.5">

              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3E86A4]/15 text-xs font-bold text-[#3E86A4]">
                {organization.name
                  ?.charAt(0)
                  ?.toUpperCase() ??
                  "O"}
              </span>

              <span className="text-xs text-white/35">
                Billing for
              </span>

              <span className="text-sm font-semibold text-white/80">
                {organization.name}
              </span>

            </div>
          )}

        </div>

      </section>

      {/* ================================================================ */}
      {/* CONTENT */}
      {/* ================================================================ */}

      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-14 lg:px-12">

        {/* Trial */}

        {renderTrialBanner()}

        {/* ============================================================ */}
        {/* CURRENT SUBSCRIPTION */}
        {/* ============================================================ */}

        {subscription &&
          !isTrialing && (
            <section className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035]">

              <div className="flex flex-col gap-6 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">

                <div>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
                    Current Plan
                  </p>

                  <p className="mt-2 text-xl font-bold text-white">
                    {formatPlanName(
                      subscription.plan,
                    )}
                  </p>

                </div>

                <div className="flex flex-wrap items-center gap-3">

                  <span
                    className={[
                      "rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em]",
                      subscription.status ===
                        "ACTIVE"
                        ? "bg-[#3E86A4]/15 text-[#3E86A4]"
                        : "bg-white/5 text-white/40",
                    ].join(" ")}
                  >
                    {formatPlanName(
                      subscription.status,
                    )}
                  </span>

                  <span className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/70">
                    {formatAmount(
                      subscription.amount,
                      "GBP",
                    )}
                    <span className="ml-1 text-xs font-normal text-white/30">
                      / month
                    </span>
                  </span>

                </div>

              </div>

            </section>
          )}

        {/* ============================================================ */}
        {/* ERROR */}
        {/* ============================================================ */}

        {error && (
          <div className="mx-auto mt-8 max-w-5xl rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-5 py-4">

            <p className="text-sm font-medium text-red-300">
              {error}
            </p>

          </div>
        )}

        {/* ============================================================ */}
        {/* PLAN INTRO */}
        {/* ============================================================ */}

        <div className="mt-14">

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3E86A4]">
                Choose Your Infrastructure
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Plans built around
                <br className="hidden sm:block" />
                how you run events.
              </h2>

            </div>

            <p className="max-w-md text-sm leading-6 text-white/35 md:text-right">
              Start small, scale as your
              operation grows, and unlock
              the infrastructure your events
              require.
            </p>

          </div>

        </div>

        {/* ============================================================ */}
        {/* PLANS */}
        {/* ============================================================ */}

        <div className="mt-10 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">

          {plans.map(
            (plan) => {
              const current =
                isCurrentPlan(
                  plan.plan,
                );

              const loadingPlan =
                checkoutPlan ===
                plan.plan;

              const featured =
                plan.plan ===
                "PROFESSIONAL";

              return (
                <article
                  key={
                    plan.plan
                  }
                  className={[
                    "group relative flex flex-col overflow-hidden rounded-[28px] border bg-white/[0.035] transition duration-300",
                    featured
                      ? "border-[#3E86A4]/50 shadow-[0_0_60px_rgba(62,134,164,0.08)]"
                      : "border-white/10 hover:border-white/20",
                  ].join(" ")}
                >

                  {/* Featured Top Line */}

                  {featured && (
                    <div className="h-1 w-full bg-[#3E86A4]" />
                  )}

                  <div className="flex flex-1 flex-col p-6 md:p-7">

                    {/* Popular */}

                    {featured && (
                      <div className="mb-5">

                        <span className="inline-flex rounded-full bg-[#3E86A4]/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#3E86A4]">
                          Most Popular
                        </span>

                      </div>
                    )}

                    {/* Plan */}

                    <div>

                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
                        {plan.plan}
                      </p>

                      <h3 className="mt-2 text-2xl font-bold text-white">
                        {plan.name}
                      </h3>

                      <p className="mt-3 min-h-[72px] text-sm leading-6 text-white/40">
                        {plan.description}
                      </p>

                    </div>

                    {/* Price */}

                    <div className="mt-7">

                      <div className="flex items-baseline">

                        <span className="text-4xl font-black tracking-tight text-white">
                          {formatAmount(
                            plan.amount,
                            plan.currency,
                          )}
                        </span>

                        <span className="ml-2 text-sm text-white/30">
                          / month
                        </span>

                      </div>

                      <p className="mt-2 text-xs text-white/25">
                        14-day free trial
                      </p>

                    </div>

                    {/* Divider */}

                    <div className="my-7 h-px bg-white/[0.07]" />

                    {/* Features */}

                    <div className="flex-1">

                      <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
                        Includes
                      </p>

                      <ul className="space-y-3.5">

                        {plan.features.map(
                          (
                            feature,
                          ) => (
                            <li
                              key={
                                feature
                              }
                              className="flex items-start gap-3 text-sm text-white/60"
                            >

                              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3E86A4]/10 text-[10px] font-bold text-[#3E86A4]">
                                ✓
                              </span>

                              <span className="leading-5">
                                {formatFeature(
                                  feature,
                                )}
                              </span>

                            </li>
                          ),
                        )}

                      </ul>

                    </div>

                    {/* Button */}

                    <button
                      type="button"
                      disabled={
                        billingLoading ||
                        checkoutPlan !==
                          null ||
                        current
                      }
                      onClick={() =>
                        handleCheckout(
                          plan.plan,
                        )
                      }
                      className={[
                        "mt-8 w-full rounded-2xl px-5 py-3.5 text-sm font-bold transition",
                        current
                          ? "cursor-default border border-white/10 bg-white/5 text-white/30"
                          : featured
                            ? "bg-[#3E86A4] text-white hover:bg-[#1F7197]"
                            : "border border-white/10 bg-white/[0.04] text-white/80 hover:border-[#3E86A4]/40 hover:bg-[#3E86A4]/10 hover:text-white",
                        loadingPlan
                          ? "cursor-wait opacity-60"
                          : "",
                      ].join(" ")}
                    >
                      {loadingPlan
                        ? "Preparing checkout..."
                        : current
                          ? isTrialing
                            ? "Current Trial"
                            : "Current Plan"
                          : subscription?.status ===
                              "ACTIVE"
                            ? "Switch Plan"
                            : "Start Free Trial"}
                    </button>

                  </div>

                </article>
              );
            },
          )}

        </div>

        {/* ============================================================ */}
        {/* BILLING NOTE */}
        {/* ============================================================ */}

        <section className="mt-12 border-t border-white/[0.07] pt-8">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3E86A4]/10 text-sm text-[#3E86A4]">
                ✓
              </div>

              <div>

                <p className="text-sm font-semibold text-white/70">
                  Secure monthly billing
                </p>

                <p className="mt-1 max-w-xl text-xs leading-5 text-white/30">
                  All organizer plans include a
                  14-day free trial. Payments are
                  securely processed through
                  Revolut.
                </p>

              </div>

            </div>

            {billingLoading && (
              <p className="text-xs text-white/25">
                Updating plan information...
              </p>
            )}

          </div>

        </section>

      </div>

    </main>
  );
}