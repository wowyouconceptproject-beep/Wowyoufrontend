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

  /*
  |--------------------------------------------------------------------------
  | Discovery
  |--------------------------------------------------------------------------
  */

  category?: string;

  coverImage?: string;

  featuredImage?: string;

  homepageScore?: number;

  views?: number;

  wishlistCount?: number;

  shareCount?: number;

  featuredUntil?: string;

  isPublic?: boolean;

  vendorApplicationsOpen?: boolean;

  vendorApplicationDeadline?: string;

  maxVendorSlots?: number;

  /*
  |--------------------------------------------------------------------------
  | Organizer
  |--------------------------------------------------------------------------
  */

  status: string;

  capacity?: number;

  organizationId?: string;

  organization?: {
    id: string;

    name: string;
  };

  createdAt?: string;

  updatedAt?: string;

  /*
  |--------------------------------------------------------------------------
  | Dashboard Stats
  |--------------------------------------------------------------------------
  */

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

/*
|--------------------------------------------------------------------------
| Create Event
|--------------------------------------------------------------------------
*/

export function createEvent(
  data: EventPayload,
) {
  return apiFetch<EventResponse>(
    "/events",
    {
      method: "POST",

      body: JSON.stringify(data),
    },
  );
}

/*
|--------------------------------------------------------------------------
| My Events
|--------------------------------------------------------------------------
*/

export function getMyEvents() {
  return apiFetch<EventsResponse>(
    "/events/my",
  );
}

/*
|--------------------------------------------------------------------------
| Event Details
|--------------------------------------------------------------------------
*/

export function getEvent(
  eventId: string,
) {
  return apiFetch<EventResponse>(
    `/events/${eventId}`,
  );
}

/*
|--------------------------------------------------------------------------
| Publish
|--------------------------------------------------------------------------
*/

export function publishEvent(
  eventId: string,
) {
  return apiFetch<EventResponse>(
    `/events/${eventId}/publish`,
    {
      method: "PATCH",
    },
  );
}

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export function updateEvent(
  eventId: string,
  data: Partial<EventPayload>,
) {
  return apiFetch<EventResponse>(
    `/events/${eventId}`,
    {
      method: "PATCH",

      body: JSON.stringify(data),
    },
  );
}

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export function deleteEvent(
  eventId: string,
) {
  return apiFetch<DeleteEventResponse>(
    `/events/${eventId}`,
    {
      method: "DELETE",
    },
  );
}

/*
|--------------------------------------------------------------------------
| Archive
|--------------------------------------------------------------------------
*/

export function archiveEvent(
  eventId: string,
) {
  return apiFetch<EventResponse>(
    `/events/${eventId}/archive`,
    {
      method: "PATCH",
    },
  );
}