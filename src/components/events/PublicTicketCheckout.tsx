"use client";

import {
  useState,
} from "react";

import {
  createPurchase,
} from "@/services/purchase";

import {
  getCurrentUser,
  registerUser,
  loginUser,
  verifyLoginOtp,
  resendLoginOtp,
} from "@/services/auth";

interface PublicTicketCheckoutProps {
  event: any;
  onClose: () => void;
}

/*
|--------------------------------------------------------------------------
| Public Ticket Checkout
|--------------------------------------------------------------------------
*/

export default function PublicTicketCheckout({
  event,
  onClose,
}: PublicTicketCheckoutProps) {
  /*
  |--------------------------------------------------------------------------
  | Ticket State
  |--------------------------------------------------------------------------
  */

  const tickets =
    event?.tickets?.filter(
      (ticket: any) =>
        ticket.isActive,
    ) ?? [];

  const [
    selectedTicketId,
    setSelectedTicketId,
  ] = useState<string | null>(
    tickets.length > 0
      ? tickets[0].id
      : null,
  );

  const [
    quantity,
    setQuantity,
  ] = useState(1);

  /*
  |--------------------------------------------------------------------------
  | Authentication State
  |--------------------------------------------------------------------------
  */

  const [
    authMode,
    setAuthMode,
  ] = useState<
    "register" | "login"
  >("register");

  const [
    firstName,
    setFirstName,
  ] = useState("");

  const [
    lastName,
    setLastName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Login OTP State
  |--------------------------------------------------------------------------
  |
  | Login is a two-step authentication flow:
  |
  | 1. Email + password
  | 2. Email OTP
  |
  | The JWT is only stored after OTP verification.
  |
  */

  const [
    loginOtpStep,
    setLoginOtpStep,
  ] = useState(false);

  const [
    loginOtp,
    setLoginOtp,
  ] = useState("");

  const [
    otpEmail,
    setOtpEmail,
  ] = useState("");

  const [
    otpLoading,
    setOtpLoading,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Loading / Errors
  |--------------------------------------------------------------------------
  */

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  /*
  |--------------------------------------------------------------------------
  | Selected Ticket
  |--------------------------------------------------------------------------
  */

  const selectedTicket =
    tickets.find(
      (ticket: any) =>
        ticket.id ===
        selectedTicketId,
    );

  /*
  |--------------------------------------------------------------------------
  | Availability
  |--------------------------------------------------------------------------
  */

  const availableQuantity =
    selectedTicket
      ? Math.max(
          0,
          Number(
            selectedTicket.quantity,
          ) -
            Number(
              selectedTicket.sold,
            ),
        )
      : 0;

  /*
  |--------------------------------------------------------------------------
  | Currency
  |--------------------------------------------------------------------------
  */

  function formatCurrency(
    amount: number,
  ) {
    try {
      return amount.toLocaleString(
        "en-GB",
        {
          style: "currency",
          currency:
            event?.currency ??
            "USD",
        },
      );
    } catch {
      return `${event?.currency ?? "USD"} ${amount.toFixed(2)}`;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Total
  |--------------------------------------------------------------------------
  */

  const total =
    selectedTicket
      ? Number(
          selectedTicket.price,
        ) * quantity
      : 0;

  /*
  |--------------------------------------------------------------------------
  | Select Ticket
  |--------------------------------------------------------------------------
  */

  function selectTicket(
    ticket: any,
  ) {
    const available =
      Math.max(
        0,
        Number(
          ticket.quantity,
        ) -
          Number(
            ticket.sold,
          ),
      );

    if (available <= 0) {
      return;
    }

    setSelectedTicketId(
      ticket.id,
    );

    setQuantity(1);

    setError(null);
  }

  /*
  |--------------------------------------------------------------------------
  | Quantity
  |--------------------------------------------------------------------------
  */

  function decreaseQuantity() {
    setQuantity(
      Math.max(
        1,
        quantity - 1,
      ),
    );
  }

  function increaseQuantity() {
    setQuantity(
      Math.min(
        availableQuantity,
        quantity + 1,
      ),
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Validate Authentication
  |--------------------------------------------------------------------------
  */

  function validateAuth() {
    if (!email.trim()) {
      setError(
        "Email is required.",
      );

      return false;
    }

    if (!password) {
      setError(
        "Password is required.",
      );

      return false;
    }

    if (
      authMode === "register" &&
      !firstName.trim()
    ) {
      setError(
        "First name is required.",
      );

      return false;
    }

    if (
      authMode === "register" &&
      !lastName.trim()
    ) {
      setError(
        "Last name is required.",
      );

      return false;
    }

    if (
      authMode === "register" &&
      password.length < 6
    ) {
      setError(
        "Password must be at least 6 characters.",
      );

      return false;
    }

    return true;
  }

  /*
  |--------------------------------------------------------------------------
  | Continue Checkout
  |--------------------------------------------------------------------------
  */

  async function continueCheckout() {
    setError(null);

    /*
    |--------------------------------------------------------------------------
    | Ticket Validation
    |--------------------------------------------------------------------------
    */

    if (!selectedTicket) {
      setError(
        "Please select a ticket.",
      );

      return;
    }

    if (
      availableQuantity <= 0
    ) {
      setError(
        "This ticket is sold out.",
      );

      return;
    }

    if (
      quantity < 1 ||
      quantity >
        availableQuantity
    ) {
      setError(
        "The selected quantity is no longer available.",
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | If Login OTP Screen Is Active
    |--------------------------------------------------------------------------
    |
    | Do not restart password authentication.
    |
    | The user is already at step two.
    |
    */

    if (
      authMode === "login" &&
      loginOtpStep
    ) {
      await verifyOtpAndContinue();
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Check Existing Authentication
    |--------------------------------------------------------------------------
    |
    | An existing WowYou session can belong to an organizer, vendor,
    | attendee, or another authenticated account.
    |
    | We MUST verify the actual authenticated role before using that
    | session for ticket checkout.
    |
    */

    const existingToken =
      typeof window !==
      "undefined"
        ? localStorage.getItem(
            "token",
          )
        : null;

    if (existingToken) {
      setLoading(true);

      try {
        const currentUser =
          await getCurrentUser();

        /*
        |--------------------------------------------------------------------------
        | Existing Attendee
        |--------------------------------------------------------------------------
        */

        if (
          currentUser.success &&
          currentUser.user?.role
            ?.toUpperCase() ===
            "ATTENDEE"
        ) {
          await completePurchase();

          return;
        }

        /*
        |--------------------------------------------------------------------------
        | Existing Non-Attendee
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        |
        | Do NOT remove the existing token.
        |
        | An organizer may simply be browsing a public event while logged
        | into the organizer platform. Logging them out here would destroy
        | their organizer session.
        |
        | Instead, require attendee authentication for this purchase.
        |
        */

        setError(
          "You're currently signed in with a non-attendee account. Please sign in with an attendee account to purchase tickets.",
        );

        setAuthMode("login");

        return;
      } catch (err) {
        /*
        |--------------------------------------------------------------------------
        | Invalid / Expired Token
        |--------------------------------------------------------------------------
        |
        | If /auth/me fails, remove only the invalid authentication token
        | and allow normal attendee authentication to continue.
        |
        */

        console.warn(
          "Unable to verify existing WowYou session:",
          err,
        );

        localStorage.removeItem(
          "token",
        );
      } finally {
        setLoading(false);
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Validate New Authentication
    |--------------------------------------------------------------------------
    */

    if (!validateAuth()) {
      return;
    }

    setLoading(true);

    try {
      const normalizedEmail =
        email
          .trim()
          .toLowerCase();

      /*
      |--------------------------------------------------------------------------
      | Register
      |--------------------------------------------------------------------------
      */

      if (
        authMode ===
        "register"
      ) {
        const result =
          await registerUser({
            firstName:
              firstName.trim(),

            lastName:
              lastName.trim(),

            email:
              normalizedEmail,

            password,

            role:
              "ATTENDEE",
          });

        /*
        |--------------------------------------------------------------------------
        | Registration Response
        |--------------------------------------------------------------------------
        */

        if (
          !result.success ||
          !result.token
        ) {
          throw new Error(
            result.message ??
              "Unable to create your account.",
          );
        }

        /*
        |--------------------------------------------------------------------------
        | Verify Returned Role
        |--------------------------------------------------------------------------
        |
        | Registration was explicitly requested as ATTENDEE.
        | Still verify the returned user before storing the session.
        |
        */

        if (
          result.user?.role
            ?.toUpperCase() !==
          "ATTENDEE"
        ) {
          throw new Error(
            "Unable to create an attendee account.",
          );
        }

        /*
        |--------------------------------------------------------------------------
        | Store Attendee JWT
        |--------------------------------------------------------------------------
        */

        localStorage.setItem(
          "token",
          result.token,
        );

        /*
        |--------------------------------------------------------------------------
        | Continue Purchase
        |--------------------------------------------------------------------------
        */

        await completePurchase();

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Login
      |--------------------------------------------------------------------------
      */

      if (
        authMode === "login"
      ) {
        const result =
          await loginUser(
            normalizedEmail,
            password,
          );

        /*
        |--------------------------------------------------------------------------
        | Login Response
        |--------------------------------------------------------------------------
        |
        | The backend deliberately does NOT return a JWT here.
        |
        | It returns:
        |
        | {
        |   success: true,
        |   requiresOtp: true,
        |   email: "...",
        |   message: "..."
        | }
        |
        | The JWT is issued only after OTP verification.
        |
        */

        if (
          !result.success
        ) {
          throw new Error(
            result.message ??
              "Unable to sign you in.",
          );
        }

        /*
        |--------------------------------------------------------------------------
        | OTP Required
        |--------------------------------------------------------------------------
        */

        if (
          result.requiresOtp
        ) {
          setOtpEmail(
            result.email ??
              normalizedEmail,
          );

          setLoginOtp("");

          setLoginOtpStep(true);

          setError(null);

          return;
        }

        /*
        |--------------------------------------------------------------------------
        | Defensive Compatibility Check
        |--------------------------------------------------------------------------
        |
        | If an older backend ever returns a token directly, still validate
        | the attendee role before storing it.
        |
        */

        if (
          !result.token
        ) {
          throw new Error(
            result.message ??
              "Additional login verification is required before checkout.",
          );
        }

        if (
          result.user?.role
            ?.toUpperCase() !==
          "ATTENDEE"
        ) {
          throw new Error(
            "Please use an attendee account to purchase event tickets.",
          );
        }

        localStorage.setItem(
          "token",
          result.token,
        );

        await completePurchase();

        return;
      }
    } catch (err: any) {
      setError(
        err?.message ??
          "Unable to continue checkout.",
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Verify Login OTP And Continue
  |--------------------------------------------------------------------------
  */

  async function verifyOtpAndContinue() {
    setError(null);

    const normalizedEmail =
      (
        otpEmail ||
        email
      )
        .trim()
        .toLowerCase();

    const normalizedOtp =
      loginOtp
        .replace(/\D/g, "")
        .trim();

    if (!normalizedEmail) {
      setError(
        "Your login email is missing. Please start the login process again.",
      );

      setLoginOtpStep(false);

      return;
    }

    if (
      normalizedOtp.length !== 6
    ) {
      setError(
        "Enter the 6-digit verification code sent to your email.",
      );

      return;
    }

    setOtpLoading(true);

    setLoading(true);

    try {
      const result =
        await verifyLoginOtp({
          email:
            normalizedEmail,
          otp:
            normalizedOtp,
        });

      if (
        !result.success ||
        !result.token ||
        !result.user
      ) {
        throw new Error(
          result.message ??
            "Invalid or expired verification code.",
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Verify Attendee Role
      |--------------------------------------------------------------------------
      */

      if (
        result.user.role
          ?.toUpperCase() !==
        "ATTENDEE"
      ) {
        throw new Error(
          "Please use an attendee account to purchase event tickets.",
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Store JWT Only After OTP Verification
      |--------------------------------------------------------------------------
      */

      localStorage.setItem(
        "token",
        result.token,
      );

      /*
      |--------------------------------------------------------------------------
      | Clear OTP State
      |--------------------------------------------------------------------------
      */

      setLoginOtpStep(false);

      setLoginOtp("");

      setOtpEmail(
        normalizedEmail,
      );

      /*
      |--------------------------------------------------------------------------
      | Complete Purchase
      |--------------------------------------------------------------------------
      */

      await completePurchase();
    } catch (err: any) {
      setError(
        err?.message ??
          "Unable to verify the login code.",
      );
    } finally {
      setOtpLoading(false);

      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Resend Login OTP
  |--------------------------------------------------------------------------
  */

  async function handleResendOtp() {
    setError(null);

    const normalizedEmail =
      (
        otpEmail ||
        email
      )
        .trim()
        .toLowerCase();

    if (!normalizedEmail) {
      setError(
        "Your login email is missing. Please start the login process again.",
      );

      return;
    }

    setOtpLoading(true);

    try {
      const result =
        await resendLoginOtp(
          normalizedEmail,
        );

      if (
        !result.success
      ) {
        throw new Error(
          result.message ??
            "Unable to resend the verification code.",
        );
      }

      setLoginOtp("");

      setError(null);
    } catch (err: any) {
      setError(
        err?.message ??
          "Unable to resend the verification code.",
      );
    } finally {
      setOtpLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Back To Password Login
  |--------------------------------------------------------------------------
  */

  function backToLogin() {
    setLoginOtpStep(false);

    setLoginOtp("");

    setError(null);
  }

  /*
  |--------------------------------------------------------------------------
  | Complete Purchase
  |--------------------------------------------------------------------------
  */

  async function completePurchase() {
    if (!selectedTicket) {
      setError(
        "Please select a ticket.",
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Final Authentication Check
    |--------------------------------------------------------------------------
    |
    | We verify the actual authenticated user one more time immediately
    | before creating the purchase.
    |
    | This prevents a non-attendee session from ever being intentionally
    | submitted to the purchase endpoint by this checkout.
    |
    */

    const token =
      typeof window !==
      "undefined"
        ? localStorage.getItem(
            "token",
          )
        : null;

    if (!token) {
      setError(
        "Please sign in with an attendee account to continue.",
      );

      return;
    }

    setLoading(true);

    setError(null);

    try {
      /*
      |--------------------------------------------------------------------------
      | Verify Current User
      |--------------------------------------------------------------------------
      */

      const currentUser =
        await getCurrentUser();

      if (
        !currentUser.success ||
        !currentUser.user
      ) {
        throw new Error(
          "Unable to verify your WowYou account.",
        );
      }

      if (
        currentUser.user.role
          ?.toUpperCase() !==
        "ATTENDEE"
      ) {
        throw new Error(
          "Please use an attendee account to purchase event tickets.",
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Create Purchase
      |--------------------------------------------------------------------------
      |
      | This is the web attendee checkout.
      |
      | The backend remains responsible for validating the authenticated
      | account and determining the purchaser email.
      |
      */

      const result =
        await createPurchase({
          ticketTypeId:
            selectedTicket.id,

          quantity,

          channel: "web",
        });

      if (
        !result.success
      ) {
        throw new Error(
          result.message ??
            "Unable to create your purchase.",
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Free Ticket
      |--------------------------------------------------------------------------
      */

      if (
        !result.paymentRequired
      ) {
        window.location.href =
          `/attendee/dashboard?purchase=${encodeURIComponent(
            result.purchase.id,
          )}`;

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Paid Ticket
      |--------------------------------------------------------------------------
      */

      if (
        result.checkoutUrl
      ) {
        window.location.href =
          result.checkoutUrl;

        return;
      }

      throw new Error(
        "Unable to start payment.",
      );
    } catch (err: any) {
      setError(
        err?.message ??
          "Unable to complete your purchase.",
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Empty Tickets
  |--------------------------------------------------------------------------
  */

  if (!tickets.length) {
    return (
      <CheckoutShell
        onClose={onClose}
      >
        <div className="px-7 py-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[primary]">
            Tickets
          </p>

          <h2 className="mt-4 text-2xl font-bold">
            Tickets unavailable
          </h2>

          <p className="mt-3 text-sm leading-6 text-white/40">
            There are currently no
            tickets available for
            this event.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-7 rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/[0.05] hover:text-white"
          >
            Close
          </button>
        </div>
      </CheckoutShell>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Checkout UI
  |--------------------------------------------------------------------------
  */

  return (
    <CheckoutShell
      onClose={onClose}
    >
      {/* ------------------------------------------------ */}
      {/* HEADER */}
      {/* ------------------------------------------------ */}

      <div className="border-b border-white/10 px-7 py-6">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[primary]">
              Secure your place
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Get Tickets
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/40">
              {event.title}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-xl text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            ×
          </button>
        </div>
      </div>

      <div className="space-y-7 px-7 py-7">
        {/* ------------------------------------------------ */}
        {/* TICKETS */}
        {/* ------------------------------------------------ */}

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
            Select Ticket
          </p>

          <div className="space-y-3">
            {tickets.map(
              (
                ticket: any,
              ) => {
                const available =
                  Math.max(
                    0,
                    Number(
                      ticket.quantity,
                    ) -
                      Number(
                        ticket.sold,
                      ),
                  );

                const selected =
                  selectedTicketId ===
                  ticket.id;

                return (
                  <button
                    key={
                      ticket.id
                    }
                    type="button"
                    disabled={
                      available <=
                      0
                    }
                    onClick={() =>
                      selectTicket(
                        ticket,
                      )
                    }
                    className={`w-full rounded-2xl border p-5 text-left transition ${
                      selected
                        ? "border-[primary] bg-primary/10"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20"
                    } ${
                      available <=
                      0
                        ? "cursor-not-allowed opacity-40"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div className="min-w-0">
                        <p className="font-semibold text-white">
                          {
                            ticket.name
                          }
                        </p>

                        {ticket.description && (
                          <p className="mt-1 text-sm leading-6 text-white/40">
                            {
                              ticket.description
                            }
                          </p>
                        )}

                        <p className="mt-2 text-xs text-white/30">
                          {available >
                          0
                            ? `${available.toLocaleString()} available`
                            : "Sold out"}
                        </p>
                      </div>

                      <p className="shrink-0 text-lg font-bold text-white">
                        {formatCurrency(
                          Number(
                            ticket.price,
                          ),
                        )}
                      </p>
                    </div>
                  </button>
                );
              },
            )}
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* QUANTITY */}
        {/* ------------------------------------------------ */}

        {selectedTicket && (
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
              Quantity
            </p>

            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <button
                type="button"
                onClick={
                  decreaseQuantity
                }
                disabled={
                  quantity <= 1
                }
                className="h-10 w-10 rounded-full bg-white/10 text-xl transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-30"
              >
                −
              </button>

              <div className="text-center">
                <span className="text-lg font-bold">
                  {quantity}
                </span>

                <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-white/25">
                  ticket
                  {quantity ===
                  1
                    ? ""
                    : "s"}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  increaseQuantity
                }
                disabled={
                  quantity >=
                  availableQuantity
                }
                className="h-10 w-10 rounded-full bg-white/10 text-xl transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-30"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------ */}
        {/* ACCOUNT */}
        {/* ------------------------------------------------ */}

        <div className="border-t border-white/10 pt-7">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[primary]">
              Your account
            </p>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Your ticket and event
              access will be connected
              to your WowYou account.
            </p>
          </div>

          {/* ------------------------------------------------ */}
          {/* OTP SCREEN */}
          {/* ------------------------------------------------ */}

          {authMode ===
            "login" &&
            loginOtpStep ? (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-semibold text-white">
                  Verify your login
                </p>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  We sent a 6-digit
                  verification code to
                  <span className="ml-1 text-white/70">
                    {otpEmail ||
                      email}
                  </span>
                  .
                </p>
              </div>

              <Input
                label="Verification code"
                value={loginOtp}
                onChange={(value) =>
                  setLoginOtp(
                    value
                      .replace(
                        /\D/g,
                        "",
                      )
                      .slice(
                        0,
                        6,
                      ),
                  )
                }
                placeholder="000000"
                type="text"
                autoComplete="one-time-code"
              />

              <button
                type="button"
                onClick={
                  verifyOtpAndContinue
                }
                disabled={
                  loading ||
                  otpLoading ||
                  loginOtp.length !==
                    6
                }
                className="w-full rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {otpLoading ||
                loading
                  ? "Verifying..."
                  : "Verify & Continue"}
              </button>

              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={
                    backToLogin
                  }
                  disabled={
                    otpLoading
                  }
                  className="text-xs font-semibold text-white/40 transition hover:text-white disabled:opacity-40"
                >
                  Back to login
                </button>

                <button
                  type="button"
                  onClick={
                    handleResendOtp
                  }
                  disabled={
                    otpLoading
                  }
                  className="text-xs font-semibold text-primary transition hover:text-white disabled:opacity-40"
                >
                  {otpLoading
                    ? "Sending..."
                    : "Resend code"}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Auth Toggle */}

              <div className="mb-5 grid grid-cols-2 rounded-full border border-white/10 bg-white/[0.03] p-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(
                      "register",
                    );

                    setLoginOtpStep(
                      false,
                    );

                    setError(null);
                  }}
                  className={`rounded-full px-4 py-2.5 text-xs font-semibold transition ${
                    authMode ===
                    "register"
                      ? "bg-primary text-white"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  New attendee
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(
                      "login",
                    );

                    setLoginOtpStep(
                      false,
                    );

                    setError(null);
                  }}
                  className={`rounded-full px-4 py-2.5 text-xs font-semibold transition ${
                    authMode ===
                    "login"
                      ? "bg-primary text-white"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  Existing account
                </button>
              </div>

              {/* Registration */}

              {authMode ===
                "register" && (
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="First name"
                    value={
                      firstName
                    }
                    onChange={
                      setFirstName
                    }
                    placeholder="First name"
                    autoComplete="given-name"
                  />

                  <Input
                    label="Last name"
                    value={
                      lastName
                    }
                    onChange={
                      setLastName
                    }
                    placeholder="Last name"
                    autoComplete="family-name"
                  />
                </div>
              )}

              {/* Email */}

              <div
                className={
                  authMode ===
                  "register"
                    ? "mt-3"
                    : ""
                }
              >
                <Input
                  label="Email"
                  value={email}
                  onChange={
                    setEmail
                  }
                  placeholder="you@example.com"
                  type="email"
                  autoComplete="email"
                />
              </div>

              {/* Password */}

              <div className="mt-3">
                <Input
                  label="Password"
                  value={
                    password
                  }
                  onChange={
                    setPassword
                  }
                  placeholder="Password"
                  type="password"
                  autoComplete={
                    authMode ===
                    "register"
                      ? "new-password"
                      : "current-password"
                  }
                />
              </div>
            </>
          )}
        </div>

        {/* ------------------------------------------------ */}
        {/* ERROR */}
        {/* ------------------------------------------------ */}

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm leading-6 text-red-300">
            {error}
          </div>
        )}

        {/* ------------------------------------------------ */}
        {/* TOTAL */}
        {/* ------------------------------------------------ */}

        {selectedTicket && (
          <div className="border-t border-white/10 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-white/30">
                  Total
                </p>

                <p className="mt-1 text-sm text-white/50">
                  {quantity} ×{" "}
                  {
                    selectedTicket.name
                  }
                </p>
              </div>

              <span className="text-2xl font-bold text-white">
                {formatCurrency(
                  total,
                )}
              </span>
            </div>

            <button
              type="button"
              onClick={
                continueCheckout
              }
              disabled={
                loading ||
                otpLoading ||
                availableQuantity <=
                  0
              }
              className="mt-5 w-full rounded-full bg-primary px-6 py-4 text-sm font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loginOtpStep
                ? otpLoading ||
                  loading
                  ? "Verifying..."
                  : "Verify & Continue"
                : loading
                  ? "Preparing your ticket..."
                  : "Continue to Checkout"}
            </button>

            <p className="mt-4 text-center text-[11px] leading-5 text-white/25">
              Your account, ticket and
              event access stay connected
              throughout your WowYou
              experience.
            </p>
          </div>
        )}
      </div>
    </CheckoutShell>
  );
}

/*
|--------------------------------------------------------------------------
| Checkout Shell
|--------------------------------------------------------------------------
*/

function CheckoutShell({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-background/85 px-4 py-8 backdrop-blur-md">
      <div className="mx-auto flex min-h-full max-w-lg items-center">
        <div className="w-full overflow-hidden rounded-[28px] border border-white/10 bg-surface shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Input
|--------------------------------------------------------------------------
*/

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-white/40">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        type={type}
        autoComplete={
          autoComplete
        }
        placeholder={
          placeholder
        }
        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-[primary]"
      />
    </div>
  );
}