import { apiFetch } from "@/lib/api";

export interface Activity {
  id: string;

  type: string;

  title: string;

  description: string;

  actorId?: string;

  actorName?: string;

  actorRole?: string;

  attendeeId?: string;

  attendeeName?: string;

  purchaseId?: string;

  ticketTypeId?: string;

  ticketTypeName?: string;

  station?: string | null;

  createdAt: string;
}

export interface GetActivityResponse {
  success: boolean;

  activity: Activity[];
}

export function getActivity(
  limit = 50
) {
  return apiFetch<GetActivityResponse>(
    `/operations/activity?limit=${limit}`
  );
}