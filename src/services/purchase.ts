import { apiFetch } from "@/lib/api";

/*
|--------------------------------------------------------------------------
| Create Purchase Payload
|--------------------------------------------------------------------------
*/

export interface CreatePurchasePayload {
  ticketTypeId: string;
  quantity: number;

  /**
   * mobile = existing attendee mobile app
   * web = public web attendee checkout
   *
   * Optional so existing mobile callers remain compatible.
   */
  channel?: "mobile" | "web";
}

/*
|--------------------------------------------------------------------------
| Purchase Quote Payload
|--------------------------------------------------------------------------
*/

export interface PurchaseQuotePayload {
  ticketTypeId: string;
  quantity: number;
}

/*
|--------------------------------------------------------------------------
| Purchase Quote
|--------------------------------------------------------------------------
*/

export interface PurchaseQuote {
  ticketTypeId: string;
  ticketName: string;
  eventId: string;
  eventTitle: string;
  quantity: number;
  currency: string;
  unitPrice: number;
  subtotal: number;
  transactionFee: number;
  amount: number;
  feeFxRate: number | null;
}

/*
|--------------------------------------------------------------------------
| Purchase Quote Response
|--------------------------------------------------------------------------
*/

export interface PurchaseQuoteResponse {
  success: boolean;
  quote: PurchaseQuote;
  message?: string;
}

/*
|--------------------------------------------------------------------------
| Get Purchase Quote
|--------------------------------------------------------------------------
|
| Retrieves the authoritative checkout breakdown before payment.
|
| This endpoint does not create a purchase, reserve inventory,
| or create a Stripe Checkout session.
|
*/

export function getPurchaseQuote(data: PurchaseQuotePayload) {
  return apiFetch<PurchaseQuoteResponse>("/purchase/quote", {
    method: "POST",
    body: JSON.stringify({
      ticketTypeId: data.ticketTypeId,
      quantity: data.quantity,
    }),
  });
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

  /**
   * subtotal and transactionFee are stored separately
   * for financial transparency.
   */
  subtotal?: string | number;
  transactionFee?: string | number;
  feeFxRate?: number | null;
  amount?: string | number;

  /**
   * Legacy compatibility fields.
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
| - Attendee mobile app
| - Public web attendee checkout
|
| The backend determines the payment return destination from
| the checkout channel and recalculates the final amount.
|
| Never submit a trusted subtotal, fee, or total from the frontend.
|
*/

export function createPurchase(data: CreatePurchasePayload) {
  return apiFetch<CreatePurchaseResponse>("/purchase/create", {
    method: "POST",
    body: JSON.stringify({
      ticketTypeId: data.ticketTypeId,
      quantity: data.quantity,
      channel: data.channel ?? "mobile",
    }),
  });
}

/*
|--------------------------------------------------------------------------
| Manual / Offline Ticket Sale
|--------------------------------------------------------------------------
|
| Used by organizers to record tickets sold outside the platform.
|
| Supported payment methods:
| - CASH
| - BANK_TRANSFER
| - POS
| - OTHER
|
| The backend is responsible for validating the organizer,
| ticket inventory, event, buyer, payment details, and price.
|
| Manual sales do not create a Stripe Checkout session.
|
*/

export type ManualSalePaymentMethod =
  | "CASH"
  | "BANK_TRANSFER"
  | "POS"
  | "OTHER";

export interface RecordManualSalePayload {
  eventId: string;
  ticketTypeId: string;
  quantity: number;

  firstName: string;
  lastName: string;
  email: string;
  phone?: string;

  paymentMethod: ManualSalePaymentMethod;
  paymentReference?: string;
}

/*
|--------------------------------------------------------------------------
| Manual Sale Buyer
|--------------------------------------------------------------------------
*/

export interface ManualSaleBuyer {
  id: string;
  email: string;
}

/*
|--------------------------------------------------------------------------
| Manual Sale Response
|--------------------------------------------------------------------------
*/

export interface RecordManualSaleResponse {
  success: boolean;
  message: string;

  purchase?: Purchase;

  buyer?: ManualSaleBuyer;

  /**
   * True when the backend created a new attendee account.
   */
  accountCreated?: boolean;

  /**
   * Indicates whether the account verification email
   * was successfully requested/sent by the backend.
   */
  verificationEmailSent?: boolean;

  /**
   * Indicates whether the backend successfully issued
   * the required event passes.
   */
  passesIssued?: boolean;

  passCount?: number;
}

/*
|--------------------------------------------------------------------------
| Record Manual Sale
|--------------------------------------------------------------------------
|
| POST /purchase/manual-sale
|
| The authenticated organizer records an offline ticket sale.
|
| Expected backend behavior:
| - Validate that the organizer owns the event.
| - Validate ticket availability.
| - Find the buyer by email or create an attendee account.
| - Record the purchase as PAID with zero platform checkout fee.
| - Issue event passes.
| - Send relevant ticket/account emails.
|
| The backend remains authoritative for all validation.
|
*/

export function recordManualSale(data: RecordManualSalePayload) {
  return apiFetch<RecordManualSaleResponse>("/purchase/manual-sale", {
    method: "POST",
    body: JSON.stringify({
      eventId: data.eventId,
      ticketTypeId: data.ticketTypeId,
      quantity: data.quantity,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || undefined,
      paymentMethod: data.paymentMethod,
      paymentReference: data.paymentReference?.trim() || undefined,
    }),
  });
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

  subtotal?: string | number;
  transactionFee?: string | number;
  feeFxRate?: number | null;

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

/*
|--------------------------------------------------------------------------
| Purchase Payment Status Response
|--------------------------------------------------------------------------
*/

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
| Used after returning from the payment provider.
|
| Payment confirmation remains controlled by the backend webhook.
|
*/

export function getPurchasePaymentStatus(purchaseId: string) {
  return apiFetch<PurchasePaymentStatusResponse>(
    `/purchase/${encodeURIComponent(purchaseId)}/status`,
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
| ticket-issuance.service.ts
|
*/

export interface MyTicketPass {
  id: string;
  purchaseId: string;
  passNumber: string;
  qrToken: string;
  nfcToken: string;

  /**
   * Signed JWT generated by POST /pass/:purchaseId/secure-pass.
   * Only this value should be encoded into the entry QR code.
   */
  token?: string | null;

  isActive: boolean;
  isRevoked: boolean;
  nfcEnabled: boolean;
  issuedAt: string;
  createdAt: string;
  updatedAt?: string;
  expiresAt?: string | null;
}

export interface SecureTicketPass {
  id: string;
  passNumber: string;
  qrToken: string;
  nfcToken: string;
  token: string;
  issuedAt: string;
  expiresAt?: string | null;
  active: boolean;
  revoked: boolean;
  nfcEnabled: boolean;
}

export interface SecureTicketPassResponse {
  success: boolean;
  purchase?: unknown;
  passes: SecureTicketPass[];
  message?: string;
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
| GET /purchase/my
|
| Backend:
| ticketPurchase
| â”œâ”€â”€ event
| â”œâ”€â”€ ticket
| â”œâ”€â”€ passes
| â”œâ”€â”€ user
| â”‚   â””â”€â”€ attendeeProfile
| â””â”€â”€ checkIn
|
*/

export interface MyTicket {
  id: string;
  userId: string;
  eventId: string;
  ticketTypeId: string;
  quantity: number;

  subtotal?: string | number;
  transactionFee?: string | number;
  feeFxRate?: number | null;

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
| - Attendee web dashboard
| - Attendee mobile app
|
| Both consume the same ticket/purchase system.
|
*/

export function getMyTickets() {
  return apiFetch<MyTicketsResponse>("/purchase/my");
}

/*
|--------------------------------------------------------------------------
| Get Secure Ticket Passes
|--------------------------------------------------------------------------
|
| Generates signed pass JWTs for the authenticated attendee.
| The QR scanner expects this signed token, not the raw qrToken field.
|
*/

export function getSecureTicketPasses(purchaseId: string) {
  return apiFetch<SecureTicketPassResponse>(
    `/pass/${encodeURIComponent(purchaseId)}/secure-pass`,
    {
      method: "POST",
      body: JSON.stringify({}),
    },
  );
}
