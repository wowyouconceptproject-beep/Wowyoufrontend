"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { apiFetch } from "@/lib/api";
import { resendVerificationEmail } from "@/services/auth";

interface VerificationResponse {
  success: boolean;
  message?: string;
}

type VerificationState = "loading" | "success" | "error";

const RESEND_COOLDOWN_SECONDS = 60;

/*
|--------------------------------------------------------------------------
| Verification Content
|--------------------------------------------------------------------------
*/

function VerifyEmailContent(): React.JSX.Element {
  const searchParams = useSearchParams();

  const token = searchParams.get("token") ?? "";
  const initialEmail = searchParams.get("email") ?? "";

  const [state, setState] = useState<VerificationState>("loading");

  const [message, setMessage] = useState<string>(
    "Verifying your email address...",
  );

  const [resendEmail, setResendEmail] = useState<string>(initialEmail);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [resendMessage, setResendMessage] = useState<string>("");
  const [resendError, setResendError] = useState<string>("");
  const [resendCountdown, setResendCountdown] = useState<number>(0);

  /*
  |--------------------------------------------------------------------------
  | Verify Email
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let cancelled = false;

    async function verifyEmail(): Promise<void> {
      if (!token) {
        setState("error");
        setMessage(
          "This email verification link is missing its verification token.",
        );
        return;
      }

      try {
        const response = await apiFetch<VerificationResponse>(
          `/auth/verify-email?token=${encodeURIComponent(token)}`,
          {
            method: "GET",
            withAuth: false,
          },
        );

        if (cancelled) {
          return;
        }

        if (!response.success) {
          throw new Error(
            response.message ?? "Email verification failed.",
          );
        }

        setState("success");
        setMessage(
          response.message ??
            "Your email address has been verified successfully.",
        );
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        setState("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Email verification failed. Please request a new verification email.",
        );
      }
    }

    void verifyEmail();

    return () => {
      cancelled = true;
    };
  }, [token]);

  /*
  |--------------------------------------------------------------------------
  | Resend Cooldown
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (resendCountdown <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setResendCountdown((currentCountdown: number) =>
        Math.max(currentCountdown - 1, 0),
      );
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [resendCountdown]);

  /*
  |--------------------------------------------------------------------------
  | Resend Verification Email
  |--------------------------------------------------------------------------
  */

  const handleResendVerification = useCallback(
    async (event: FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();

      const email = resendEmail.trim().toLowerCase();

      if (resendLoading || resendCountdown > 0) {
        return;
      }

      if (!email) {
        setResendError(
          "Enter the email address you registered with.",
        );
        setResendMessage("");
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        setResendError("Enter a valid email address.");
        setResendMessage("");
        return;
      }

      try {
        setResendLoading(true);
        setResendError("");
        setResendMessage("");

        const response = await resendVerificationEmail(email);

        if (!response.success) {
          throw new Error(
            response.message ??
              "Unable to resend your verification email.",
          );
        }

        setResendMessage(
          response.message ??
            "Verification email sent. Please check your inbox and spam folder.",
        );

        setResendCountdown(RESEND_COOLDOWN_SECONDS);
      } catch (error: unknown) {
        setResendError(
          error instanceof Error
            ? error.message
            : "Failed to resend your verification email. Please try again.",
        );
      } finally {
        setResendLoading(false);
      }
    },
    [resendEmail, resendLoading, resendCountdown],
  );

  /*
  |--------------------------------------------------------------------------
  | Email Input Change
  |--------------------------------------------------------------------------
  */

  const handleEmailChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setResendEmail(event.currentTarget.value);
    setResendError("");
    setResendMessage("");
  };

  /*
  |--------------------------------------------------------------------------
  | Render Verification Page
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-[#f8f8f6] px-6 py-16">
      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
        <div className="w-full rounded-3xl border border-black/10 bg-white p-8 text-center shadow-sm sm:p-12">
          {/* Logo */}

          <div className="mb-10">
            <Link
              href="/"
              className="text-xl font-semibold tracking-[-0.03em] text-black"
            >
              WOWYOU
            </Link>
          </div>

          {/* Loading State */}

          {state === "loading" && (
            <>
              <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-black/[0.04]">
                <div
                  className="h-7 w-7 animate-spin rounded-full border-2 border-black/10 border-t-black"
                  role="status"
                  aria-label="Verifying email"
                />
              </div>

              <h1 className="text-2xl font-semibold tracking-[-0.03em] text-black sm:text-3xl">
                Verifying your email
              </h1>

              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-black/55 sm:text-base">
                {message}
              </p>
            </>
          )}

          {/* Success State */}

          {state === "success" && (
            <>
              <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-8 w-8 text-emerald-600"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12.5 9.2 17 19 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-semibold tracking-[-0.03em] text-black sm:text-3xl">
                Email verified
              </h1>

              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-black/55 sm:text-base">
                {message}
              </p>

              <div className="mt-8">
                <Link
                  href="/login"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-black px-6 text-sm font-medium text-white transition hover:bg-black/85"
                >
                  Continue to login
                </Link>
              </div>
            </>
          )}

          {/* Error State */}

          {state === "error" && (
            <>
              <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-8 w-8 text-red-600"
                  aria-hidden="true"
                >
                  <path
                    d="M12 8v5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  <circle
                    cx="12"
                    cy="16.5"
                    r="1"
                    fill="currentColor"
                  />

                  <path
                    d="M10.3 4.8 2.9 17.6A2 2 0 0 0 4.6 20.6h14.8a2 2 0 0 0 1.7-3L13.7 4.8a2 2 0 0 0-3.4 0Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-semibold tracking-[-0.03em] text-black sm:text-3xl">
                Verification failed
              </h1>

              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-black/55 sm:text-base">
                {message}
              </p>

              {/* Resend Verification Form */}

              <form
                className="mx-auto mt-7 max-w-sm text-left"
                onSubmit={handleResendVerification}
              >
                <label
                  htmlFor="resend-verification-email"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Email address
                </label>

                <input
                  id="resend-verification-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={resendEmail}
                  onChange={handleEmailChange}
                  placeholder="you@example.com"
                  className="min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-black focus:ring-1 focus:ring-black"
                />

                {resendError && (
                  <p
                    role="alert"
                    className="mt-3 text-sm leading-5 text-red-600"
                  >
                    {resendError}
                  </p>
                )}

                {resendMessage && (
                  <p
                    role="status"
                    className="mt-3 text-sm leading-5 text-emerald-700"
                  >
                    {resendMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={resendLoading || resendCountdown > 0}
                  className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-black px-6 text-sm font-medium text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {resendLoading
                    ? "Sending verification email..."
                    : resendCountdown > 0
                      ? `Resend available in ${resendCountdown}s`
                      : "Resend verification email"}
                </button>

                <p className="mt-3 text-center text-xs leading-5 text-black/45">
                  Enter the email address you used to create your account.
                </p>
              </form>

              {/* Navigation */}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/login"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-black px-6 text-sm font-medium text-white transition hover:bg-black/85"
                >
                  Go to login
                </Link>

                <Link
                  href="/register"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-black/10 bg-white px-6 text-sm font-medium text-black transition hover:bg-black/[0.03]"
                >
                  Create account
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Suspense Fallback
|--------------------------------------------------------------------------
*/

function VerifyEmailFallback(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-[#f8f8f6] px-6 py-16">
      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
        <div className="w-full rounded-3xl border border-black/10 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mb-10">
            <Link
              href="/"
              className="text-xl font-semibold tracking-[-0.03em] text-black"
            >
              WOWYOU
            </Link>
          </div>

          <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-black/[0.04]">
            <div
              className="h-7 w-7 animate-spin rounded-full border-2 border-black/10 border-t-black"
              role="status"
              aria-label="Loading verification"
            />
          </div>

          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-black sm:text-3xl">
            Loading verification
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-black/55 sm:text-base">
            Please wait while we load your verification link.
          </p>
        </div>
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Verify Email Page
|--------------------------------------------------------------------------
*/

export default function VerifyEmailPage(): React.JSX.Element {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}