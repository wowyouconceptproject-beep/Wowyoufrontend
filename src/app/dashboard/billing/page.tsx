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
  getBillingSubscription,
  OrganizerPlan,
  OrganizerPlanConfig,
  OrganizationSubscription,
} from "@/services/billing";

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
      "Everything you need to start running events.",
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
    loading: authLoading,
  } = useAuth();

  const [plans, setPlans] =
    useState<OrganizerPlanConfig[]>(
      FALLBACK_PLANS,
    );

  const [
    subscription,
    setSubscription,
  ] =
    useState<OrganizationSubscription | null>(
      null,
    );

  const [billingLoading, setBillingLoading] =
    useState(true);

  const [checkoutPlan, setCheckoutPlan] =
    useState<OrganizerPlan | null>(
      null,
    );

  const [error, setError] =
    useState<string | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Load Billing
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

      const [
        plansResponse,
        subscriptionResponse,
      ] = await Promise.all([
        getBillingPlans(),
        getBillingSubscription(),
      ]);

      if (
        plansResponse.success &&
        plansResponse.plans?.length
      ) {
        setPlans(
          plansResponse.plans,
        );
      }

      if (
        subscriptionResponse.success
      ) {
        setSubscription(
          subscriptionResponse.subscription,
        );
      }
    } catch (err) {
      console.error(
        "Failed to load billing:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your billing information.",
      );
    } finally {
      setBillingLoading(false);
    }
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
      | Redirect to Revolut
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
    return (
      subscription?.plan ===
        plan &&
      (
        subscription.status ===
          "ACTIVE" ||
        subscription.status ===
          "TRIALING"
      )
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5]">
        <div className="text-sm text-neutral-500">
          Loading your account...
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
    <main className="min-h-screen bg-[#f7f7f5] px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl">

        {/* --------------------------------------------------------------- */}
        {/* Header */}
        {/* --------------------------------------------------------------- */}

        <div className="mx-auto max-w-3xl text-center">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Organizer Plans
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-neutral-950 md:text-5xl">
            Choose the plan that fits
            your events.
          </h1>

          <p className="mt-5 text-base leading-7 text-neutral-600 md:text-lg">
            Everything you need to create,
            manage, sell and operate
            professional events.
          </p>

        </div>

        {/* --------------------------------------------------------------- */}
        {/* Organization */}
        {/* --------------------------------------------------------------- */}

        {organization && (
          <div className="mx-auto mt-8 max-w-4xl text-center">
            <p className="text-sm text-neutral-500">
              Billing for
            </p>

            <p className="mt-1 text-base font-semibold text-neutral-950">
              {organization.name}
            </p>
          </div>
        )}

        {/* --------------------------------------------------------------- */}
        {/* Current Subscription */}
        {/* --------------------------------------------------------------- */}

        {subscription && (
          <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Current plan
                </p>

                <p className="mt-1 text-lg font-semibold text-neutral-950">
                  {subscription.plan}
                </p>

              </div>

              <div className="flex items-center gap-3">

                <span
                  className={[
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    subscription.status ===
                      "ACTIVE" ||
                    subscription.status ===
                      "TRIALING"
                      ? "bg-green-50 text-green-700"
                      : "bg-neutral-100 text-neutral-600",
                  ].join(" ")}
                >
                  {subscription.status}
                </span>

                <span className="text-sm text-neutral-500">
                  £
                  {Number(
                    subscription.amount,
                  ).toLocaleString()}
                  /month
                </span>

              </div>

            </div>

          </div>
        )}

        {/* --------------------------------------------------------------- */}
        {/* Error */}
        {/* --------------------------------------------------------------- */}

        {error && (
          <div className="mx-auto mt-6 max-w-4xl rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* --------------------------------------------------------------- */}
        {/* Plans */}
        {/* --------------------------------------------------------------- */}

        <div className="mt-12 grid gap-6 lg:grid-cols-4">

          {plans.map((plan) => {

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
              <div
                key={plan.plan}
                className={[
                  "relative flex flex-col rounded-3xl border bg-white p-7 shadow-sm transition",
                  featured
                    ? "border-neutral-950 shadow-lg"
                    : "border-neutral-200",
                ].join(" ")}
              >

                {/* Popular Badge */}

                {featured && (
                  <div className="absolute -top-3 left-6 rounded-full bg-neutral-950 px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}

                {/* Plan Header */}

                <div>

                  <h2 className="text-xl font-bold text-neutral-950">
                    {plan.name}
                  </h2>

                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-neutral-600">
                    {plan.description}
                  </p>

                </div>

                {/* Price */}

                <div className="mt-6">

                  <div className="flex items-end gap-1">

                    <span className="text-4xl font-bold tracking-tight text-neutral-950">
                      £
                      {Number(
                        plan.amount,
                      ).toLocaleString()}
                    </span>

                    <span className="mb-1 text-sm text-neutral-500">
                      /month
                    </span>

                  </div>

                </div>

                <div className="my-7 h-px bg-neutral-200" />

                {/* Features */}

                <ul className="flex flex-1 flex-col gap-3">

                  {plan.features.map(
                    (feature) => (
                      <li
                        key={feature}
                        className="flex gap-3 text-sm text-neutral-700"
                      >

                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold">
                          ✓
                        </span>

                        <span>
                          {feature}
                        </span>

                      </li>
                    ),
                  )}

                </ul>

                {/* Checkout Button */}

                <button
                  type="button"
                  disabled={
                    billingLoading ||
                    checkoutPlan !== null ||
                    current
                  }
                  onClick={() =>
                    handleCheckout(
                      plan.plan,
                    )
                  }
                  className={[
                    "mt-8 w-full rounded-xl px-5 py-3.5 text-sm font-semibold transition",
                    current
                      ? "cursor-default bg-neutral-100 text-neutral-500"
                      : featured
                        ? "bg-neutral-950 text-white hover:bg-neutral-800"
                        : "border border-neutral-300 bg-white text-neutral-950 hover:bg-neutral-50",
                    loadingPlan
                      ? "cursor-wait opacity-60"
                      : "",
                  ].join(" ")}
                >
                  {loadingPlan
                    ? "Preparing checkout..."
                    : current
                      ? "Current Plan"
                      : "Choose Plan"}
                </button>

              </div>
            );
          })}

        </div>

        {/* --------------------------------------------------------------- */}
        {/* Loading */}
        {/* --------------------------------------------------------------- */}

        {billingLoading && (
          <div className="mt-8 text-center text-sm text-neutral-500">
            Loading billing information...
          </div>
        )}

        {/* --------------------------------------------------------------- */}
        {/* Footer */}
        {/* --------------------------------------------------------------- */}

        <p className="mt-10 text-center text-xs text-neutral-500">
          All plans are billed monthly.
          Payments are securely processed
          through Revolut.
        </p>

      </div>
    </main>
  );
}