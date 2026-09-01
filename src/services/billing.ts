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
| Keep this aligned with backend:
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
| Price
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
*/

export interface PlanPricing {
  MONTH: BillingPrice;

  YEAR: BillingPrice;
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

  pricing?: Partial<
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

  interval: string;

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
| Pricing is now resolved by the backend using:
|
| plan + country + interval
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
| Checkout Response
|--------------------------------------------------------------------------
*/

export interface CreateBillingCheckoutResponse {
  success: boolean;

  checkoutUrl: string;

  subscriptionId: string;

  revolutSubscriptionId: string;

  setupOrderId: string;

  pricing?: BillingPrice;

  message?: string;
}

/*
|--------------------------------------------------------------------------
| Get Plans
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
| Create Checkout
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