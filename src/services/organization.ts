import { apiFetch } from "@/lib/api";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  verified: boolean;
  createdAt: string;

  events?: any[];
}

export interface OrganizationResponse {
  success: boolean;

  organization: Organization;

  message?: string;
}

export function getMyOrganization() {
  return apiFetch<OrganizationResponse>(
    "/organizations/me"
  );
}

export function createOrganization(
  name: string,
  slug: string
) {
  return apiFetch<OrganizationResponse>(
    "/organizations",
    {
      method: "POST",
      body: JSON.stringify({
        name,
        slug,
      }),
    }
  );
}

export function updateOrganization(
  data: Partial<Organization>
) {
  return apiFetch<OrganizationResponse>(
    "/organizations/me",
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}