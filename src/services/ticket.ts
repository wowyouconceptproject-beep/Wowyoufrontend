import { apiFetch } from "@/lib/api";

export interface Ticket {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  sold: number;
  remaining: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateTicketPayload {
  name: string;
  description?: string;
  price: number;
  quantity: number;
}

export interface TicketResponse {
  success: boolean;
  ticket: Ticket;
  message?: string;
}

export interface TicketsResponse {
  success: boolean;
  tickets: Ticket[];
  currency: string;
  message?: string;
}

export interface DeleteTicketResponse {
  success: boolean;
  message?: string;
}

export function createTicket(
  eventId: string,
  data: CreateTicketPayload
) {
  return apiFetch<TicketResponse>(
    `/tickets/${eventId}`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export function getTickets(
  eventId: string
) {
  return apiFetch<TicketsResponse>(
    `/tickets/${eventId}`
  );
}

export function updateTicket(
  ticketId: string,
  data: Partial<CreateTicketPayload>
) {
  return apiFetch<TicketResponse>(
    `/tickets/${ticketId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

export function deleteTicket(
  ticketId: string
) {
  return apiFetch<DeleteTicketResponse>(
    `/tickets/${ticketId}`,
    {
      method: "DELETE",
    }
  );
}

export function toggleTicket(
  ticketId: string
) {
  return apiFetch<TicketResponse>(
    `/tickets/${ticketId}/toggle`,
    {
      method: "PATCH",
    }
  );
}