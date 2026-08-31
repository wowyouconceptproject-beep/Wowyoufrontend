import { apiFetch } from "@/lib/api";

/*
|--------------------------------------------------------------------------
| Ticket
|--------------------------------------------------------------------------
*/

export interface EventTicket {
  id: string;

  name: string;

  description?: string | null;

  color?: string | null;

  price: number | string;

  quantity: number;

  sold: number;

  isActive: boolean;
}

/*
|--------------------------------------------------------------------------
| Event Payload
|--------------------------------------------------------------------------
*/

export interface EventPayload {
  title: string;

  description?: string;

  /*
  |--------------------------------------------------------------------------
  | Location
  |--------------------------------------------------------------------------
  */

  venue: string;
  venueAddress?: string;
  city?: string;
  country?: string;

  /*
  | Google Maps coordinates
  */

  venueLatitude?: number;
  venueLongitude?: number;

  /*
  |--------------------------------------------------------------------------
  | Time
  |--------------------------------------------------------------------------
  */

  startDate: string;
  endDate: string;

  /*
  |--------------------------------------------------------------------------
  | Configuration
  |--------------------------------------------------------------------------
  */

  capacity: number;
  currency: string;

  isPublic?: boolean;

  /*
  |--------------------------------------------------------------------------
  | Media
  |--------------------------------------------------------------------------
  */

  coverImage?: string;
  featuredImage?: string;
  bannerUrl?: string;

  /*
  |--------------------------------------------------------------------------
  | Discovery / Marketplace
  |--------------------------------------------------------------------------
  */

  category?: string;

  vendorApplicationsOpen?: boolean;

  vendorApplicationDeadline?: string;

  maxVendorSlots?: number;
}

/*
|--------------------------------------------------------------------------
| Event
|--------------------------------------------------------------------------
*/

export interface Event {
  id: string;

  title: string;

  description?: string;

  /*
  |--------------------------------------------------------------------------
  | Location
  |--------------------------------------------------------------------------
  */

  venue: string;

  venueAddress?: string;

  city?: string;

  country?: string;

  venueLatitude?: number;

  venueLongitude?: number;

  /*
  |--------------------------------------------------------------------------
  | Time
  |--------------------------------------------------------------------------
  */

  startDate: string;

  endDate: string;

  /*
  |--------------------------------------------------------------------------
  | Configuration
  |--------------------------------------------------------------------------
  */

  currency: string;

  capacity?: number;

  isPublic?: boolean;

  /*
  |--------------------------------------------------------------------------
  | Media
  |--------------------------------------------------------------------------
  */

  bannerUrl?: string;

  coverImage?: string;

  featuredImage?: string;

  /*
  |--------------------------------------------------------------------------
  | Discovery
  |--------------------------------------------------------------------------
  */

  category?: string;

  homepageScore?: number;

  views?: number;

  wishlistCount?: number;

  shareCount?: number;

  featuredUntil?: string;

  /*
  |--------------------------------------------------------------------------
  | Ticketing
  |--------------------------------------------------------------------------
  |
  | Returned by:
  |
  | GET /events/public/:id
  |
  */

  tickets?: EventTicket[];

  /*
  |--------------------------------------------------------------------------
  | Vendor Marketplace
  |--------------------------------------------------------------------------
  */

  vendorApplicationsOpen?: boolean;

  vendorApplicationDeadline?: string;

  maxVendorSlots?: number;

  /*
  |--------------------------------------------------------------------------
  | Organizer
  |--------------------------------------------------------------------------
  */

  status: string;

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

/*
|--------------------------------------------------------------------------
| Event Response
|--------------------------------------------------------------------------
*/

export interface EventResponse {
  success: boolean;

  event: Event;

  message?: string;
}

/*
|--------------------------------------------------------------------------
| Events Response
|--------------------------------------------------------------------------
*/

export interface EventsResponse {
  success: boolean;

  events: Event[];

  message?: string;
}

/*
|--------------------------------------------------------------------------
| Delete Event Response
|--------------------------------------------------------------------------
*/

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
| Public Event Details
|--------------------------------------------------------------------------
|
| No authentication is required.
|
| The backend returns:
|
| - Event information
| - Organization information
| - Active ticket types
|
*/

export function getPublicEvent(
  eventId: string,
) {
  return apiFetch<EventResponse>(
    `/events/public/${eventId}`,
    {
      withAuth: false,
    },
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

