import { apiFetch } from "@/lib/api";

export interface Policy {
  key: string;
  name: string;
  required: boolean;
}

export interface PoliciesResponse {
  success: boolean;
  version: string;
  policies: Policy[];
  message?: string;
}

export interface ConsentResponse {
  success: boolean;
  accepted: boolean;
  consent: {
    id: string;
    consentType: string;
    policyVersion: string;
    acceptedAt: string;
    consentStatus: string;
    consentSource?: string;
    reacceptanceRequired: boolean;
  } | null;
  message?: string;
}

export interface AcceptPoliciesPayload {
  fullName: string;
  email: string;
  role: string;
  consentSource: string;
  policiesAccepted: Record<
    string,
    boolean
  >;
  deviceVersion?: string;
}

export function getCurrentPolicies() {
  return apiFetch<PoliciesResponse>(
    "/legal/policies",
    {
      method: "GET",
      withAuth: false,
    },
  );
}

export function getConsentStatus() {
  return apiFetch<ConsentResponse>(
    "/legal/consent",
    {
      method: "GET",
      withAuth: true,
    },
  );
}

export function acceptPolicies(
  data: AcceptPoliciesPayload,
) {
  return apiFetch<ConsentResponse>(
    "/legal/consent",
    {
      method: "POST",
      withAuth: true,
      body: JSON.stringify(data),
    },
  );
}