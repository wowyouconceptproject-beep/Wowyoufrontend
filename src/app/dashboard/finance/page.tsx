"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  AlertCircle,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

import {
  getFinanceSummary,
  type FinanceSettlement,
  type FinanceSummary,
  type SettlementStatus,
} from "@/services/finance.service";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

type CurrencyTotals = {
  currency: string;
  ticketSales: number;
  transactionFees: number;
  organizerEarnings: number;
  transferred: number;
  awaitingSettlement: number;
  refunds: number;
  count: number;
};

type SettlementFilter =
  | "ALL"
  | "PENDING"
  | "PROCESSING"
  | "TRANSFERRED"
  | "FAILED"
  | "BLOCKED";

function amount(value: number | string | null | undefined): number {
  if (value === null || value === undefined) {
    return 0;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function formatMoney(
  value: number,
  currency: string,
): string {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency.toUpperCase()} ${value.toFixed(2)}`;
  }
}

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(
  value: string | null | undefined,
): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function statusLabel(status: SettlementStatus): string {
  const labels: Record<SettlementStatus, string> = {
    PENDING: "Pending",
    PROCESSING: "Processing",
    TRANSFERRED: "Transferred to Stripe",
    PAID: "Paid",
    FAILED: "Failed",
    BLOCKED: "Blocked",
  };

  return labels[status];
}

function statusClass(status: SettlementStatus): string {
  switch (status) {
    case "TRANSFERRED":
    case "PAID":
      return "border-green-500/20 bg-green-500/10 text-green-600";

    case "PROCESSING":
      return "border-blue-500/20 bg-blue-500/10 text-blue-600";

    case "FAILED":
    case "BLOCKED":
      return "border-red-500/20 bg-red-500/10 text-red-600";

    default:
      return "border-amber-500/20 bg-amber-500/10 text-amber-600";
  }
}

function getStatusIcon(status: SettlementStatus) {
  switch (status) {
    case "TRANSFERRED":
    case "PAID":
      return CheckCircle2;

    case "PROCESSING":
      return RefreshCw;

    case "FAILED":
    case "BLOCKED":
      return AlertCircle;

    default:
      return Clock3;
  }
}

function getCurrencyTotals(
  settlements: FinanceSettlement[],
): CurrencyTotals[] {
  const totals = new Map<string, CurrencyTotals>();

  for (const settlement of settlements) {
    const currency = settlement.currency.toUpperCase();

    const current = totals.get(currency) ?? {
      currency,
      ticketSales: 0,
      transactionFees: 0,
      organizerEarnings: 0,
      transferred: 0,
      awaitingSettlement: 0,
      refunds: 0,
      count: 0,
    };

    const subtotal = amount(settlement.ticketSubtotal);
    const fees = amount(settlement.transactionFee);
    const refunds = amount(settlement.refundAmount);

    current.ticketSales += subtotal;
    current.transactionFees += fees;
    current.organizerEarnings += Math.max(
      amount(settlement.organizerAmount) - refunds,
      0,
    );
    current.refunds += refunds;
    current.count += 1;

    if (settlement.status === "TRANSFERRED" ||
        settlement.status === "PAID") {
      current.transferred += Math.max(
        amount(settlement.organizerAmount) - refunds,
        0,
      );
    } else {
      current.awaitingSettlement += Math.max(
        amount(settlement.organizerAmount) - refunds,
        0,
      );
    }

    totals.set(currency, current);
  }

  return Array.from(totals.values()).sort((a, b) =>
    a.currency.localeCompare(b.currency),
  );
}

/* -------------------------------------------------------------------------- */
/* Reusable Components                                                        */
/* -------------------------------------------------------------------------- */

function MetricCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-divider bg-surface p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{title}</p>
          <div className="mt-4 space-y-2">{children}</div>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-[primary]">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-muted">
        {description}
      </p>
    </section>
  );
}

function CurrencyAmounts({
  totals,
  field,
}: {
  totals: CurrencyTotals[];
  field: "ticketSales" | "transactionFees" | "transferred" | "awaitingSettlement";
}) {
  if (totals.length === 0) {
    return (
      <p className="text-2xl font-bold tracking-tight">
        —
      </p>
    );
  }

  return (
    <>
      {totals.map((item) => (
        <p
          key={item.currency}
          className="text-xl font-bold tracking-tight text-foreground"
        >
          {formatMoney(item[field], item.currency)}
        </p>
      ))}
    </>
  );
}

function SettlementStatusBadge({
  status,
}: {
  status: SettlementStatus;
}) {
  const Icon = getStatusIcon(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-xs font-medium ${statusClass(status)}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {statusLabel(status)}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Finance Page                                                               */
/* -------------------------------------------------------------------------- */

export default function FinancePage() {
  const {
    organization,
    loading: authLoading,
  } = useAuth();

  const [finance, setFinance] = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<SettlementFilter>("ALL");
  const [search, setSearch] = useState("");

  const loadFinance = useCallback(async () => {
    if (!organization?.id) {
      setFinance(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getFinanceSummary(organization.id);

      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Unable to load financial records.",
        );
      }

      setFinance(response.data);
    } catch (err) {
      console.error("Finance dashboard error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load financial records.",
      );
    } finally {
      setLoading(false);
    }
  }, [organization?.id]);

  useEffect(() => {
    if (!authLoading) {
      void loadFinance();
    }
  }, [authLoading, loadFinance]);

  const settlements = finance?.settlements ?? [];

  const currencyTotals = useMemo(
    () => getCurrencyTotals(settlements),
    [settlements],
  );

  const filteredSettlements = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return settlements.filter((settlement) => {
      const matchesStatus =
        filter === "ALL" || settlement.status === filter;

      const matchesSearch =
        !normalizedSearch ||
        settlement.eventId.toLowerCase().includes(normalizedSearch) ||
        settlement.purchaseId.toLowerCase().includes(normalizedSearch) ||
        settlement.id.toLowerCase().includes(normalizedSearch) ||
        (settlement.stripeTransferId ?? "")
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [settlements, filter, search]);

  const counts = finance?.counts;

  /* ------------------------------------------------------------------------ */
  /* Loading                                                                  */
  /* ------------------------------------------------------------------------ */

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-background px-6 py-10 lg:px-10">
        <div className="mx-auto flex min-h-[45vh] max-w-7xl items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-muted">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading financial records...
          </div>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* No Organization                                                          */
  /* ------------------------------------------------------------------------ */

  if (!organization) {
    return (
      <main className="min-h-screen bg-background px-6 py-10 lg:px-10">
        <div className="mx-auto max-w-5xl rounded-[28px] border border-divider bg-surface p-8">
          <Wallet className="h-8 w-8 text-[primary]" />

          <h1 className="mt-5 text-2xl font-bold">
            Finance
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted">
            Create your organization before accessing its financial records.
          </p>

          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[primary]"
          >
            Go to dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Dashboard                                                                */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="min-h-screen bg-background px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}

        <section className="flex flex-col gap-5 border-b border-divider pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[primary]">
              Payments & settlements
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight">
              Finance
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              Track ticket revenue, transaction fees and transfers for{" "}
              <span className="font-semibold text-foreground">
                {organization.name}
              </span>
              .
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void loadFinance()}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-divider bg-surface px-5 py-3 text-sm font-semibold transition hover:border-primary/40 disabled:opacity-60"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>

            <Link
              href="/dashboard/stripe"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Wallet className="h-4 w-4" />
              Stripe account
            </Link>
          </div>
        </section>

        {/* Error */}

        {error && (
          <section className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

              <div className="min-w-0 flex-1">
                <h2 className="font-semibold">
                  Unable to load finance data
                </h2>

                <p className="mt-1 break-words text-sm leading-6 text-muted">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => void loadFinance()}
                  className="mt-3 text-sm font-semibold text-[primary] hover:underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Stripe readiness */}

        <section className="mt-8 rounded-[24px] border border-divider bg-surface p-5 md:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-[primary]">
                {finance?.organization.stripeOnboardingComplete &&
                finance.organization.stripePayoutsEnabled ? (
                  <ShieldCheck className="h-6 w-6" />
                ) : (
                  <AlertCircle className="h-6 w-6" />
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  Stripe Connect
                </p>

                <h2 className="mt-1 text-lg font-bold">
                  {finance?.organization.stripeOnboardingComplete &&
                  finance.organization.stripePayoutsEnabled
                    ? "Connected and ready"
                    : "Setup requires attention"}
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-6 text-muted">
                  {finance?.organization.stripeAccountId
                    ? finance.organization.stripePayoutsEnabled
                      ? "Your connected Stripe account is enabled to receive transfers."
                      : "Complete the required Stripe setup before eligible settlements can be transferred."
                    : "Connect a Stripe account to receive eligible event settlements."}
                </p>

                {finance?.organization.stripeAccountId && (
                  <p className="mt-2 text-xs text-muted">
                    Account ending in{" "}
                    <span className="font-semibold text-foreground">
                      {finance.organization.stripeAccountId.slice(-8)}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <Link
              href="/dashboard/stripe"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[primary] hover:underline"
            >
              Manage Stripe
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Financial metrics */}

        <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Ticket sales"
            description="Ticket subtotals recorded in the settlement ledger, grouped by currency."
            icon={Wallet}
          >
            <CurrencyAmounts
              totals={currencyTotals}
              field="ticketSales"
            />
          </MetricCard>

          <MetricCard
            title="Transaction fees"
            description="Fees charged to attendees. These are separate from organizer ticket proceeds."
            icon={ArrowUpRight}
          >
            <CurrencyAmounts
              totals={currencyTotals}
              field="transactionFees"
            />
          </MetricCard>

          <MetricCard
            title="Awaiting settlement"
            description="Organizer proceeds on records not yet marked transferred or paid."
            icon={Clock3}
          >
            <CurrencyAmounts
              totals={currencyTotals}
              field="awaitingSettlement"
            />

            <p className="text-xs text-muted">
              {(counts?.pending ?? 0) +
                (counts?.processing ?? 0) +
                (counts?.blocked ?? 0) +
                (counts?.failed ?? 0)}{" "}
              records awaiting resolution
            </p>
          </MetricCard>

          <MetricCard
            title="Transferred"
            description="Organizer proceeds marked transferred to the connected Stripe account."
            icon={ArrowDownToLine}
          >
            <CurrencyAmounts
              totals={currencyTotals}
              field="transferred"
            />

            <p className="text-xs text-muted">
              {counts?.transferred ?? 0} transferred records
            </p>
          </MetricCard>
        </section>

        {/* Status overview */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            {
              label: "Pending",
              value: counts?.pending ?? 0,
              color: "text-amber-600",
            },
            {
              label: "Processing",
              value: counts?.processing ?? 0,
              color: "text-blue-600",
            },
            {
              label: "Blocked",
              value: counts?.blocked ?? 0,
              color: "text-red-600",
            },
            {
              label: "Failed",
              value: counts?.failed ?? 0,
              color: "text-red-600",
            },
            {
              label: "Transferred",
              value: counts?.transferred ?? 0,
              color: "text-green-600",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-divider bg-surface p-5"
            >
              <p className="text-sm text-muted">{item.label}</p>
              <p className={`mt-3 text-3xl font-black ${item.color}`}>
                {item.value}
              </p>
            </div>
          ))}
        </section>

        {/* Settlement history */}

        <section className="mt-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[primary]">
                Financial ledger
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Settlement history
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted">
                Review the release date, recorded fees and transfer status of each purchase.
              </p>
            </div>

            <p className="text-sm text-muted">
              {filteredSettlements.length} of {settlements.length} records
            </p>
          </div>

          {/* Filters */}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search event, purchase or transfer ID"
              className="min-w-0 flex-1 rounded-xl border border-divider bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary"
            />

            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value as SettlementFilter)
              }
              className="rounded-xl border border-divider bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
            >
              <option value="ALL">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="TRANSFERRED">Transferred</option>
              <option value="BLOCKED">Blocked</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          {/* Table */}

          <div className="mt-5 overflow-hidden rounded-[24px] border border-divider bg-surface">
            {filteredSettlements.length === 0 ? (
              <div className="flex min-h-[240px] flex-col items-center justify-center px-6 py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-divider bg-background">
                  <Wallet className="h-6 w-6 text-muted" />
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  {settlements.length === 0
                    ? "No settlement records yet"
                    : "No matching records"}
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-muted">
                  {settlements.length === 0
                    ? "Eligible paid Stripe purchases will appear here after their settlement records are created."
                    : "Try changing your search or selecting another settlement status."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-divider bg-background/60">
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
                        Purchase
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
                        Ticket subtotal
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
                        Transaction fee
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
                        Stripe processing fee
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
                        Release date
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
                        Status
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
                        Transfer
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredSettlements.map((settlement: FinanceSettlement) => (
                      <tr
                        key={settlement.id}
                        className="border-b border-divider last:border-b-0 hover:bg-background/40"
                      >
                        <td className="px-5 py-5">
                          <p className="font-semibold">
                            {settlement.eventId.slice(0, 12)}
                          </p>

                          <p className="mt-1 text-xs text-muted">
                            Purchase {settlement.purchaseId.slice(0, 12)}
                          </p>

                          <p className="mt-1 text-xs text-muted">
                            Created {formatDate(settlement.createdAt)}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="whitespace-nowrap text-sm font-semibold">
                            {formatMoney(
                              amount(settlement.ticketSubtotal),
                              settlement.currency,
                            )}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="whitespace-nowrap text-sm">
                            {formatMoney(
                              amount(settlement.transactionFee),
                              settlement.currency,
                            )}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          {settlement.stripeProcessingFee === null ? (
                            <span className="text-sm text-muted">
                              Not reconciled
                            </span>
                          ) : (
                            <>
                              <p className="whitespace-nowrap text-sm">
                                {formatMoney(
                                  amount(settlement.stripeProcessingFee),
                                  settlement.stripeProcessingFeeCurrency ??
                                    settlement.currency,
                                )}
                              </p>

                              {settlement.platformFeeShortfall !== null &&
                                amount(settlement.platformFeeShortfall) > 0 && (
                                  <p className="mt-1 text-xs text-amber-600">
                                    Platform shortfall:{" "}
                                    {formatMoney(
                                      amount(settlement.platformFeeShortfall),
                                      settlement.currency,
                                    )}
                                  </p>
                                )}
                            </>
                          )}
                        </td>

                        <td className="px-5 py-5">
                          <p className="whitespace-nowrap text-sm">
                            {formatDate(settlement.releaseAt)}
                          </p>

                          {settlement.transferredAt && (
                            <p className="mt-1 text-xs text-muted">
                              Transferred {formatDateTime(settlement.transferredAt)}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-5">
                          <SettlementStatusBadge status={settlement.status} />

                          {(settlement.status === "FAILED" ||
                            settlement.status === "BLOCKED") &&
                            settlement.failureReason && (
                              <p
                                title={settlement.failureReason}
                                className="mt-2 max-w-[200px] truncate text-xs text-red-600"
                              >
                                {settlement.failureReason}
                              </p>
                            )}
                        </td>

                        <td className="px-5 py-5">
                          {settlement.stripeTransferId ? (
                            <div>
                              <p className="text-xs font-medium text-green-600">
                                Transfer created
                              </p>

                              <p
                                title={settlement.stripeTransferId}
                                className="mt-1 max-w-[150px] truncate text-xs text-muted"
                              >
                                {settlement.stripeTransferId}
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm text-muted">
                              Not transferred
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Financial notes */}

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-[24px] border border-divider bg-surface p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[primary]" />

              <h3 className="font-bold">
                How organizer earnings work
              </h3>
            </div>

            <p className="mt-3 text-sm leading-6 text-muted">
              The ticket subtotal is the organizer’s starting entitlement.
              The attendee transaction fee is recorded separately and is not
              deducted from the organizer’s ticket subtotal. Recorded refunds
              reduce the amount eligible for transfer.
            </p>
          </div>

          <div className="rounded-[24px] border border-divider bg-surface p-6">
            <div className="flex items-center gap-3">
              <ArrowDownToLine className="h-5 w-5 text-[primary]" />

              <h3 className="font-bold">
                Transfer versus bank payout
              </h3>
            </div>

            <p className="mt-3 text-sm leading-6 text-muted">
              A transfer confirms movement from WowYou’s Stripe platform
              balance to the organizer’s connected Stripe account. The
              organizer’s subsequent bank payout is a separate Stripe process.
              Use the Stripe dashboard to check bank payout timing and status.
            </p>

            <Link
              href="/dashboard/stripe"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[primary] hover:underline"
            >
              Open Stripe Connect
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}