
import { apiFetch } from "@/lib/api";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type SettlementStatus =
  | "PENDING"
  | "PROCESSING"
  | "TRANSFERRED"
  | "PAID"
  | "FAILED"
  | "BLOCKED";

export interface FinanceSettlement {
  id: string;
  eventId: string;
  event: {
    title: string;
  } | null;
  purchaseId: string;
  currency: string;
  ticketSubtotal: number | string;
  transactionFee: number | string;
  stripeProcessingFee: number | string | null;
  stripeProcessingFeeCurrency: string | null;
  platformFeeShortfall: number | string | null;
  platformFeeSurplus: number | string | null;
  organizerAmount: number | string;
  refundAmount: number | string;
  releaseAt: string;
  status: SettlementStatus;
  stripeTransferId: string | null;
  transferredAt: string | null;
  failureReason: string | null;
  createdAt: string;
}

export interface FinanceSummary {
  organization: {
    id: string;
    name: string;
    stripeAccountId: string | null;
    stripeAccountStatus: string | null;
    stripePayoutsEnabled: boolean;
    stripeDetailsSubmitted: boolean;
    stripeOnboardingComplete: boolean;
  };
  counts: {
    pending: number;
    processing: number;
    blocked: number;
    failed: number;
    transferred: number;
  };
  settlements: FinanceSettlement[];
}

export interface FinanceSummaryResponse {
  success: boolean;
  data: FinanceSummary;
  message?: string;
}

/* -------------------------------------------------------------------------- */
/* API                                                                         */
/* -------------------------------------------------------------------------- */

export function getFinanceSummary(organizationId: string) {
  return apiFetch<FinanceSummaryResponse>(
    `/finance/${encodeURIComponent(organizationId)}`,
  );
}
