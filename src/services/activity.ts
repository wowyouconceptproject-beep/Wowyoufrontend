import { apiFetch } from "@/lib/api";

export interface Activity {
  id: string;

  type: string;

  title: string;

  description: string;

  timestamp: string;

  staffId?: string;

  attendeeId?: string;

  metadata?: Record<string, any>;
}

export interface GetActivityResponse {
  success: boolean;
  activities: Activity[];
}

export function getActivity(
  eventId: string
) {
  return apiFetch<GetActivityResponse>(
    `/events/${eventId}/activity`
  );
}