import { apiFetch } from "@/lib/api";

export interface RevenueBreakdown {
  name: string;
  sold: number;
  revenue: number;
}

export interface RevenueSummary {
  totalRevenue: number;
  todayRevenue?: number;
  ticketsSold: number;
  averageOrderValue?: number;
  breakdown: RevenueBreakdown[];
}

interface RevenueResponse {
  success: boolean;
  revenue: RevenueSummary;
}

export function getRevenue(
  eventId: string
) {
  return apiFetch<RevenueResponse>(
    `/revenue/event/${eventId}`
  );
}