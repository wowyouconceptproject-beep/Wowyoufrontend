import { apiFetch } from "@/lib/api";

export interface Attendee {
  id: string;

  firstName: string;

  lastName: string;

  email: string;

  phone?: string;

  checkedIn: boolean;

  checkedInAt?: string;

  ticketType: string;

  purchaseId: string;

  userId: string;
}

export interface GetAttendeesResponse {
  success: boolean;

  attendees: Attendee[];
}

export function getAttendees(
  eventId: string
) {
  return apiFetch<GetAttendeesResponse>(
    `/events/${eventId}/attendees`
  );
}