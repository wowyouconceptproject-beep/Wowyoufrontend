"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import {
  loginUser,
  resendLoginOtp,
  resendVerificationEmail,
  verifyLoginOtp,
} from "@/services/auth";

type Step = "login" | "otp";

export default function AttendeeLoginPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    clearMessages();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Enter your email address.");
      return;
    }

    if (!password) {
      setError("Enter your password.");
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser(normalizedEmail, password);

      if (!response.success) {
        setError(response.message || "Unable to sign in.");
        return;
      }

      if (response.requiresEmailVerification) {
        setSuccess(
          response.message ||
            "Your email address needs to be verified before you can continue.",
        );
        return;
      }

      if (response.requiresOtp) {
        setEmail(response.email || normalizedEmail);
        setStep("otp");
        setSuccess(
          response.message ||
            "We've sent a verification code to your email address.",
        );
        return;
      }

      if (response.token) {
        localStorage.setItem("wowyou_token", response.token);

        if (response.user) {
          localStorage.setItem("wowyou_user", JSON.stringify(response.user));
        }

        router.push("/attendee");
        router.refresh();
        return;
      }

      setError("Authentication could not be completed. Please try again.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while signing in.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    clearMessages();

    const normalizedOtp = otp.replace(/\D/g, "");

    if (normalizedOtp.length !== 6) {
      setError("Enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      const response = await verifyLoginOtp({
        email: email.trim().toLowerCase(),
        otp: normalizedOtp,
      });

      if (!response.success || !response.token) {
        setError(response.message || "Invalid verification code.");
        return;
      }

      localStorage.setItem("wowyou_token", response.token);

      if (response.user) {
        localStorage.setItem("wowyou_user", JSON.stringify(response.user));
      }

      router.push("/attendee");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to verify your code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    clearMessages();
    setResending(true);

    try {
      const response = await resendLoginOtp(email.trim().toLowerCase());

      if (!response.success) {
        setError(response.message || "Unable to resend the code.");
        return;
      }

      setSuccess(
        response.message ||
          "A new verification code has been sent to your email.",
      );
      setOtp("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to resend the verification code.",
      );
    } finally {
      setResending(false);
    }
  }

  async function handleResendVerification() {
    clearMessages();
    setResending(true);

    try {
      const response = await resendVerificationEmail(
        email.trim().toLowerCase(),
      );

      if (!response.success) {
        setError(
          response.message || "Unable to resend the verification email.",
        );
        return;
      }

      setSuccess(
        response.message ||
          "A new verification email has been sent to your inbox.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to resend the verification email.",
      );
    } finally {
      setResending(false);
    }
  }

  function handleBackToLogin() {
    clearMessages();
    setOtp("");
    setStep("login");
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#111111]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        {/* Brand panel */}
        <section className="relative hidden overflow-hidden bg-[#111111] lg:flex">
          <div className="absolute inset-0">
            <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-white/[0.04] blur-3xl" />
            <div className="absolute -bottom-40 -right-32 h-[620px] w-[620px] rounded-full bg-white/[0.05] blur-3xl" />
          </div>

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <Link href="/" className="inline-flex w-fit items-center">
              <div className="h-12 w-36 overflow-hidden rounded-xl bg-white p-2">
                <img
                  src="/branding/logo.png"
                  alt="WowYou"
                  className="h-full w-full object-contain"
                />
              </div>
            </Link>

            <div className="max-w-xl pb-10">
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
                The event experience
              </p>

              <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white xl:text-6xl">
                Your next
                <br />
                experience
                <br />
                starts here.
              </h1>

              <p className="mt-7 max-w-md text-base leading-7 text-white/55">
                Discover events, manage your tickets, connect with people and
                experience events differently with WowYou.
              </p>
            </div>

            <div className="flex items-center gap-6 text-xs text-white/35">
              <span>Discover</span>
              <span className="h-1 w-1 rounded-full bg-white/25" />
              <span>Connect</span>
              <span className="h-1 w-1 rounded-full bg-white/25" />
              <span>Experience</span>
            </div>
          </div>
        </section>

        {/* Login panel */}
        <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-[460px]">
            {/* Mobile logo */}
            <div className="mb-12 flex lg:hidden">
              <Link href="/" className="inline-flex">
                <div className="h-11 w-32 overflow-hidden rounded-xl bg-white p-2 shadow-sm ring-1 ring-black/5">
                  <img
                    src="/branding/logo.png"
                    alt="WowYou"
                    className="h-full w-full object-contain"
                  />
                </div>
              </Link>
            </div>

            {step === "login" ? (
              <>
                <div className="mb-10">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-black/35">
                    Attendee
                  </p>

                  <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                    Welcome back.
                  </h2>

                  <p className="mt-4 text-sm leading-6 text-black/50">
                    Sign in to access your tickets, events and WowYou
                    experience.
                  </p>
                </div>

                {error && (
                  <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-700">
                    <p>{success}</p>

                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={resending}
                      className="mt-2 font-semibold underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {resending
                        ? "Sending..."
                        : "Resend verification email"}
                    </button>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium"
                    >
                      Email address
                    </label>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        clearMessages();
                      }}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="h-14 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-black/30 focus:ring-4 focus:ring-black/[0.04]"
                    />
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium"
                      >
                        Password
                      </label>

                      <Link
                        href="/forgot-password"
                        className="text-xs font-semibold text-black/45 transition hover:text-black"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          clearMessages();
                        }}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="h-14 w-full rounded-2xl border border-black/10 bg-white px-4 pr-16 text-sm outline-none transition placeholder:text-black/30 focus:border-black/30 focus:ring-4 focus:ring-black/[0.04]"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-black/40 transition hover:text-black"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#111111] px-6 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                </form>

                <div className="my-8 flex items-center gap-4">
                  <div className="h-px flex-1 bg-black/8" />
                  <span className="text-xs text-black/30">OR</span>
                  <div className="h-px flex-1 bg-black/8" />
                </div>

                <div className="rounded-2xl border border-black/8 bg-white p-5">
                  <p className="text-sm text-black/55">
                    Don't have a WowYou attendee account?
                  </p>

                  <Link
                    href="/attendee/register"
                    className="mt-3 inline-flex text-sm font-semibold underline decoration-black/20 underline-offset-4 transition hover:decoration-black"
                  >
                    Create an attendee account
                  </Link>
                </div>

                <div className="mt-8 text-center">
                  <Link
                    href="/"
                    className="text-xs font-medium text-black/40 transition hover:text-black"
                  >
                    ← Back to WowYou
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="mb-10">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="mb-8 text-xs font-semibold text-black/40 transition hover:text-black"
                  >
                    ← Back to sign in
                  </button>

                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-black/35">
                    Security check
                  </p>

                  <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                    Check your email.
                  </h2>

                  <p className="mt-4 text-sm leading-6 text-black/50">
                    We sent a 6-digit verification code to{" "}
                    <span className="font-semibold text-black/75">
                      {email}
                    </span>
                    .
                  </p>
                </div>

                {error && (
                  <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-700">
                    {success}
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div>
                    <label
                      htmlFor="otp"
                      className="mb-2 block text-sm font-medium"
                    >
                      Verification code
                    </label>

                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={otp}
                      onChange={(event) => {
                        const value = event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6);

                        setOtp(value);
                        clearMessages();
                      }}
                      placeholder="000000"
                      autoFocus
                      className="h-16 w-full rounded-2xl border border-black/10 bg-white px-4 text-center text-2xl font-semibold tracking-[0.45em] outline-none transition placeholder:text-black/20 focus:border-black/30 focus:ring-4 focus:ring-black/[0.04]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#111111] px-6 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Verifying..." : "Verify & continue"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-black/40">
                    Didn't receive the code?
                  </p>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resending}
                    className="mt-2 text-sm font-semibold underline decoration-black/20 underline-offset-4 transition hover:decoration-black disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {resending ? "Sending..." : "Resend code"}
                  </button>
                </div>

                <div className="mt-8 text-center">
                  <Link
                    href="/"
                    className="text-xs font-medium text-black/40 transition hover:text-black"
                  >
                    ← Back to WowYou
                  </Link>
                </div>
              </>
            )}

            <div className="mt-12 border-t border-black/8 pt-6 text-center">
              <p className="text-[11px] leading-5 text-black/30">
                By continuing, you agree to WowYou&apos;s terms and privacy
                policy.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}