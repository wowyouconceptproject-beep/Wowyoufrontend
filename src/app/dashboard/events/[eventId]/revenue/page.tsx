"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import {
  Banknote,
  BarChart3,
  CircleDollarSign,
  ReceiptText,
  Ticket,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import {
  getRevenue,
} from "@/services/revenue";

function currencySymbol(
  currency?: string
) {
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
      return currency ?? "";
  }
}

function formatAmount(
  amount: number
) {
  return Number(
    amount ?? 0
  ).toLocaleString(
    "en-US"
  );
}

export default function RevenuePage() {
  const params =
    useParams<{
      eventId: string;
    }>();

  const eventId =
    params.eventId;

  const [
    data,
    setData,
  ] = useState<any>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(
    true
  );

  async function loadRevenue() {
    try {
      setLoading(
        true
      );

      const result =
        await getRevenue(
          eventId
        );

      if (
        result.success
      ) {
        setData(
          result.revenue
        );
      }
    } catch (
      error
    ) {
      console.error(
        "Revenue Error:",
        error
      );

      alert(
        "Unable to load revenue."
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  useEffect(() => {
    if (!eventId) {
      return;
    }

    loadRevenue();
  }, [eventId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] p-8">

        <div className="mx-auto max-w-7xl">

          <div className="animate-pulse space-y-8">

            <div className="space-y-3">

              <div className="h-4 w-32 rounded bg-white/[0.06]" />

              <div className="h-10 w-72 rounded bg-white/[0.06]" />

              <div className="h-4 w-96 max-w-full rounded bg-white/[0.04]" />

            </div>

            <div className="grid gap-5 lg:grid-cols-3">

              <div className="h-52 rounded-[28px] bg-white/[0.04] lg:col-span-2" />

              <div className="h-52 rounded-[28px] bg-white/[0.04]" />

            </div>

            <div className="h-80 rounded-[28px] bg-white/[0.04]" />

          </div>

        </div>

      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#050505] p-8">

        <div
          className="
            mx-auto
            flex
            min-h-[70vh]
            max-w-7xl
            items-center
            justify-center
          "
        >

          <div className="max-w-md text-center">

            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                border
                border-[#D4AF37]/20
                bg-[#D4AF37]/10
              "
            >
              <BarChart3 className="h-7 w-7 text-[#D4AF37]" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-white">
              Revenue Unavailable
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Revenue information for this event could not be
              loaded.
            </p>

          </div>

        </div>

      </main>
    );
  }

  const symbol =
    currencySymbol(
      data.currency
    );

  const totalRevenue =
    Number(
      data.totalRevenue ??
        0
    );

  const ticketsSold =
    Number(
      data.ticketsSold ??
        0
    );

  const breakdown =
    data.breakdown ??
    [];

  const averageTicketValue =
    ticketsSold > 0
      ? totalRevenue /
        ticketsSold
      : 0;

  const highestRevenueTicket =
    breakdown.length >
    0
      ? [...breakdown].sort(
          (
            a: any,
            b: any
          ) =>
            Number(
              b.revenue ??
                0
            ) -
            Number(
              a.revenue ??
                0
            )
        )[0]
      : null;

  return (
    <main className="min-h-screen bg-[#050505] p-6 text-white md:p-8">

      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}

        <header
          className="
            flex
            flex-col
            gap-6
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >

          <div>

            <div className="flex items-center gap-2">

              <span className="h-px w-8 bg-[#D4AF37]" />

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.24em]
                  text-[#D4AF37]
                "
              >
                Financial Performance
              </p>

            </div>

            <h1
              className="
                mt-4
                text-3xl
                font-black
                tracking-tight
                md:text-4xl
              "
            >
              Revenue Dashboard
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Track ticket sales, revenue performance and the
              ticket categories driving this event.
            </p>

          </div>

          <div
            className="
              inline-flex
              w-fit
              items-center
              gap-3
              rounded-xl
              border
              border-white/[0.07]
              bg-white/[0.025]
              px-4
              py-3
            "
          >

            <CircleDollarSign className="h-4 w-4 text-[#D4AF37]" />

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                Currency
              </p>

              <p className="mt-0.5 text-sm font-bold">
                {data.currency}
              </p>

            </div>

          </div>

        </header>

        {/* Main Financial Overview */}

        <section className="grid gap-5 lg:grid-cols-3">

          {/* Revenue Hero */}

          <div
            className="
              relative
              overflow-hidden
              rounded-[28px]
              border
              border-[#D4AF37]/20
              bg-[#0D0D0D]
              p-7
              lg:col-span-2
              md:p-8
            "
          >

            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-24
                h-72
                w-72
                rounded-full
                bg-[#D4AF37]/[0.08]
                blur-3xl
              "
            />

            <div
              className="
                absolute
                inset-x-0
                top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-[#D4AF37]/70
                to-transparent
              "
            />

            <div className="relative">

              <div className="flex items-center justify-between gap-5">

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#D4AF37]/20
                    bg-[#D4AF37]/10
                  "
                >
                  <Banknote className="h-5 w-5 text-[#D4AF37]" />
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-[#D4AF37]/15
                    bg-[#D4AF37]/[0.05]
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-[#D4AF37]
                  "
                >
                  <TrendingUp className="h-3.5 w-3.5" />

                  Event Revenue
                </div>

              </div>

              <div className="mt-10">

                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-white/35
                  "
                >
                  Total Revenue
                </p>

                <h2
                  className="
                    mt-3
                    break-words
                    text-4xl
                    font-black
                    tracking-tight
                    text-white
                    sm:text-5xl
                    lg:text-6xl
                  "
                >
                  <span className="text-[#D4AF37]">
                    {symbol}
                  </span>

                  {formatAmount(
                    totalRevenue
                  )}
                </h2>

                <p className="mt-4 text-sm text-white/35">
                  Gross revenue generated from ticket sales.
                </p>

              </div>

            </div>

          </div>

          {/* Tickets Sold */}

          <div
            className="
              flex
              flex-col
              justify-between
              rounded-[28px]
              border
              border-white/[0.08]
              bg-[#0D0D0D]
              p-7
            "
          >

            <div className="flex items-start justify-between">

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-white/[0.04]
                "
              >
                <Ticket className="h-5 w-5 text-[#D4AF37]" />
              </div>

              <span className="text-xs font-semibold text-white/25">
                SALES
              </span>

            </div>

            <div className="mt-10">

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-white/35
                "
              >
                Tickets Sold
              </p>

              <p className="mt-3 text-5xl font-black tracking-tight">
                {formatAmount(
                  ticketsSold
                )}
              </p>

              <p className="mt-3 text-sm text-white/35">
                Confirmed ticket sales for this event.
              </p>

            </div>

          </div>

        </section>

        {/* Secondary Metrics */}

        <section className="grid gap-4 md:grid-cols-2">

          <MetricCard
            icon={
              WalletCards
            }
            label="Average Ticket Value"
            value={`${symbol}${formatAmount(
              averageTicketValue
            )}`}
            description="Average revenue generated per ticket sold."
          />

          <MetricCard
            icon={
              ReceiptText
            }
            label="Top Revenue Ticket"
            value={
              highestRevenueTicket
                ? highestRevenueTicket.name
                : "No sales yet"
            }
            description={
              highestRevenueTicket
                ? `${symbol}${formatAmount(
                    Number(
                      highestRevenueTicket.revenue ??
                        0
                    )
                  )} generated`
                : "Ticket performance will appear after sales begin."
            }
          />

        </section>

        {/* Breakdown */}

        <section
          className="
            overflow-hidden
            rounded-[28px]
            border
            border-white/[0.08]
            bg-[#0D0D0D]
          "
        >

          <div
            className="
              flex
              flex-col
              gap-4
              border-b
              border-white/[0.07]
              px-6
              py-6
              sm:flex-row
              sm:items-center
              sm:justify-between
              md:px-7
            "
          >

            <div>

              <div className="flex items-center gap-2">

                <BarChart3 className="h-4 w-4 text-[#D4AF37]" />

                <h2 className="text-lg font-bold">
                  Ticket Performance
                </h2>

              </div>

              <p className="mt-2 text-sm text-white/35">
                Revenue contribution by ticket category.
              </p>

            </div>

            <div
              className="
                w-fit
                rounded-full
                border
                border-white/[0.07]
                bg-white/[0.03]
                px-3
                py-1.5
                text-xs
                font-semibold
                text-white/40
              "
            >
              {breakdown.length}{" "}
              {breakdown.length ===
              1
                ? "ticket type"
                : "ticket types"}
            </div>

          </div>

          {breakdown.length ===
          0 ? (

            <div className="px-6 py-16 text-center">

              <div
                className="
                  mx-auto
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-[#D4AF37]/15
                  bg-[#D4AF37]/[0.05]
                "
              >
                <Ticket className="h-6 w-6 text-[#D4AF37]" />
              </div>

              <h3 className="mt-5 font-bold">
                No Ticket Sales Yet
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/35">
                Revenue performance will appear here as attendees
                begin purchasing tickets.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-white/[0.06]">

              {breakdown.map(
                (
                  ticket: any,
                  index: number
                ) => {
                  const revenue =
                    Number(
                      ticket.revenue ??
                        0
                    );

                  const sold =
                    Number(
                      ticket.sold ??
                        0
                    );

                  const contribution =
                    totalRevenue >
                    0
                      ? (revenue /
                          totalRevenue) *
                        100
                      : 0;

                  return (
                    <div
                      key={`${ticket.name}-${index}`}
                      className="
                        group
                        px-6
                        py-6
                        transition
                        hover:bg-white/[0.02]
                        md:px-7
                      "
                    >

                      <div
                        className="
                          flex
                          flex-col
                          gap-5
                          sm:flex-row
                          sm:items-center
                          sm:justify-between
                        "
                      >

                        <div className="flex min-w-0 items-center gap-4">

                          <div
                            className="
                              flex
                              h-11
                              w-11
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              border
                              border-white/[0.07]
                              bg-white/[0.03]
                              text-sm
                              font-black
                              text-[#D4AF37]
                            "
                          >
                            {String(
                              index +
                                1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </div>

                          <div className="min-w-0">

                            <h3 className="truncate font-bold text-white">
                              {ticket.name}
                            </h3>

                            <div className="mt-1 flex items-center gap-2 text-xs text-white/35">

                              <Ticket className="h-3.5 w-3.5" />

                              {formatAmount(
                                sold
                              )}{" "}
                              sold

                            </div>

                          </div>

                        </div>

                        <div className="sm:text-right">

                          <p
                            className="
                              text-[10px]
                              font-bold
                              uppercase
                              tracking-[0.16em]
                              text-white/25
                            "
                          >
                            Revenue
                          </p>

                          <p className="mt-1 text-xl font-black text-white">
                            <span className="text-[#D4AF37]">
                              {symbol}
                            </span>

                            {formatAmount(
                              revenue
                            )}
                          </p>

                        </div>

                      </div>

                      {/* Contribution bar */}

                      <div className="mt-5">

                        <div className="mb-2 flex items-center justify-between">

                          <span className="text-[11px] text-white/25">
                            Revenue contribution
                          </span>

                          <span className="text-[11px] font-bold text-white/45">
                            {contribution.toFixed(
                              1
                            )}
                            %
                          </span>

                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

                          <div
                            className="
                              h-full
                              rounded-full
                              bg-[#D4AF37]
                              transition-all
                              duration-500
                            "
                            style={{
                              width: `${Math.min(
                                contribution,
                                100
                              )}%`,
                            }}
                          />

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div
      className="
        rounded-[22px]
        border
        border-white/[0.08]
        bg-[#0D0D0D]
        p-6
      "
    >

      <div className="flex items-start gap-4">

        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-[#D4AF37]/15
            bg-[#D4AF37]/[0.06]
          "
        >
          <Icon className="h-4 w-4 text-[#D4AF37]" />
        </div>

        <div className="min-w-0">

          <p
            className="
              text-[11px]
              font-bold
              uppercase
              tracking-[0.15em]
              text-white/30
            "
          >
            {label}
          </p>

          <p className="mt-2 truncate text-xl font-black text-white">
            {value}
          </p>

          <p className="mt-1 text-xs leading-5 text-white/30">
            {description}
          </p>

        </div>

      </div>

    </div>
  );
}