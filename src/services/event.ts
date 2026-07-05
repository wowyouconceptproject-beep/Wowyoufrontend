import { apiFetch } from "@/lib/api";

export interface EventPayload {
  title: string;
  description?: string;
  venue: string;
  startDate: string;
  endDate: string;
  currency: string;
  bannerUrl?: string;
  [key: string]: any;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  venue: string;
  startDate: string;
  endDate: string;
  currency: string;
  bannerUrl?: string;

  status: string;

  capacity?: number;

  organizationId?: string;

  createdAt?: string;
  updatedAt?: string;

  stats?: {
    ticketSold: number;
    checkedIn: number;
    revenue: number;
    staff: number;
    onlineStaff: number;
  };
}

export interface EventResponse {
  success: boolean;
  event: Event;
  message?: string;
}

export interface EventsResponse {
  success: boolean;
  events: Event[];
  message?: string;
}

export interface DeleteEventResponse {
  success: boolean;
  message?: string;
}

export function createEvent(
  data: EventPayload
) {
  return apiFetch<EventResponse>(
    "/events",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export function getMyEvents() {
  return apiFetch<EventsResponse>(
    "/events/my"
  );
}

export function getEvent(
  eventId: string
) {
  return apiFetch<EventResponse>(
    `/events/${eventId}`
  );
}

export function publishEvent(
  eventId: string
) {
  return apiFetch<EventResponse>(
    `/events/${eventId}/publish`,
    {
      method: "PATCH",
    }
  );
}

export function updateEvent(
  eventId: string,
  data: Partial<EventPayload>
) {
  return apiFetch<EventResponse>(
    `/events/${eventId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

export function deleteEvent(
  eventId: string
) {
  return apiFetch<DeleteEventResponse>(
    `/events/${eventId}`,
    {
      method: "DELETE",
    }
  );
}

export function archiveEvent(
  eventId: string
) {
  return apiFetch<EventResponse>(
    `/events/${eventId}/archive`,
    {
      method: "PATCH",
    }
  );
}