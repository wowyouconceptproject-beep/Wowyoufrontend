import { apiFetch } from "@/lib/api";

/*
|--------------------------------------------------------------------------
| Organizer Plans
|--------------------------------------------------------------------------
*/

export type organizerPlan =
  | "STARTER"
  | "PROFESSIONAL"
  | "BUSINESS"
  | "ENTERPRISE";

/*
|--------------------------------------------------------------------------
| Billing Interval
|--------------------------------------------------------------------------
*/

export type BillingInterval =
  | "MONTH"
  | "YEAR";

/*
|--------------------------------------------------------------------------
| Billing Country
|--------------------------------------------------------------------------
|
| Keep this aligned with the backend billing configuration.
|
| GB → United Kingdom
| EU → Eurozone
| CH → Switzerland
| NO → Norway
| SE → Sweden
| DK → Denmark
| US → United States
|
|--------------------------------------------------------------------------
*/

export type BillingCountry =
  | "GB"
  | "EU"
  | "CH"
  | "NO"
  | "SE"
  | "DK"
  | "US";

/*
|--------------------------------------------------------------------------
| Billing Price
|--------------------------------------------------------------------------
|
| Public pricing information returned by the backend.
|
| Stripe Price IDs are NEVER exposed as part of the public
| pricing configuration.
|
| The backend resolves the correct Stripe Price server-side
| using:
|
| country + plan + interval
|
|--------------------------------------------------------------------------
*/

export interface BillingPrice {
  amount: number;

  currency: string;
}

/*
|--------------------------------------------------------------------------
| Plan Pricing
|--------------------------------------------------------------------------
|
| Every supported country can contain monthly and yearly pricing.
|
|--------------------------------------------------------------------------
*/

export interface PlanPricing {
  MONTH: BillingPrice | null;

  YEAR: BillingPrice | null;
}

/*
|--------------------------------------------------------------------------
| Organizer Plan Configuration
|--------------------------------------------------------------------------
*/

export interface organizerPlanConfig {
  plan: organizerPlan;

  name: string;

  description: string;

  features: string[];

  pricing: Partial<
    Record<
      BillingCountry,
      PlanPricing
    >
  >;
}

/*
|--------------------------------------------------------------------------
| Plans Response
|--------------------------------------------------------------------------
*/

export interface BillingPlansResponse {
  success: boolean;

  plans: organizerPlanConfig[];

  message?: string;
}

/*
|--------------------------------------------------------------------------
| Subscription Status
|--------------------------------------------------------------------------
|
| These values mirror the backend SubscriptionStatus enum.
|
|--------------------------------------------------------------------------
*/

export type SubscriptionStatus =
  | "PENDING"
  | "ACTIVE"
  | "TRIALING"
  | "PAST_DUE"
  | "CANCELED"
  | "EXPIRED";

/*
|--------------------------------------------------------------------------
| Subscription Provider
|--------------------------------------------------------------------------
*/

export type BillingProvider =
  | "STRIPE"
  | string;

/*
|--------------------------------------------------------------------------
| Organization Subscription
|--------------------------------------------------------------------------
*/

export interface OrganizationSubscription {
  id: string;

  organizationId: string;

  plan: organizerPlan;

  status: SubscriptionStatus;

  currency: string;

  amount: string | number;

  interval: BillingInterval;

  provider?: BillingProvider | null;

  providerCustomerId?: string | null;

  providerSubscriptionId?: string | null;

  providerPriceId?: string | null;

  currentPeriodStart?: string | null;

  currentPeriodEnd?: string | null;

  cancelAtPeriodEnd: boolean;

  canceledAt?: string | null;

  createdAt: string;

  updatedAt: string;
}

/*
|--------------------------------------------------------------------------
| Subscription Response
|--------------------------------------------------------------------------
*/

export interface SubscriptionResponse {
  success: boolean;

  subscription:
    | OrganizationSubscription
    | null;

  message?: string;
}

/*
|--------------------------------------------------------------------------
| Create Billing Checkout Payload
|--------------------------------------------------------------------------
|
| The frontend sends the user's selected:
|
| - plan
| - country
| - interval
| - customer information
| - success/redirect URL
|
| The backend resolves:
|
| - amount
| - currency
| - Stripe Product
| - Stripe Price
| - Stripe Checkout Session
|
|--------------------------------------------------------------------------
*/

export interface CreateBillingCheckoutPayload {
  plan: organizerPlan;

  country: BillingCountry;

  interval: BillingInterval;

  fullName: string;

  email: string;

  redirectUrl: string;
}

/*
|--------------------------------------------------------------------------
| Checkout Pricing
|--------------------------------------------------------------------------
|
| Returned after the backend successfully creates the
| Stripe subscription Checkout Session.
|
|--------------------------------------------------------------------------
*/

export interface CheckoutPricing {
  amount: number;

  currency: string;

  interval: BillingInterval;

  country: BillingCountry;

  plan: organizerPlan;
}

/*
|--------------------------------------------------------------------------
| Create Billing Checkout Response
|--------------------------------------------------------------------------
|
| Stripe is now the payment provider.
|
| The frontend receives:
|
| checkoutUrl
| subscriptionId
| stripeSessionId
| stripePriceId
|
| The frontend does NOT receive or use:
|
| - Revolut subscription IDs
| - Revolut setup order IDs
| - Revolut payment URLs
|
|--------------------------------------------------------------------------
*/

export interface CreateBillingCheckoutResponse {
  success: boolean;

  checkoutUrl: string;

  subscriptionId: string;

  stripeSessionId: string;

  stripePriceId: string;

  pricing: CheckoutPricing;

  message?: string;
}

/*
|--------------------------------------------------------------------------
| Get Billing Plans
|--------------------------------------------------------------------------
|
| Returns:
|
| - plan metadata
| - features
| - country pricing
| - monthly pricing
| - yearly pricing
|
| Stripe Price IDs are resolved server-side and are not required
| by the frontend pricing UI.
|
|--------------------------------------------------------------------------
*/

export function getBillingPlans() {
  return apiFetch<BillingPlansResponse>(
    "/api/billing/plans",
  );
}

/*
|--------------------------------------------------------------------------
| Get Current Subscription
|--------------------------------------------------------------------------
*/

export function getBillingSubscription() {
  return apiFetch<SubscriptionResponse>(
    "/api/billing/subscription",
  );
}

/*
|--------------------------------------------------------------------------
| Create Billing Checkout
|--------------------------------------------------------------------------
|
| Backend creates the Stripe Checkout Session using:
|
| country + plan + interval
|
| The frontend then redirects the organizer directly to:
|
| Stripe Checkout
|
|--------------------------------------------------------------------------
*/

export function createBillingCheckout(
  data: CreateBillingCheckoutPayload,
) {
  return apiFetch<CreateBillingCheckoutResponse>(
    "/api/billing/checkout",
    {
      method: "POST",

      body: JSON.stringify(data),
    },
  );
}