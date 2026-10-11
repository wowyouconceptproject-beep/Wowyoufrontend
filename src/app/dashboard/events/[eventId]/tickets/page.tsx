
"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import {
  createTicket,
  getTickets,
} from "@/services/ticket";

import {
  recordManualSale,
  type ManualSalePaymentMethod,
} from "@/services/purchase";

export default function TicketsPage() {
  const params = useParams<{
    eventId: string;
  }>();

  const eventId = params.eventId;

  const [tickets, setTickets] = useState<any[]>([]);
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(true);

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  // Manual sale state
  const [manualTicketTypeId, setManualTicketTypeId] = useState("");
  const [buyerFirstName, setBuyerFirstName] = useState("");
  const [buyerLastName, setBuyerLastName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [manualQuantity, setManualQuantity] = useState("1");

  const [manualPaymentMethod, setManualPaymentMethod] =
    useState<ManualSalePaymentMethod>("CASH");

  const [manualPaymentReference, setManualPaymentReference] =
    useState("");

  const [recordingSale, setRecordingSale] = useState(false);
  const [manualSaleError, setManualSaleError] = useState("");
  const [manualSaleSuccess, setManualSaleSuccess] = useState("");

  function currencySymbol(currency: string) {
    switch (currency) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "NGN":
        return "₦";
      case "KES":
        return "KSh ";
      case "ZAR":
        return "R ";
      default:
        return currency;
    }
  }

  async function loadTickets() {
    try {
      setLoading(true);
      setError("");

      const result = await getTickets(eventId);

      if (result.success) {
        setTickets(result.tickets ?? []);

        if (result.currency) {
          setCurrency(result.currency);
        }
      } else {
        setError(result.message ?? "Unable to load tickets.");
      }
    } catch (error) {
      console.error("Ticket load failed:", error);
      setError("Unable to load tickets.");
    } finally {
      setLoading(false);
    }
  }

  // Create a ticket type. Existing behavior is preserved.
  async function submit() {
    setError("");

    if (!name.trim()) {
      setError("Enter a ticket name.");
      return;
    }

    if (
      price === "" ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0
    ) {
      setError("Enter a valid ticket price.");
      return;
    }

    if (
      quantity === "" ||
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) < 1
    ) {
      setError("Ticket quantity must be at least 1.");
      return;
    }

    try {
      setCreating(true);

      const result = await createTicket(eventId, {
        name: name.trim(),
        price: Number(price),
        quantity: Number(quantity),
      });

      if (!result.success) {
        setError(result.message ?? "Unable to create ticket.");
        return;
      }

      setName("");
      setPrice("");
      setQuantity("");

      await loadTickets();
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create ticket."
      );
    } finally {
      setCreating(false);
    }
  }

  // Record a sale paid for outside the online checkout.
  async function submitManualSale() {
    setManualSaleError("");
    setManualSaleSuccess("");

    const selectedTicket = tickets.find(
      (ticket) => ticket.id === manualTicketTypeId
    );

    const requestedQuantity = Number(manualQuantity);

    if (!selectedTicket) {
      setManualSaleError("Select a ticket type.");
      return;
    }

    if (!buyerFirstName.trim() || !buyerLastName.trim()) {
      setManualSaleError("Enter the buyer's first and last name.");
      return;
    }

    const normalizedEmail = buyerEmail.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setManualSaleError("Enter a valid buyer email address.");
      return;
    }

    if (
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity < 1
    ) {
      setManualSaleError(
        "Quantity must be a whole number of at least 1."
      );
      return;
    }

    const remaining =
      Number(selectedTicket.quantity ?? 0) -
      Number(selectedTicket.sold ?? 0);

    if (requestedQuantity > remaining) {
      setManualSaleError(
        `Only ${Math.max(remaining, 0)} ticket(s) remain for this ticket type.`
      );
      return;
    }

    try {
      setRecordingSale(true);

      const result = await recordManualSale({
        eventId,
        ticketTypeId: manualTicketTypeId,
        quantity: requestedQuantity,
        firstName: buyerFirstName.trim(),
        lastName: buyerLastName.trim(),
        email: normalizedEmail,
        phone: buyerPhone.trim() || undefined,
        paymentMethod: manualPaymentMethod,
        paymentReference: manualPaymentReference.trim() || undefined,
      });

      if (!result.success) {
        setManualSaleError(
          result.message || "Unable to record the manual sale."
        );
        return;
      }

      const messages = [
        result.message || "Manual sale recorded successfully.",
      ];

      if (result.accountCreated) {
        messages.push(
          result.verificationEmailSent
            ? "A new attendee account was created and a verification email was sent."
            : "A new attendee account was created, but the verification email could not be confirmed as sent."
        );
      } else {
        messages.push(
          "The sale was linked to the buyer's existing account."
        );
      }

      if (result.passesIssued === false) {
        messages.push(
          "Warning: the sale was recorded, but pass issuance needs attention."
        );
      } else if (typeof result.passCount === "number") {
        messages.push(`${result.passCount} pass(es) issued.`);
      }

      setManualSaleSuccess(messages.join(" "));

      setBuyerFirstName("");
      setBuyerLastName("");
      setBuyerEmail("");
      setBuyerPhone("");
      setManualQuantity("1");
      setManualPaymentReference("");

      await loadTickets();
    } catch (error: unknown) {
      setManualSaleError(
        error instanceof Error
          ? error.message
          : "Failed to record the manual sale."
      );
    } finally {
      setRecordingSale(false);
    }
  }

  useEffect(() => {
    if (!eventId) {
      return;
    }

    loadTickets();
  }, [eventId]);

  /*
  |--------------------------------------------------------------------------
  | Ticket Metrics
  |--------------------------------------------------------------------------
  */

  const totalInventory = tickets.reduce(
    (total, ticket) =>
      total + Number(ticket.quantity ?? 0),
    0
  );

  const totalSold = tickets.reduce(
    (total, ticket) =>
      total + Number(ticket.sold ?? 0),
    0
  );

  const totalRemaining = Math.max(
    totalInventory - totalSold,
    0
  );

  const salesPercentage =
    totalInventory > 0
      ? Math.min(
          Math.round((totalSold / totalInventory) * 100),
          100
        )
      : 0;

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-6 py-10 text-white md:px-10">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-4 w-36 rounded bg-white/10" />
          <div className="mt-5 h-12 w-72 rounded bg-white/10" />
          <div className="mt-4 h-5 w-96 max-w-full rounded bg-white/[0.06]" />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-36 rounded-[24px] border border-white/10 bg-white/[0.03]"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-14">
        {/* Header */}
        <header className="mb-12">
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px w-10 bg-primary" />
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[primary]">
              Ticketing
            </p>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Ticket Management
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/45">
                Create ticket types, control inventory and track ticket
                allocation for this event.
              </p>
            </div>

            <div className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5">
              <p className="text-xs font-medium text-white/45">
                Event Currency
                <span className="ml-2 font-bold text-[primary]">
                  {currency}
                </span>
              </p>
            </div>
          </div>
        </header>

        {/* Metrics */}
        <section className="grid gap-5 md:grid-cols-3">
          <MetricCard
            label="Total Inventory"
            value={totalInventory}
            description="Tickets available across all ticket types"
          />

          <MetricCard
            label="Tickets Sold"
            value={totalSold}
            description={`${salesPercentage}% of total inventory sold`}
            accent
          />

          <MetricCard
            label="Remaining"
            value={totalRemaining}
            description="Tickets currently available for purchase"
          />
        </section>

        {/* Sales progress */}
        {totalInventory > 0 && (
          <section className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-sm font-semibold">
                  Inventory Progress
                </p>

                <p className="mt-1 text-xs text-white/35">
                  {totalSold.toLocaleString("en-US")} of{" "}
                  {totalInventory.toLocaleString("en-US")} tickets sold
                </p>
              </div>

              <p className="text-2xl font-bold text-[primary]">
                {salesPercentage}%
              </p>
            </div>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${salesPercentage}%` }}
              />
            </div>
          </section>
        )}

        {/* Main workspace */}
        <div className="mt-12 grid gap-10 xl:grid-cols-[380px_1fr]">
          {/* Create Ticket */}
          <aside>
            <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 xl:sticky xl:top-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[primary]">
                New Ticket Type
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                Create Ticket
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Define the name, price and inventory available for this
                ticket type.
              </p>

              <div className="mt-8 space-y-6">
                <Field
                  label="Ticket Name"
                  hint="e.g. General Admission"
                >
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="General Admission"
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="Ticket Price"
                  hint={`Price in ${currency}`}
                >
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-semibold text-[primary]">
                      {currencySymbol(currency)}
                    </div>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0"
                      className={`${inputClass} pl-12`}
                    />
                  </div>
                </Field>

                <Field
                  label="Quantity"
                  hint="Maximum number available"
                >
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="100"
                    className={inputClass}
                  />
                </Field>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3 text-sm leading-6 text-red-300"
                >
                  {error}
                </div>
              )}

              <button
                type="button"
                disabled={creating}
                onClick={submit}
                className="mt-7 w-full rounded-2xl bg-primary px-6 py-4 text-sm font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating ? "Creating Ticket..." : "Create Ticket"}
              </button>

              <p className="mt-4 text-center text-[11px] leading-5 text-white/25">
                Tickets will become available through the event&apos;s
                purchase experience.
              </p>
            </div>
          </aside>

          {/* Existing Tickets */}
          <section>
            <div className="mb-6 flex items-end justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[primary]">
                  Inventory
                </p>

                <h2 className="mt-2 text-2xl font-semibold md:text-3xl">
                  Ticket Types
                </h2>

                <p className="mt-2 text-sm text-white/40">
                  Manage the ticket inventory configured for this event.
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/45">
                {tickets.length}{" "}
                {tickets.length === 1 ? "type" : "types"}
              </span>
            </div>

            {tickets.length === 0 ? (
              <EmptyTickets />
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    currency={currency}
                    currencySymbol={currencySymbol}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Manual / Offline Sale */}
        <section className="mt-12 rounded-[28px] border border-white/10 bg-white/[0.035] p-6 md:p-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[primary]">
              Organizer Sales
            </p>

            <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
              Record a Manual Sale
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Record tickets paid for outside WowYou, such as cash, bank
              transfer or POS. The buyer will be linked to an existing account
              or a new attendee account will be created using their email
              address.
            </p>
          </div>

          {tickets.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-sm text-white/50">
              Create a ticket type before recording a manual sale.
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <Field label="Ticket Type">
                <select
                  value={manualTicketTypeId}
                  onChange={(e) => setManualTicketTypeId(e.target.value)}
                  className={inputClass}
                  disabled={recordingSale}
                >
                  <option value="" className="bg-surface">
                    Select a ticket type
                  </option>

                  {tickets.map((ticket) => {
                    const remaining =
                      Number(ticket.quantity ?? 0) -
                      Number(ticket.sold ?? 0);

                    return (
                      <option
                        key={ticket.id}
                        value={ticket.id}
                        disabled={remaining <= 0}
                        className="bg-surface"
                      >
                        {ticket.name} — {currencySymbol(currency)}
                        {Number(ticket.price ?? 0).toLocaleString("en-US")} (
                        {Math.max(remaining, 0)} remaining)
                      </option>
                    );
                  })}
                </select>
              </Field>

              <Field label="Buyer First Name">
                <input
                  value={buyerFirstName}
                  onChange={(e) => setBuyerFirstName(e.target.value)}
                  placeholder="First name"
                  autoComplete="given-name"
                  className={inputClass}
                  disabled={recordingSale}
                />
              </Field>

              <Field label="Buyer Last Name">
                <input
                  value={buyerLastName}
                  onChange={(e) => setBuyerLastName(e.target.value)}
                  placeholder="Last name"
                  autoComplete="family-name"
                  className={inputClass}
                  disabled={recordingSale}
                />
              </Field>

              <Field
                label="Buyer Email"
                hint="Used to link or create account"
              >
                <input
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="buyer@example.com"
                  autoComplete="email"
                  className={inputClass}
                  disabled={recordingSale}
                />
              </Field>

              <Field label="Buyer Phone" hint="Optional">
                <input
                  type="tel"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="Phone number"
                  autoComplete="tel"
                  className={inputClass}
                  disabled={recordingSale}
                />
              </Field>

              <Field label="Quantity">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={manualQuantity}
                  onChange={(e) => setManualQuantity(e.target.value)}
                  className={inputClass}
                  disabled={recordingSale}
                />
              </Field>

              <Field label="Payment Method">
                <select
                  value={manualPaymentMethod}
                  onChange={(e) =>
                    setManualPaymentMethod(
                      e.target.value as ManualSalePaymentMethod
                    )
                  }
                  className={inputClass}
                  disabled={recordingSale}
                >
                  <option value="CASH" className="bg-surface">
                    Cash
                  </option>
                  <option value="BANK_TRANSFER" className="bg-surface">
                    Bank transfer
                  </option>
                  <option value="POS" className="bg-surface">
                    POS
                  </option>
                  <option value="OTHER" className="bg-surface">
                    Other
                  </option>
                </select>
              </Field>

              <Field label="Payment Reference" hint="Optional">
                <input
                  value={manualPaymentReference}
                  onChange={(e) =>
                    setManualPaymentReference(e.target.value)
                  }
                  placeholder="Transfer or receipt reference"
                  className={inputClass}
                  maxLength={150}
                  disabled={recordingSale}
                />
              </Field>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={submitManualSale}
                  disabled={recordingSale || tickets.length === 0}
                  className="w-full rounded-2xl bg-primary px-6 py-4 text-sm font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {recordingSale
                    ? "Recording Sale..."
                    : "Record Sale & Issue Tickets"}
                </button>
              </div>
            </div>
          )}

          {manualSaleError && (
            <div
              role="alert"
              className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3 text-sm leading-6 text-red-300"
            >
              {manualSaleError}
            </div>
          )}

          {manualSaleSuccess && (
            <div
              role="status"
              className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-3 text-sm leading-6 text-emerald-200"
            >
              {manualSaleSuccess}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Ticket Card
|--------------------------------------------------------------------------
*/

function TicketCard({
  ticket,
  currency,
  currencySymbol,
}: {
  ticket: any;
  currency: string;
  currencySymbol: (currency: string) => string;
}) {
  const quantity = Number(ticket.quantity ?? 0);
  const sold = Number(ticket.sold ?? 0);
  const remaining = Math.max(quantity - sold, 0);

  const percentage =
    quantity > 0
      ? Math.min(Math.round((sold / quantity) * 100), 100)
      : 0;

  const soldOut = quantity > 0 && remaining === 0;

  return (
    <article className="group overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035] transition hover:border-white/20">
      <div className="p-6 md:p-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-semibold">{ticket.name}</h3>

              {soldOut && (
                <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-red-300">
                  Sold Out
                </span>
              )}
            </div>

            <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-white/25">
              Ticket Type
            </p>
          </div>

          <div className="sm:text-right">
            <p className="text-2xl font-bold tracking-tight">
              {currencySymbol(currency)}
              {Number(ticket.price).toLocaleString("en-US", {
                minimumFractionDigits:
                  Number(ticket.price) % 1 === 0 ? 0 : 2,
                maximumFractionDigits: 2,
              })}
            </p>

            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
              {currency}
            </p>
          </div>
        </div>

        {/* Inventory */}
        <div className="mt-8 grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/[0.07] bg-background/20">
          <InventoryMetric label="Inventory" value={quantity} />
          <InventoryMetric label="Sold" value={sold} />
          <InventoryMetric label="Remaining" value={remaining} />
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs text-white/30">Sales progress</p>

            <p className="text-xs font-semibold text-white/55">
              {percentage}%
            </p>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

/*
|--------------------------------------------------------------------------
| Metric Card
|--------------------------------------------------------------------------
*/

function MetricCard({
  label,
  value,
  description,
  accent = false,
}: {
  label: string;
  value: number;
  description: string;
  accent?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035] p-6">
      <div
        className={`absolute left-0 top-0 h-full w-[3px] ${
          accent ? "bg-primary" : "bg-white/20"
        }`}
      />

      <p className="text-sm font-medium text-white/40">{label}</p>

      <p className="mt-5 text-4xl font-bold tracking-tight">
        {value.toLocaleString("en-US")}
      </p>

      <p className="mt-3 text-xs leading-5 text-white/30">
        {description}
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Inventory Metric
|--------------------------------------------------------------------------
*/

function InventoryMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="px-3 py-4 text-center md:px-5">
      <p className="text-lg font-bold">
        {value.toLocaleString("en-US")}
      </p>

      <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/25 md:text-[10px]">
        {label}
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Empty State
|--------------------------------------------------------------------------
*/

function EmptyTickets() {
  return (
    <div className="rounded-[26px] border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/[0.07] text-2xl font-light text-[primary]">
        +
      </div>

      <h3 className="mt-6 text-lg font-semibold">
        No ticket types yet
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/35">
        Create your first ticket type to begin building the inventory for this
        event.
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Form
|--------------------------------------------------------------------------
*/

const inputClass =
  "w-full rounded-xl border border-white/10 bg-surface/30 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-primary/60 focus:ring-1 focus:ring-primary/20";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <label className="text-sm font-medium text-white/70">
          {label}
        </label>

        {hint && (
          <span className="text-[10px] text-white/25">
            {hint}
          </span>
        )}
      </div>

      {children}
    </div>
  );
}
