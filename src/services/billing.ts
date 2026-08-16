import { apiFetch } from "@/lib/api";

/*
|--------------------------------------------------------------------------
| Organizer Plans
|--------------------------------------------------------------------------
*/

export type OrganizerPlan =
  | "STARTER"
  | "PROFESSIONAL"
  | "BUSINESS"
  | "ENTERPRISE";

export interface OrganizerPlanConfig {
  plan: OrganizerPlan;

  name: string;

  amount: number;

  currency: string;

  interval: string;

  description: string;

  features: string[];
}

/*
|--------------------------------------------------------------------------
| Plans Response
|--------------------------------------------------------------------------
*/

export interface BillingPlansResponse {
  success: boolean;

  plans: OrganizerPlanConfig[];

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

  plan: OrganizerPlan;

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

export interface SubscriptionResponse {
  success: boolean;

  subscription:
    | OrganizationSubscription
    | null;

  message?: string;
}

/*
|--------------------------------------------------------------------------
| Checkout
|--------------------------------------------------------------------------
*/

export interface CreateBillingCheckoutPayload {
  plan: OrganizerPlan;

  fullName: string;

  email: string;

  redirectUrl: string;
}

export interface CreateBillingCheckoutResponse {
  success: boolean;

  checkoutUrl: string;

  subscriptionId: string;

  revolutSubscriptionId: string;

  setupOrderId: string;

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