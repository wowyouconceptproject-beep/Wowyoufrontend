import { apiFetch } from "@/lib/api";

export interface EventCapacity {
  id: string;
  title: string;
  capacity: number;
  currentOccupancy: number;
  totalCheckIns: number;
  totalCheckOuts: number;
  occupancyPercentage: number;
}

export interface CapacityResponse {
  success: boolean;
  capacity: EventCapacity;
  message?: string;
}

export function getEventCapacity(
  eventId: string,
) {
  return apiFetch<CapacityResponse>(
    `/operations/capacity/${eventId}`,
    {
      method: "GET",
      withAuth: true,
    },
  );
}