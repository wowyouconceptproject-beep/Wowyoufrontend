"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  createBillingCheckout,
  getBillingPlans,
  organizerPlan,
  organizerPlanConfig,
  BillingCountry,
  BillingInterval,
} from "@/services/billing";

/*
|--------------------------------------------------------------------------
| WOWYOU Brand
|--------------------------------------------------------------------------
|
| This page intentionally does not import a font.
| It inherits the application layout font.
|
*/

const BRAND = "#3E86A4";
const BRAND_HOVER = "#1F7197";

/*
|--------------------------------------------------------------------------
| Billing Countries
|--------------------------------------------------------------------------
*/

const BILLING_COUNTRIES: {
  value: BillingCountry;
  label: string;
  currency: string;
}[] = [
  {
    value: "GB",
    label: "United Kingdom",
    currency: "GBP",
  },
  {
    value: "EU",
    label: "European Union",
    currency: "EUR",
  },
  {
    value: "CH",
    label: "Switzerland",
    currency: "CHF",
  },
  {
    value: "NO",
    label: "Norway",
    currency: "NOK",
  },
  {
    value: "SE",
    label: "Sweden",
    currency: "SEK",
  },
  {
    value: "DK",
    label: "Denmark",
    currency: "DKK",
  },
  {
    value: "US",
    label: "United States",
    currency: "USD",
  },
];

/*
|--------------------------------------------------------------------------
| Fallback Plans
|--------------------------------------------------------------------------
|
| Used only if the backend cannot return plans.
| Pricing here mirrors the current GB pricing.
|
*/

const FALLBACK_PLANS: organizerPlanConfig[] = [
  {
    plan: "STARTER",

    name: "Starter",

    description:
      "Everything you need to start running professional events.",

    features: [
      "Event creation",
      "Event publishing",
      "Ticketing",
      "Attendee management",
      "Basic analytics",
    ],

    pricing: {
      GB: {
        MONTH: {
          amount: 5.99,
          currency: "GBP",
        },

        YEAR: {
          amount: 49.99,
          currency: "GBP",
        },
      },
    },
  },

  {
    plan: "PROFESSIONAL",

    name: "Professional",

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

    pricing: {
      GB: {
        MONTH: {
          amount: 16.99,
          currency: "GBP",
        },

        YEAR: {
          amount: 149.99,
          currency: "GBP",
        },
      },
    },
  },

  {
    plan: "BUSINESS",

    name: "Business",

    description:
      "Complete infrastructure for serious event businesses.",

    features: [
      "Everything in Professional",
      "Vendor management",
      "AI features",
      "Multiple events",
      "Advanced operations",
    ],

    pricing: {
      GB: {
        MONTH: {
          amount: 44.99,
          currency: "GBP",
        },

        YEAR: {
          amount: 399.99,
          currency: "GBP",
        },
      },
    },
  },

  {
    plan: "ENTERPRISE",

    name: "Enterprise",

    description:
      "Enterprise-grade event infrastructure and support.",

    features: [
      "Everything in Business",
      "Enterprise support",
      "Custom requirements",
      "Dedicated infrastructure",
    ],

    pricing: {
      GB: {
        MONTH: {
          amount: 169.99,
          currency: "GBP",
        },

        YEAR: {
          amount: 1499.99,
          currency: "GBP",
        },
      },
    },
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

  /*
  |--------------------------------------------------------------------------
  | Plans
  |--------------------------------------------------------------------------
  */

  const [
    plans,
    setPlans,
  ] = useState<organizerPlanConfig[]>(
    FALLBACK_PLANS,
  );

  const [
    billingLoading,
    setBillingLoading,
  ] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | Billing Selection
  |--------------------------------------------------------------------------
  */

  const [
    billingCountry,
    setBillingCountry,
  ] = useState<BillingCountry>(
    "GB",
  );

  const [
    billingInterval,
    setBillingInterval,
  ] = useState<BillingInterval>(
    "YEAR",
  );

  /*
  |--------------------------------------------------------------------------
  | Checkout State
  |--------------------------------------------------------------------------
  */

  const [
    checkoutPlan,
    setCheckoutPlan,
  ] = useState<organizerPlan | null>(
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
        "FAILED TO LOAD BILLING PLANS:",
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
  | Selected Country
  |--------------------------------------------------------------------------
  */

  const selectedCountry =
    useMemo(
      () =>
        BILLING_COUNTRIES.find(
          (country) =>
            country.value ===
            billingCountry,
        ) ??
        BILLING_COUNTRIES[0],
      [billingCountry],
    );

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
        currency ?? "",
      ).toUpperCase()
    ) {
      case "GBP":
        return "£";

      case "EUR":
        return "€";

      case "CHF":
        return "CHF ";

      case "NOK":
        return "kr ";

      case "SEK":
        return "kr ";

      case "DKK":
        return "kr ";

      case "USD":
        return "$";

      case "NGN":
        return "₦";

      case "ZAR":
        return "R";

      default:
        return `${currency ?? ""} `;
    }
  }

  function formatAmount(
    amount: number | string,
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
      {
        minimumFractionDigits:
          numericAmount % 1 ===
          0
            ? 0
            : 2,

        maximumFractionDigits: 2,
      },
    )}`;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Selected Price
  |--------------------------------------------------------------------------
  */

  function getPlanPrice(
    plan: organizerPlanConfig,
  ) {
    return plan.pricing?.[
      billingCountry
    ]?.[billingInterval] ?? null;
  }

  /*
  |--------------------------------------------------------------------------
  | Feature Formatting
  |--------------------------------------------------------------------------
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
  | Plan Name Formatting
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
    plan: organizerPlan,
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
      | Selected Pricing
      |--------------------------------------------------------------------------
      */

      const selectedPlan =
        plans.find(
          (item) =>
            item.plan ===
            plan,
        );

      const pricing =
        selectedPlan
          ? getPlanPrice(
              selectedPlan,
            )
          : null;

      if (!pricing) {
        throw new Error(
          `Pricing is not currently available for ${selectedCountry.label}.`,
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
      | Create Checkout
      |--------------------------------------------------------------------------
      */

      const response =
        await createBillingCheckout({
          plan,

          country:
            billingCountry,

          interval:
            billingInterval,

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
        "BILLING CHECKOUT ERROR:",
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
    plan: organizerPlan,
  ) {
    if (!subscription) {
      return false;
    }

    if (
      subscription.status ===
      "ACTIVE"
    ) {
      return (
        subscription.plan ===
        plan
      );
    }

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
    | Expired
    |--------------------------------------------------------------------------
    */

    if (
      trialDaysRemaining <= 0
    ) {
      return (
        <section className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-[28px] border border-red-500/20 bg-red-500/[0.06]">
          <div className="px-6 py-6 md:px-8">

            <div className="flex items-center gap-3">

              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 text-sm text-red-400">
                !
              </span>

              <p className="text-sm font-semibold text-red-300">
                Your free trial has ended
              </p>

            </div>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-red-200/50">
              Choose an organizer plan below
              to continue using WOWYOU's
              event management infrastructure.
            </p>

          </div>
        </section>
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Active
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

        <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#3E86A4]/10 blur-[120px]" />

        <div className="pointer-events-none absolute -right-40 top-20 h-[450px] w-[450px] rounded-full bg-[#3E86A4]/[0.06] blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-14 pt-12 md:px-10 md:pb-20 md:pt-16 lg:px-12">

          <div className="flex items-center gap-3">

            <div className="h-px w-10 bg-[#3E86A4]" />

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#3E86A4]">
              WOWYOU
            </p>

          </div>

          <div className="mt-8 max-w-4xl">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/30">
              Organizer Infrastructure
            </p>

            <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-[-0.04em] md:text-6xl lg:text-7xl">
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

          {organization && (
            <div className="mt-8 inline-flex max-w-full flex-wrap items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2.5">

              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3E86A4]/15 text-xs font-bold text-[#3E86A4]">
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
                      subscription.currency,
                    )}

                    <span className="ml-1 text-xs font-normal text-white/30">
                      /{" "}
                      {String(
                        subscription.interval,
                      ).toLowerCase()}
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
        {/* PRICING CONTROLS */}
        {/* ============================================================ */}

        <section className="mt-14">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <p className="text-[10px] font-bold uppercase leading-5 tracking-[0.16em] text-[#3E86A4] sm:text-xs sm:tracking-[0.24em]">
                Choose Your Infrastructure
              </p>

              <h2 className="mt-3 max-w-2xl text-3xl font-black leading-[1.08] tracking-[-0.025em] md:text-4xl">
                Plans built around
                <br className="hidden sm:block" />
                how you run events.
              </h2>

            </div>

            {/* ====================================================== */}
            {/* CONTROLS */}
            {/* ====================================================== */}

            <div className="flex flex-col gap-3 sm:flex-row">

              {/* Country */}

              <div className="relative">

                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
                  Billing Country
                </label>

                <select
                  value={
                    billingCountry
                  }
                  onChange={(e) =>
                    setBillingCountry(
                      e.target
                        .value as BillingCountry,
                    )
                  }
                  className="min-w-[220px] appearance-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 pr-10 text-sm font-semibold text-white outline-none transition hover:border-white/20 focus:border-[#3E86A4]/50"
                >
                  {BILLING_COUNTRIES.map(
                    (
                      country,
                    ) => (
                      <option
                        key={
                          country.value
                        }
                        value={
                          country.value
                        }
                        className="bg-[#111]"
                      >
                        {
                          country.label
                        }{" "}
                        ·{" "}
                        {
                          country.currency
                        }
                      </option>
                    ),
                  )}
                </select>

              </div>

              {/* Interval */}

              <div>

                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
                  Billing Cycle
                </label>

                <div className="flex rounded-2xl border border-white/10 bg-white/[0.04] p-1">

                  <button
                    type="button"
                    onClick={() =>
                      setBillingInterval(
                        "MONTH",
                      )
                    }
                    className={[
                      "rounded-xl px-4 py-2.5 text-xs font-bold transition",
                      billingInterval ===
                        "MONTH"
                        ? "bg-white text-black"
                        : "text-white/40 hover:text-white",
                    ].join(" ")}
                  >
                    Monthly
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setBillingInterval(
                        "YEAR",
                      )
                    }
                    className={[
                      "rounded-xl px-4 py-2.5 text-xs font-bold transition",
                      billingInterval ===
                        "YEAR"
                        ? "bg-[#3E86A4] text-white"
                        : "text-white/40 hover:text-white",
                    ].join(" ")}
                  >
                    Yearly
                  </button>

                </div>

              </div>

            </div>

          </div>

          {/* Pricing Context */}

          <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-xs text-white/35">
              Pricing for{" "}
              <span className="font-semibold text-white/65">
                {selectedCountry.label}
              </span>{" "}
              ·{" "}
              <span className="font-semibold text-white/65">
                {selectedCountry.currency}
              </span>
            </p>

            <p className="text-xs text-white/25">
              {billingInterval ===
              "YEAR"
                ? "Annual billing"
                : "Monthly billing"}
            </p>

          </div>

        </section>

        {/* ============================================================ */}
        {/* PLANS */}
        {/* ============================================================ */}

        <div className="mt-8 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">

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

              const price =
                getPlanPrice(
                  plan,
                );

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
                        {formatPlanName(
                          plan.plan,
                        )}
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

                      {price ? (
                        <>
                          <div className="flex items-baseline">

                            <span className="text-4xl font-black tracking-tight text-white">
                              {formatAmount(
                                price.amount,
                                price.currency,
                              )}
                            </span>

                            <span className="ml-2 text-sm text-white/30">
                              /{" "}
                              {billingInterval ===
                              "YEAR"
                                ? "year"
                                : "month"}
                            </span>

                          </div>

                          {billingInterval ===
                            "YEAR" && (
                            <p className="mt-2 text-xs text-[#3E86A4]">
                              Save with annual
                              billing
                            </p>
                          )}

                          {billingInterval ===
                            "MONTH" && (
                            <p className="mt-2 text-xs text-white/25">
                              Flexible monthly
                              billing
                            </p>
                          )}

                        </>
                      ) : (
                        <div>

                          <p className="text-lg font-bold text-white/50">
                            Unavailable
                          </p>

                          <p className="mt-2 text-xs leading-5 text-white/25">
                            Pricing for{" "}
                            {
                              selectedCountry.label
                            }{" "}
                            is not currently
                            available.
                          </p>

                        </div>
                      )}

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

                    {/* Checkout */}

                    <button
                      type="button"
                      disabled={
                        billingLoading ||
                        checkoutPlan !==
                          null ||
                        current ||
                        !price
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
                        !price
                          ? "cursor-not-allowed opacity-40"
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
                            : price
                              ? "Start Free Trial"
                              : "Unavailable"}
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
                  Secure billing
                </p>

                <p className="mt-1 max-w-xl text-xs leading-5 text-white/30">
                  Choose monthly flexibility or
                  save with annual billing. Your
                  currency and pricing are based
                  on your selected billing country.
                  Payments are securely processed
                  through Revolut.
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