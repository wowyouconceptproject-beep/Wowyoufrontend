import { apiFetch } from "@/lib/api";

export interface Staff {
  id: string;

  name: string;

  email?: string;

  phone?: string;

  role: string;

  station?: string;

  accessCode: string;

  permissions: string[];

  isActive: boolean;

  isRevoked: boolean;

  lastUsedAt?: string;

  createdAt: string;
}

export interface CreateStaffPayload {
  name: string;

  email?: string;

  phone?: string;

  role: string;

  station?: string;

  permissions: string[];
}

export interface StaffResponse {
  success: boolean;

  staff: Staff;

  message?: string;
}

export interface StaffListResponse {
  success: boolean;

  staff: Staff[];

  message?: string;
}

export function getStaff(
  eventId: string
) {
  return apiFetch<StaffListResponse>(
    `/events/${eventId}/staff`
  );
}

export function createStaff(
  eventId: string,
  data: CreateStaffPayload
) {
  return apiFetch<StaffResponse>(
    `/events/${eventId}/staff`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export function updateStaff(
  eventId: string,
  staffId: string,
  data: Partial<CreateStaffPayload>
) {
  return apiFetch<StaffResponse>(
    `/events/${eventId}/staff/${staffId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

export function deleteStaff(
  eventId: string,
  staffId: string
) {
  return apiFetch<{
    success: boolean;
    message?: string;
  }>(
    `/events/${eventId}/staff/${staffId}`,
    {
      method: "DELETE",
    }
  );
}

export function toggleStaff(
  eventId: string,
  staffId: string
) {
  return apiFetch<StaffResponse>(
    `/events/${eventId}/staff/${staffId}/toggle`,
    {
      method: "PATCH",
    }
  );
}

export function regenerateAccessCode(
  eventId: string,
  staffId: string
) {
  return apiFetch<StaffResponse>(
    `/events/${eventId}/staff/${staffId}/regenerate`,
    {
      method: "PATCH",
    }
  );
}