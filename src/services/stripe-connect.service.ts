import { apiFetch } from "@/lib/api";

/*
|--------------------------------------------------------------------------
| Stripe Connect Types
|--------------------------------------------------------------------------
*/

export interface StripeConnectStatus {
  stripeAccountId: string | null;
  accountType: string | null;
  accountStatus: string | null;

  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  onboardingComplete: boolean;

  currentlyDue: string[];
  eventuallyDue: string[];

  disabledReason: string | null;
}

export interface StripeConnectStatusResponse {
  success: boolean;
  stripe: StripeConnectStatus;
  message?: string;
}

export interface CreateStripeConnectAccountPayload {
  organizationId: string;
  email: string;
  businessName?: string;
  country?: string;
}

export interface StripeConnectAccount {
  id: string;
  type: string | null;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
}

export interface CreateStripeConnectAccountResponse {
  success: boolean;
  account: StripeConnectAccount;
  message?: string;
}

export interface StripeConnectOnboardingResponse {
  success: boolean;
  url: string;
  expiresAt: number;
  stripeAccountId: string;
  message?: string;
}

export interface StripeConnectDashboardResponse {
  success: boolean;
  url: string;
  message?: string;
}

/*
|--------------------------------------------------------------------------
| Create Connect Account
|--------------------------------------------------------------------------
*/

export function createStripeConnectAccount(
  data: CreateStripeConnectAccountPayload,
) {
  return apiFetch<CreateStripeConnectAccountResponse>(
    "/stripe/connect/account",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

/*
|--------------------------------------------------------------------------
| Create / Continue Onboarding
|--------------------------------------------------------------------------
*/

export function createStripeConnectOnboarding(
  data: {
    organizationId: string;
    email?: string;
    country?: string;
  },
) {
  return apiFetch<StripeConnectOnboardingResponse>(
    "/stripe/connect/onboarding",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

/*
|--------------------------------------------------------------------------
| Get Connect Status
|--------------------------------------------------------------------------
*/

export function getStripeConnectStatus(
  organizationId: string,
) {
  return apiFetch<StripeConnectStatusResponse>(
    `/stripe/connect/status/${organizationId}`,
  );
}

/*
|--------------------------------------------------------------------------
| Open Stripe Dashboard
|--------------------------------------------------------------------------
*/

export function getStripeConnectDashboard(
  organizationId: string,
) {
  return apiFetch<StripeConnectDashboardResponse>(
    `/stripe/connect/dashboard/${organizationId}`,
  );
}