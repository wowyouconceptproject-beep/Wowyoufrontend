import { apiFetch } from "@/lib/api";

/*
|--------------------------------------------------------------------------
| Create Purchase
|--------------------------------------------------------------------------
*/

export interface CreatePurchasePayload {
  ticketTypeId: string;

  quantity: number;

  /*
  |--------------------------------------------------------------------------
  | Checkout Channel
  |--------------------------------------------------------------------------
  |
  | mobile = existing attendee mobile app
  | web    = public web attendee checkout
  |
  | Optional so existing mobile callers remain compatible.
  |
  */

  channel?: "mobile" | "web";
}

/*
|--------------------------------------------------------------------------
| Purchase
|--------------------------------------------------------------------------
*/

export interface Purchase {
  id: string;

  userId: string;

  eventId: string;

  ticketTypeId: string;

  quantity: number;

  /*
  |--------------------------------------------------------------------------
  | Amount
  |--------------------------------------------------------------------------
  */

  amount?: string | number;

  /*
  |--------------------------------------------------------------------------
  | Legacy Compatibility
  |--------------------------------------------------------------------------
  |
  | Some existing frontend components may still reference these fields.
  |
  */

  unitPrice?: string | number;

  totalAmount?: string | number;

  currency: string;

  status: string;

  paymentProvider?: string | null;

  paymentReference?: string | null;

  paymentMethod?: string | null;

  gatewayStatus?: string | null;

  paymentCompletedAt?: string | null;

  createdAt: string;

  updatedAt: string;
}

/*
|--------------------------------------------------------------------------
| Create Purchase Response
|--------------------------------------------------------------------------
*/

export interface CreatePurchaseResponse {
  success: boolean;

  paymentRequired: boolean;

  checkoutUrl: string | null;

  purchase: Purchase;

  message?: string;
}

/*
|--------------------------------------------------------------------------
| Create Purchase
|--------------------------------------------------------------------------
|
| Used by:
|
| • Attendee mobile app
| • Public web attendee checkout
|
| The backend determines the Revolut return destination from the
| checkout channel.
|
*/

export function createPurchase(
  data: CreatePurchasePayload,
) {
  return apiFetch<CreatePurchaseResponse>(
    "/purchase/create",
    {
      method: "POST",

      body: JSON.stringify({
        ticketTypeId:
          data.ticketTypeId,

        quantity:
          data.quantity,

        channel:
          data.channel ??
          "mobile",
      }),
    },
  );
}

/*
|--------------------------------------------------------------------------
| Purchase Payment Status
|--------------------------------------------------------------------------
*/

export interface PurchasePaymentStatus {
  id: string;

  status: string;

  gatewayStatus?: string | null;

  paymentProvider?: string | null;

  paymentReference?: string | null;

  paymentCompletedAt?: string | null;

  quantity: number;

  amount: string | number;

  currency: string;

  event?: {
    id: string;

    title: string;
  } | null;

  ticket?: {
    id: string;

    name: string;
  } | null;

  passes?: {
    id: string;
  }[];

  hasPass?: boolean;
}

export interface PurchasePaymentStatusResponse {
  success: boolean;

  purchase: PurchasePaymentStatus;

  message?: string;
}

/*
|--------------------------------------------------------------------------
| Get Purchase Payment Status
|--------------------------------------------------------------------------
|
| Used after returning from Revolut.
|
| Payment confirmation remains controlled by the backend webhook.
|
*/

export function getPurchasePaymentStatus(
  purchaseId: string,
) {
  return apiFetch<PurchasePaymentStatusResponse>(
    `/purchase/${purchaseId}/status`,
  );
}

/*
|--------------------------------------------------------------------------
| My Ticket Event
|--------------------------------------------------------------------------
*/

export interface MyTicketEvent {
  id: string;

  title: string;

  venue: string;

  city?: string | null;

  country?: string | null;

  coverImage?: string | null;

  featuredImage?: string | null;

  startDate: string;

  endDate: string;

  currency: string;
}

/*
|--------------------------------------------------------------------------
| My Ticket Type
|--------------------------------------------------------------------------
*/

export interface MyTicketType {
  id: string;

  name: string;

  price: string | number;
}

/*
|--------------------------------------------------------------------------
| Event Pass
|--------------------------------------------------------------------------
|
| These are the actual attendee passes created by:
|
| ticket-issuance.service.ts
|
*/

export interface MyTicketPass {
  id: string;

  purchaseId: string;

  passNumber: string;

  qrToken: string;

  nfcToken: string;

  isActive: boolean;

  isRevoked: boolean;

  nfcEnabled: boolean;

  issuedAt: string;

  createdAt: string;

  updatedAt?: string;
}

/*
|--------------------------------------------------------------------------
| Ticket User
|--------------------------------------------------------------------------
*/

export interface MyTicketUser {
  id: string;

  firstName: string;

  lastName: string;

  attendeeProfile?: {
    avatar?: string | null;

    profession?: string | null;

    company?: string | null;

    jobTitle?: string | null;
  } | null;
}

/*
|--------------------------------------------------------------------------
| Ticket Check-In
|--------------------------------------------------------------------------
*/

export interface MyTicketCheckIn {
  id: string;

  createdAt?: string;

  checkedInAt?: string;

  status?: string;
}

/*
|--------------------------------------------------------------------------
| My Ticket
|--------------------------------------------------------------------------
|
| Matches the backend response returned by:
|
| GET /purchase/my
|
| Backend:
|
| ticketPurchase
| ├── event
| ├── ticket
| ├── passes
| ├── user
| │   └── attendeeProfile
| └── checkIn
|
*/

export interface MyTicket {
  id: string;

  userId: string;

  eventId: string;

  ticketTypeId: string;

  quantity: number;

  amount: string | number;

  currency: string;

  status: string;

  paymentProvider?: string | null;

  paymentReference?: string | null;

  paymentCompletedAt?: string | null;

  createdAt: string;

  updatedAt: string;

  event: MyTicketEvent;

  ticket: MyTicketType;

  passes: MyTicketPass[];

  user: MyTicketUser;

  checkIn?: MyTicketCheckIn | null;
}

/*
|--------------------------------------------------------------------------
| My Tickets Response
|--------------------------------------------------------------------------
*/

export interface MyTicketsResponse {
  success: boolean;

  tickets: MyTicket[];

  message?: string;
}

/*
|--------------------------------------------------------------------------
| Get My Tickets
|--------------------------------------------------------------------------
|
| Used by:
|
| • Attendee web dashboard
| • Attendee mobile app
|
| Both consume the same ticket/purchase system.
|
*/

export function getMyTickets() {
  return apiFetch<MyTicketsResponse>(
    "/purchase/my",
  );
}