import { apiFetch } from "@/lib/api";

export interface DiscoveryResponse {
  success: boolean;

  hero: any[];

  featured: any;

  categories: any[];

  trending: any[];

  upcoming: any[];

  live: any[];

  popularorganizers: any[];

  topVendors: any[];

  vendorReviews: any[];
}

export function getDiscovery() {
  return apiFetch<DiscoveryResponse>(
    "/discovery",
  );
}