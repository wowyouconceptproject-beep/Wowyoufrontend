import { apiFetch } from "@/lib/api";

export interface VendorApplicationPayload {
  eventId: string;

  businessName: string;

  category: string;

  contactName: string;

  email: string;

  phone: string;

  description: string;

  boothSize?: string;

  message?: string;

  password?: string;
}

export interface VendorApplication {
  id: string;

  eventId: string;

  eventTitle: string;

  businessName: string;

  category: string;

  contactName: string;

  email: string;

  phone: string;

  description: string;

  boothSize?: string;

  status: "PENDING" | "APPROVED" | "REJECTED";

  createdAt: string;
}

export interface VendorAuth {
  token: string;

  vendor: {
    id: string;

    businessName: string;

    email: string;
  };
}

export interface VendorApplicationResponse {
  success: boolean;

  application: VendorApplication;

  token?: string;

  vendor?: VendorAuth["vendor"];

  message?: string;
}

export interface VendorApplicationsResponse {
  success: boolean;

  applications: VendorApplication[];
}

export interface VendorLoginResponse {
  success: boolean;

  token: string;

  vendor: VendorAuth["vendor"];
}

/*
|--------------------------------------------------------------------------
| Apply
|--------------------------------------------------------------------------
*/

export function applyAsVendor(
  data: VendorApplicationPayload,
) {
  return apiFetch<VendorApplicationResponse>(
    "/vendor/apply",
    {
      method: "POST",

      body: JSON.stringify(data),
    },
  );
}

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export function loginVendor(
  email: string,
  password: string,
) {
  return apiFetch<VendorLoginResponse>(
    "/vendor/login",
    {
      method: "POST",

      body: JSON.stringify({
        email,
        password,
      }),
    },
  );
}

/*
|--------------------------------------------------------------------------
| My Applications
|--------------------------------------------------------------------------
*/

export function getMyApplications() {
  return apiFetch<VendorApplicationsResponse>(
    "/vendor/applications",
  );
}