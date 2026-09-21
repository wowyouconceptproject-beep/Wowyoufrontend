"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import Link from "next/link";

import { apiFetch } from "@/lib/api";

type VerificationState =
  | "loading"
  | "success"
  | "error";

/*
|--------------------------------------------------------------------------
| Verification Content
|--------------------------------------------------------------------------
*/

function VerifyEmailContent() {
  const searchParams =
    useSearchParams();

  const [state, setState] =
    useState<VerificationState>(
      "loading",
    );

  const [message, setMessage] =
    useState(
      "Verifying your email address...",
    );

  useEffect(() => {
    /*
    |--------------------------------------------------------------------------
    | Get Verification Token
    |--------------------------------------------------------------------------
    |
    | URLSearchParams.get() returns string | null.
    | Converting the value to an explicit string here prevents the
    | TypeScript string | null error when the token is used below.
    |
    */

    const tokenParam =
      searchParams.get("token");

    const token =
      tokenParam ?? "";

    /*
    |--------------------------------------------------------------------------
    | Missing Token
    |--------------------------------------------------------------------------
    */

    if (!token) {
      setState("error");

      setMessage(
        "This email verification link is missing its verification token.",
      );

      return;
    }

    let cancelled = false;

    /*
    |--------------------------------------------------------------------------
    | Verify Email
    |--------------------------------------------------------------------------
    */

    async function verifyEmail() {
      try {
        const data =
          await apiFetch<{
            success: boolean;
            message?: string;
          }>(
            `/auth/verify-email?token=${encodeURIComponent(
              token,
            )}`,
            {
              method: "GET",
              withAuth: false,
            },
          );

        /*
        |--------------------------------------------------------------------------
        | Component Unmounted
        |--------------------------------------------------------------------------
        */

        if (cancelled) {
          return;
        }

        /*
        |--------------------------------------------------------------------------
        | API Reported Failure
        |--------------------------------------------------------------------------
        */

        if (!data.success) {
          throw new Error(
            data.message ||
              "Email verification failed.",
          );
        }

        /*
        |--------------------------------------------------------------------------
        | Success
        |--------------------------------------------------------------------------
        */

        setState("success");

        setMessage(
          data.message ||
            "Your email address has been verified successfully.",
        );
      } catch (error: unknown) {
        /*
        |--------------------------------------------------------------------------
        | Component Unmounted
        |--------------------------------------------------------------------------
        */

        if (cancelled) {
          return;
        }

        /*
        |--------------------------------------------------------------------------
        | Error
        |--------------------------------------------------------------------------
        */

        setState("error");

        setMessage(
          error instanceof Error
            ? error.message
            : "Email verification failed. Please request a new verification email.",
        );
      }
    }

    verifyEmail();

    /*
    |--------------------------------------------------------------------------
    | Cleanup
    |--------------------------------------------------------------------------
    */

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

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

          {/* ---------------------------------------------------------- */}
          {/* Loading */}
          {/* ---------------------------------------------------------- */}

          {state === "loading" && (
            <>
              <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-black/[0.04]">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-black/10 border-t-black" />
              </div>

              <h1 className="text-2xl font-semibold tracking-[-0.03em] text-black sm:text-3xl">
                Verifying your email
              </h1>

              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-black/55 sm:text-base">
                {message}
              </p>
            </>
          )}

          {/* ---------------------------------------------------------- */}
          {/* Success */}
          {/* ---------------------------------------------------------- */}

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

          {/* ---------------------------------------------------------- */}
          {/* Error */}
          {/* ---------------------------------------------------------- */}

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

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
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

function VerifyEmailFallback() {
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

          {/* Spinner */}
          <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-black/[0.04]">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-black/10 border-t-black" />
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
|
| useSearchParams() requires a Suspense boundary during Next.js
| production prerendering.
|
*/

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <VerifyEmailFallback />
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}