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
| This is the public pricing information returned to the frontend.
|
| IMPORTANT:
|
| Revolut plan variation IDs are NEVER exposed here.
|
| The backend keeps those IDs server-side and resolves them from:
|
| country + plan + interval
|
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
| Every supported country contains monthly and yearly pricing.
|
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
| Subscription
|--------------------------------------------------------------------------
*/

export interface OrganizationSubscription {
  id: string;

  organizationId: string;

  plan: organizerPlan;

  status: string;

  currency: string;

  amount: string | number;

  interval: BillingInterval;

  provider?: string | null;

  providerCustomerId?: string | null;

  providerSubscriptionId?: string | null;

  providerPriceId?: string | null;

  providerSetupOrderId?: string | null;

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
| Checkout Payload
|--------------------------------------------------------------------------
|
| The frontend sends the user's selected:
|
| plan
| country
| interval
|
| The backend then resolves:
|
| amount
| currency
| Revolut plan variation ID
|
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
| Revolut subscription checkout.
|
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
| Checkout Response
|--------------------------------------------------------------------------
*/

export interface CreateBillingCheckoutResponse {
  success: boolean;

  checkoutUrl: string;

  subscriptionId: string;

  revolutSubscriptionId: string;

  setupOrderId: string;

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
| Revolut variation IDs are NOT returned.
|
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
| Backend resolves the correct Revolut variation using:
|
| country + plan + interval
|
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