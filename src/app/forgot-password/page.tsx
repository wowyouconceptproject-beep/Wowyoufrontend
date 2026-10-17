
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import {
  forgotPassword,
  verifyResetCode,
  resetPassword as resetPasswordRequest,
} from "@/services/auth";

type RecoveryStep = "email" | "code" | "password" | "complete";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<RecoveryStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = window.setTimeout(() => {
      setResendCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendCooldown]);

  async function requestResetCode() {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (step === "code" && resendCooldown > 0) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      await forgotPassword({
        email: normalizedEmail,
      });

      setEmail(normalizedEmail);
      setCode("");
      setStep("code");
      setResendCooldown(60);

      setSuccessMessage(
        "If an account exists for this email, a password reset code has been sent. Please check your inbox.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to request a password reset. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function verifyResetCodeHandler() {
    const normalizedCode = code.replace(/\D/g, "");

    if (normalizedCode.length !== 6) {
      setError("Enter the 6-digit reset code.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const data = await verifyResetCode({
        email: email.trim(),
        code: normalizedCode,
      });

      if (!data.resetToken) {
        throw new Error(
          "The server did not return a reset token. Please request a new code.",
        );
      }

      setResetToken(data.resetToken);
      setStep("password");
      setSuccessMessage("Code verified. Set your new password.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to verify the reset code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordReset() {
    if (password.length < 8 || password.length > 128) {
      setError("Your password must contain between 8 and 128 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    if (!resetToken) {
      setError("Your reset session has expired. Please request a new code.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      await resetPasswordRequest({
        email: email.trim(),
        resetToken,
        newPassword: password,
      });

      setPassword("");
      setConfirmPassword("");
      setCode("");
      setResetToken("");
      setStep("complete");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reset your password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function goBack() {
    setError("");
    setSuccessMessage("");

    if (step === "complete") {
      router.push("/login");
      return;
    }

    if (step === "password") {
      setStep("code");
      setResetToken("");
      return;
    }

    if (step === "code") {
      setStep("email");
      setCode("");
      return;
    }

    router.push("/login");
  }

  const heading: Record<RecoveryStep, string> = {
    email: "Forgot your password?",
    code: "Check your email",
    password: "Create a new password",
    complete: "Password reset complete",
  };

  const description: Record<RecoveryStep, string> = {
    email:
      "Enter the email address associated with your organizer account. We'll send you a password reset code.",
    code: `Enter the 6-digit password reset code sent to ${email}.`,
    password:
      "Choose a strong new password to secure your organizer account.",
    complete:
      "Your password has been updated successfully. You can now sign in using your new password.",
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        className="
          pointer-events-none absolute left-1/2 top-[-260px]
          h-[620px] w-[620px] -translate-x-1/2
          rounded-full bg-primary-light/12 blur-[150px]
        "
      />

      <div
        className="
          pointer-events-none absolute bottom-[-300px] right-[-200px]
          h-[600px] w-[600px] rounded-full
          bg-primary-light/8 blur-[160px]
        "
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-[440px]">
          {/* Brand */}
          <div className="mb-12 text-center">
            <div
              className="
                mb-5 inline-flex h-14 w-14 items-center justify-center
                overflow-hidden rounded-2xl border border-primary/20
                bg-primary-light/12 p-2
              "
            >
              <img
                src="/branding/logo.png"
                alt="WowYou"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="text-2xl font-black tracking-[0.28em] text-primary">
              WOWYOU
            </div>

            <p className="mt-2 text-[10px] font-semibold tracking-[0.32em] text-muted">
              EVENT TECHNOLOGY
            </p>
          </div>

          {/* Heading */}
          <div className="mb-9">
            <button
              type="button"
              onClick={goBack}
              className="
                mb-6 inline-flex items-center gap-2
                text-sm font-semibold text-primary transition
                hover:text-primary-light
              "
            >
              <ArrowLeft className="h-4 w-4" />
              {step === "email" || step === "complete"
                ? "Back to Sign In"
                : "Back"}
            </button>

            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              {heading[step]}
            </h1>

            <p className="mt-3 text-[15px] leading-7 text-text-secondary">
              {description[step]}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3.5 text-sm text-danger"
            >
              {error}
            </div>
          )}

          {/* Success */}
          {successMessage && (
            <div
              role="status"
              className="mb-6 rounded-2xl border border-primary/20 bg-primary-light/10 px-4 py-3.5 text-sm text-primary"
            >
              {successMessage}
            </div>
          )}

          {/* Step 1: Email */}
          {step === "email" && (
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                void requestResetCode();
              }}
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2.5 block text-sm font-medium text-text-secondary"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    className="
                      h-14 w-full rounded-2xl border
                      border-white/[0.08] bg-surface-elevated
                      pl-12 pr-5 text-[15px] text-foreground
                      outline-none transition placeholder:text-muted
                      focus:border-primary/70 focus:ring-4
                      focus:ring-primary/10
                    "
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  flex h-14 w-full items-center justify-center
                  rounded-2xl bg-primary px-6 text-[15px]
                  font-bold text-background transition
                  hover:bg-primary-light disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          )}

          {/* Step 2: Reset code */}
          {step === "code" && (
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                void verifyResetCodeHandler();
              }}
            >
              <div>
                <label
                  htmlFor="resetCode"
                  className="mb-2.5 block text-sm font-medium text-text-secondary"
                >
                  6-digit reset code
                </label>

                <input
                  id="resetCode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(event) =>
                    setCode(
                      event.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  placeholder="000000"
                  className="
                    h-16 w-full rounded-2xl border
                    border-white/[0.08] bg-surface-elevated
                    px-5 text-center text-2xl font-bold
                    tracking-[0.45em] text-foreground outline-none
                    transition placeholder:text-muted
                    focus:border-primary/70 focus:ring-4
                    focus:ring-primary/10
                  "
                />
              </div>

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="
                  flex h-14 w-full items-center justify-center
                  rounded-2xl bg-primary px-6 text-[15px]
                  font-bold text-background transition
                  hover:bg-primary-light disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>

              <button
                type="button"
                onClick={() => void requestResetCode()}
                disabled={loading || resendCooldown > 0}
                className="
                  flex w-full items-center justify-center
                  rounded-2xl px-6 py-3 text-sm font-semibold
                  text-primary transition hover:text-primary-light
                  disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                {resendCooldown > 0
                  ? `Resend code in ${resendCooldown}s`
                  : loading
                    ? "Please wait..."
                    : "Resend reset code"}
              </button>
            </form>
          )}

          {/* Step 3: New password */}
          {step === "password" && (
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                void handlePasswordReset();
              }}
            >
              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2.5 block text-sm font-medium text-text-secondary"
                >
                  New password
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />

                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={128}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    className="
                      h-14 w-full rounded-2xl border
                      border-white/[0.08] bg-surface-elevated
                      pl-12 pr-14 text-[15px] text-foreground
                      outline-none transition placeholder:text-muted
                      focus:border-primary/70 focus:ring-4
                      focus:ring-primary/10
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="
                      absolute right-3 top-1/2 flex h-9 w-9
                      -translate-y-1/2 items-center justify-center
                      rounded-xl text-muted transition hover:text-primary
                    "
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-xs text-muted">
                  Use between 8 and 128 characters.
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2.5 block text-sm font-medium text-text-secondary"
                >
                  Confirm new password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={128}
                    required
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Enter your password again"
                    className="
                      h-14 w-full rounded-2xl border
                      border-white/[0.08] bg-surface-elevated
                      px-5 pr-14 text-[15px] text-foreground
                      outline-none transition placeholder:text-muted
                      focus:border-primary/70 focus:ring-4
                      focus:ring-primary/10
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((value) => !value)
                    }
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    className="
                      absolute right-3 top-1/2 flex h-9 w-9
                      -translate-y-1/2 items-center justify-center
                      rounded-xl text-muted transition hover:text-primary
                    "
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-surface-elevated px-4 py-3.5">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm leading-6 text-text-secondary">
                  Your new password will be used the next time you sign in.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  flex h-14 w-full items-center justify-center
                  rounded-2xl bg-primary px-6 text-[15px]
                  font-bold text-background transition
                  hover:bg-primary-light disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading ? "Updating Password..." : "Reset Password"}
              </button>
            </form>
          )}

          {/* Step 4: Complete */}
          {step === "complete" && (
            <div className="space-y-6">
              <div className="flex flex-col items-center rounded-2xl border border-primary/20 bg-primary-light/10 px-6 py-8 text-center">
                <CheckCircle2 className="mb-4 h-14 w-14 text-primary" />

                <h2 className="text-lg font-bold text-foreground">
                  You're all set
                </h2>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Your password has been changed. Sign in with your new
                  password to continue to your organizer account.
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/login")}
                className="
                  flex h-14 w-full items-center justify-center
                  rounded-2xl bg-primary px-6 text-[15px]
                  font-bold text-background transition
                  hover:bg-primary-light
                "
              >
                Return to Sign In
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="mt-10 border-t border-white/[0.06] pt-7 text-center">
            <p className="text-xs leading-6 text-muted">
              WOWYOU organizer
              <span className="mx-2 text-white/15">•</span>
              Manage events. Connect people. Create experiences.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
