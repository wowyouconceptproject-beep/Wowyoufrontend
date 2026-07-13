import { apiFetch } from "@/lib/api";

/*
|--------------------------------------------------------------------------
| Models
|--------------------------------------------------------------------------
*/

export interface VendorApplication {
  id: string;

  eventId: string;

  businessName: string;

  category: string;

  contactName: string;

  email: string;

  phone: string;

  description: string;

  boothSize?: string | null;

  message?: string | null;

  status:
    | "PENDING"
    | "APPROVED"
    | "REJECTED";

  reviewedAt?: string | null;

  approvedAt?: string | null;

  rejectedAt?: string | null;

  createdAt: string;
}

export interface VendorApplicationsResponse {
  success: boolean;

  applications: VendorApplication[];
}

export interface VendorApplicationResponse {
  success: boolean;

  application: VendorApplication;

  message?: string;
}

/*
|--------------------------------------------------------------------------
| Organizer
|--------------------------------------------------------------------------
*/

export function getVendorApplications(
  eventId: string,
) {
  return apiFetch<VendorApplicationsResponse>(
    `/vendors/events/${eventId}`,
  );
}

export function approveVendor(
  applicationId: string,
) {
  return apiFetch<VendorApplicationResponse>(
    `/vendors/${applicationId}/approve`,
    {
      method: "PATCH",
    },
  );
}

export function rejectVendor(
  applicationId: string,
) {
  return apiFetch<VendorApplicationResponse>(
    `/vendors/${applicationId}/reject`,
    {
      method: "PATCH",
    },
  );
}

export function withdrawVendorApplication(
  applicationId: string,
) {
  return apiFetch<{
    success: boolean;
    message: string;
  }>(
    `/vendors/${applicationId}`,
    {
      method: "DELETE",
    },
  );
}