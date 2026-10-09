"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";

import {
  loginUser,
  resendLoginOtp,
  resendVerificationEmail,
  verifyLoginOtp,
} from "@/services/auth";

type Step = "login" | "otp" | "verification";

const BRAND = "#3E86A4";
const BRAND_HOVER = "#1F7197";

export default function AttendeeLoginPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  function saveSession(
    token: string,
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    },
  ) {
    /*
     * Keep the token key consistent with the rest of the
     * attendee application. The API client/authenticated
     * dashboard reads this key.
     */
    localStorage.setItem("token", token);

    /*
     * Also keep the legacy key if another attendee component
     * uses it.
     */
    localStorage.setItem("wowyou_token", token);

    if (user) {
      localStorage.setItem("wowyou_user", JSON.stringify(user));
    }
  }

  function validateAttendeeRole(role?: string) {
    return role?.toUpperCase() === "ATTENDEE";
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
        setError(response.message || "Unable to sign you in.");
        return;
      }

      /*
       * Email verification is required before OTP/login.
       */
      if (response.requiresEmailVerification) {
        setEmail(normalizedEmail);
        setStep("verification");

        setSuccess(
          response.message ||
            "Please verify your email address before signing in.",
        );

        return;
      }

      /*
       * Password accepted. Backend requires OTP.
       */
      if (response.requiresOtp) {
        setEmail(response.email || normalizedEmail);
        setOtp("");
        setStep("otp");

        setSuccess(
          response.message ||
            "We've sent a 6-digit verification code to your email.",
        );

        return;
      }

      /*
       * Some environments may return a token directly.
       */
      if (!response.token) {
        setError(
          response.message ||
            "Additional verification is required before you can continue.",
        );

        return;
      }

      /*
       * Attendee-only protection.
       */
      if (
        response.user &&
        !validateAttendeeRole(response.user.role)
      ) {
        setError("This account is not an attendee account.");
        return;
      }

      saveSession(response.token, response.user);

      /*
       * IMPORTANT:
       * The attendee dashboard is /attendee/dashboard.
       * There is intentionally NO redirect to /attendee.
       */
      router.replace("/attendee/dashboard");
      router.refresh();
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

  async function handleVerifyOtp(
    event: FormEvent<HTMLFormElement>,
  ) {
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

      /*
       * Do not allow organizer/vendor accounts into
       * the attendee dashboard.
       */
      if (
        response.user &&
        !validateAttendeeRole(response.user.role)
      ) {
        setError("This account is not an attendee account.");
        return;
      }

      saveSession(response.token, response.user);

      /*
       * IMPORTANT:
       * OTP login also goes directly to the attendee dashboard.
       */
      router.replace("/attendee/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to verify your code.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    clearMessages();
    setResending(true);

    try {
      const response = await resendLoginOtp(
        email.trim().toLowerCase(),
      );

      if (!response.success) {
        setError(
          response.message ||
            "Unable to resend the verification code.",
        );

        return;
      }

      setOtp("");

      setSuccess(
        response.message ||
          "A new verification code has been sent to your email.",
      );
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
          response.message ||
            "Unable to resend the verification email.",
        );

        return;
      }

      setSuccess(
        response.message ||
          "A new verification email has been sent.",
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

  function backToLogin() {
    clearMessages();
    setOtp("");
    setStep("login");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Background */}
      <div
        className="pointer-events-none absolute left-1/2 top-[-280px] h-[650px] w-[650px] -translate-x-1/2 rounded-full blur-[170px]"
        style={{
          backgroundColor: `${BRAND}18`,
        }}
      />

      <div
        className="pointer-events-none absolute bottom-[-300px] right-[-200px] h-[650px] w-[650px] rounded-full blur-[180px]"
        style={{
          backgroundColor: `${BRAND}10`,
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,0.4)_70%,rgba(5,5,5,0.9)_100%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[460px]">
          {/* Brand */}
          <div className="mb-10 flex justify-center">
            <Link
              href="/"
              className="group inline-flex items-center"
            >
              <div className="relative h-12 w-36 overflow-hidden rounded-xl border border-white/10 bg-white/[0.96] p-2 shadow-2xl shadow-black/30 transition group-hover:border-white/20">
                <img
                  src="/branding/logo.png"
                  alt="WowYou"
                  className="h-full w-full object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Login Card */}
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/40 backdrop-blur-xl">
            {/* Brand accent */}
            <div
              className="h-[2px] w-full"
              style={{
                backgroundColor: BRAND,
              }}
            />

            <div className="p-7 sm:p-9">
              {/* LOGIN */}
              {step === "login" && (
                <>
                  <div className="mb-8">
                    <p
                      className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em]"
                      style={{
                        color: BRAND,
                      }}
                    >
                      ATTENDEE ACCESS
                    </p>

                    <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                      Welcome back.
                    </h1>

                    <p className="mt-3 max-w-sm text-sm leading-6 text-white/45">
                      Sign in to manage your tickets,
                      discover experiences and connect
                      through WowYou.
                    </p>
                  </div>

                  {error && (
                    <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/[0.07] px-4 py-3 text-sm leading-5 text-red-300">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div
                      className="mb-5 rounded-2xl border px-4 py-3 text-sm leading-5"
                      style={{
                        borderColor: `${BRAND}35`,
                        backgroundColor: `${BRAND}0d`,
                        color: "#9bc8d9",
                      }}
                    >
                      {success}
                    </div>
                  )}

                  <form
                    onSubmit={handleLogin}
                    className="space-y-5"
                  >
                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-xs font-semibold text-white/65"
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
                        className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#3E86A4] focus:bg-white/[0.05] focus:ring-4 focus:ring-[#3E86A4]/10"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label
                          htmlFor="password"
                          className="block text-xs font-semibold text-white/65"
                        >
                          Password
                        </label>

                        <Link
                          href="/forgot-password"
                          className="text-[11px] font-semibold transition hover:text-white"
                          style={{
                            color: `${BRAND}cc`,
                          }}
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <div className="relative">
                        <input
                          id="password"
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          value={password}
                          onChange={(event) => {
                            setPassword(event.target.value);
                            clearMessages();
                          }}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 pr-14 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#3E86A4] focus:bg-white/[0.05] focus:ring-4 focus:ring-[#3E86A4]/10"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(
                              (value) => !value,
                            )
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white"
                          aria-label={
                            showPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-sm font-bold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-50"
                      style={{
                        backgroundColor: BRAND,
                        boxShadow: `0 10px 35px ${BRAND}22`,
                      }}
                      onMouseEnter={(event) => {
                        if (!loading) {
                          event.currentTarget.style.backgroundColor =
                            BRAND_HOVER;
                        }
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.backgroundColor =
                          BRAND;
                      }}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Signing in...
                        </span>
                      ) : (
                        <>
                          Sign in
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Register */}
                  <div className="mt-8 border-t border-white/8 pt-7 text-center">
                    <p className="text-sm text-white/35">
                      New to WowYou?
                    </p>

                    <Link
                      href="/attendee/register"
                      className="mt-2 inline-flex text-sm font-semibold transition hover:text-white"
                      style={{
                        color: BRAND,
                      }}
                    >
                      Create an attendee account
                    </Link>
                  </div>
                </>
              )}

              {/* OTP */}
              {step === "otp" && (
                <>
                  <div className="mb-8">
                    <button
                      type="button"
                      onClick={backToLogin}
                      className="mb-7 text-xs font-semibold text-white/35 transition hover:text-white"
                    >
                      ← Back to sign in
                    </button>

                    <div
                      className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
                      style={{
                        backgroundColor: `${BRAND}18`,
                        color: BRAND,
                      }}
                    >
                      <ShieldCheck className="h-5 w-5" />
                    </div>

                    <p
                      className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em]"
                      style={{
                        color: BRAND,
                      }}
                    >
                      SECURITY CHECK
                    </p>

                    <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white">
                      Check your email.
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-white/45">
                      Enter the 6-digit verification
                      code we sent to{" "}
                      <span className="font-semibold text-white/70">
                        {email}
                      </span>
                      .
                    </p>
                  </div>

                  {error && (
                    <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/[0.07] px-4 py-3 text-sm leading-5 text-red-300">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div
                      className="mb-5 rounded-2xl border px-4 py-3 text-sm leading-5"
                      style={{
                        borderColor: `${BRAND}35`,
                        backgroundColor: `${BRAND}0d`,
                        color: "#9bc8d9",
                      }}
                    >
                      {success}
                    </div>
                  )}

                  <form
                    onSubmit={handleVerifyOtp}
                    className="space-y-5"
                  >
                    <div>
                      <label
                        htmlFor="otp"
                        className="mb-2 block text-xs font-semibold text-white/65"
                      >
                        Verification code
                      </label>

                      <input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        autoFocus
                        value={otp}
                        onChange={(event) => {
                          const value = event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6);

                          setOtp(value);
                          clearMessages();
                        }}
                        placeholder="000000"
                        className="h-16 w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 text-center text-2xl font-bold tracking-[0.45em] text-white outline-none transition placeholder:text-white/10 focus:border-[#3E86A4] focus:ring-4 focus:ring-[#3E86A4]/10"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-sm font-bold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-50"
                      style={{
                        backgroundColor: BRAND,
                        boxShadow: `0 10px 35px ${BRAND}22`,
                      }}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Verifying...
                        </span>
                      ) : (
                        <>
                          Verify & continue
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-7 text-center">
                    <p className="text-xs text-white/30">
                      Didn't receive the code?
                    </p>

                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resending}
                      className="mt-2 text-xs font-semibold transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      style={{
                        color: BRAND,
                      }}
                    >
                      {resending
                        ? "Sending..."
                        : "Resend verification code"}
                    </button>
                  </div>
                </>
              )}

              {/* EMAIL VERIFICATION */}
              {step === "verification" && (
                <>
                  <div className="mb-8">
                    <button
                      type="button"
                      onClick={backToLogin}
                      className="mb-7 text-xs font-semibold text-white/35 transition hover:text-white"
                    >
                      ← Back to sign in
                    </button>

                    <div
                      className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
                      style={{
                        backgroundColor: `${BRAND}18`,
                        color: BRAND,
                      }}
                    >
                      <ShieldCheck className="h-5 w-5" />
                    </div>

                    <p
                      className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em]"
                      style={{
                        color: BRAND,
                      }}
                    >
                      EMAIL VERIFICATION
                    </p>

                    <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white">
                      Verify your email.
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-white/45">
                      Your attendee account needs to be
                      verified before you can continue.
                    </p>
                  </div>

                  {error && (
                    <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/[0.07] px-4 py-3 text-sm leading-5 text-red-300">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div
                      className="mb-5 rounded-2xl border px-4 py-3 text-sm leading-6"
                      style={{
                        borderColor: `${BRAND}35`,
                        backgroundColor: `${BRAND}0d`,
                        color: "#9bc8d9",
                      }}
                    >
                      {success}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resending}
                    className="flex h-14 w-full items-center justify-center rounded-2xl text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      backgroundColor: BRAND,
                    }}
                  >
                    {resending
                      ? "Sending verification email..."
                      : "Resend verification email"}
                  </button>

                  <button
                    type="button"
                    onClick={backToLogin}
                    className="mt-5 flex h-12 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] text-sm font-semibold text-white/60 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    Return to sign in
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="flex items-center gap-5 text-[10px] uppercase tracking-[0.18em] text-white/20">
              <Link
                href="/"
                className="transition hover:text-white/50"
              >
                Home
              </Link>

              <span className="h-1 w-1 rounded-full bg-white/15" />

              <Link
                href="/events"
                className="transition hover:text-white/50"
              >
                Events
              </Link>

              <span className="h-1 w-1 rounded-full bg-white/15" />

              <Link
                href="/legal/privacy"
                className="transition hover:text-white/50"
              >
                Privacy
              </Link>
            </div>

            <p className="text-[10px] text-white/20">
              © {new Date().getFullYear()} WowYou
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}