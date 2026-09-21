"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  Eye,
  EyeOff,
  ArrowLeft,
  MailCheck,
} from "lucide-react";

import {
  loginUser,
  verifyLoginOtp,
  resendLoginOtp,
  resendVerificationEmail,
} from "@/services/auth";

type LoginStep =
  | "credentials"
  | "emailVerification"
  | "otp";

export default function LoginPage() {
  const router = useRouter();

  const [
    step,
    setStep,
  ] = useState<LoginStep>(
    "credentials",
  );

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    otp,
    setOtp,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    resendLoading,
    setResendLoading,
  ] = useState(false);

  const [
    resendCountdown,
    setResendCountdown,
  ] = useState(0);

  /*
  |--------------------------------------------------------------------------
  | Resend Countdown
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (resendCountdown <= 0) {
      return;
    }

    const timer =
      window.setInterval(() => {
        setResendCountdown(
          (current) =>
            current > 0
              ? current - 1
              : 0,
        );
      }, 1000);

    return () =>
      window.clearInterval(
        timer,
      );
  }, [resendCountdown]);

  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  */

  async function submit() {
    if (!email.trim()) {
      setError(
        "Please enter your email address.",
      );
      setSuccessMessage("");
      return;
    }

    if (!password) {
      setError(
        "Please enter your password.",
      );
      setSuccessMessage("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const data =
        await loginUser(
          email.trim(),
          password,
        );

      console.log(
        "LOGIN RESPONSE:",
        data,
      );

      if (!data.success) {
        setError(
          data.message ||
            "Login failed.",
        );
        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Email Verification Required
      |--------------------------------------------------------------------------
      |
      | This MUST happen before login OTP.
      |
      | An account that has not verified its
      | email must never enter the OTP flow.
      |
      */

      if (
        data.requiresEmailVerification
      ) {
        setStep(
          "emailVerification",
        );

        setOtp("");

        setResendCountdown(0);

        setSuccessMessage("");

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Login OTP Required
      |--------------------------------------------------------------------------
      |
      | This means the account has already
      | verified its email address.
      |
      */

      if (data.requiresOtp) {
        setStep("otp");

        setOtp("");

        setError("");

        setSuccessMessage("");

        setResendCountdown(60);

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Direct Login Fallback
      |--------------------------------------------------------------------------
      |
      | Keeps compatibility if the backend
      | ever returns a token directly.
      |
      */

      if (data.token) {
        localStorage.setItem(
          "token",
          data.token,
        );

        router.push(
          "/dashboard",
        );

        return;
      }

      setError(
        data.message ||
          "Login could not be completed.",
      );
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Resend Email Verification
  |--------------------------------------------------------------------------
  */

  async function handleResendVerificationEmail() {
    if (
      resendLoading ||
      resendCountdown > 0
    ) {
      return;
    }

    try {
      setResendLoading(true);
      setError("");
      setSuccessMessage("");

      const data =
        await resendVerificationEmail(
          email.trim(),
        );

      if (!data.success) {
        setError(
          data.message ||
            "Unable to resend verification email.",
        );

        return;
      }

      setResendCountdown(60);

      setSuccessMessage(
        "Verification email sent. Please check your inbox.",
      );
    } catch (error) {
      console.error(
        "RESEND VERIFICATION EMAIL ERROR:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to resend verification email.",
      );
    } finally {
      setResendLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Verify Login OTP
  |--------------------------------------------------------------------------
  */

  async function submitOtp() {
    const normalizedOtp =
      otp.replace(/\D/g, "");

    if (
      normalizedOtp.length !== 6
    ) {
      setError(
        "Enter the 6-digit verification code.",
      );

      setSuccessMessage("");

      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const data =
        await verifyLoginOtp({
          email:
            email.trim(),
          otp: normalizedOtp,
        });

      console.log(
        "OTP VERIFICATION RESPONSE:",
        data,
      );

      if (!data.success) {
        setError(
          data.message ||
            "Verification failed.",
        );

        return;
      }

      if (!data.token) {
        setError(
          "Login could not be completed.",
        );

        return;
      }

      localStorage.setItem(
        "token",
        data.token,
      );

      router.push(
        "/dashboard",
      );
    } catch (error) {
      console.error(
        "OTP VERIFICATION ERROR:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Verification failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Resend Login OTP
  |--------------------------------------------------------------------------
  */

  async function handleResendOtp() {
    if (
      resendLoading ||
      resendCountdown > 0
    ) {
      return;
    }

    try {
      setResendLoading(true);
      setError("");
      setSuccessMessage("");

      const data =
        await resendLoginOtp(
          email.trim(),
        );

      if (!data.success) {
        setError(
          data.message ||
            "Failed to resend verification code.",
        );

        return;
      }

      setOtp("");

      setResendCountdown(60);

      setSuccessMessage(
        "A new login code has been sent to your email.",
      );
    } catch (error) {
      console.error(
        "RESEND OTP ERROR:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to resend verification code.",
      );
    } finally {
      setResendLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Back To Login
  |--------------------------------------------------------------------------
  */

  function backToLogin() {
    setStep("credentials");

    setOtp("");

    setError("");

    setSuccessMessage("");

    setResendCountdown(0);
  }

  /*
  |--------------------------------------------------------------------------
  | Page
  |--------------------------------------------------------------------------
  */

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Cinematic background */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[-260px]
          h-[620px]
          w-[620px]
          -translate-x-1/2
          rounded-full
          bg-primary-light/12
          blur-[150px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-[-300px]
          right-[-200px]
          h-[600px]
          w-[600px]
          rounded-full
          bg-primary-light/8
          blur-[160px]
        "
      />

      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          items-center
          justify-center
          px-6
          py-12
        "
      >
        <div className="w-full max-w-[440px]">

          {/* Brand */}

          <div className="mb-12 text-center">
            <div
              className="
                mb-5
                inline-flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                border
                border-primary/20
                bg-primary-light/12
              "
            >
              <span className="text-xl font-black text-primary">
                W
              </span>
            </div>

            <div
              className="
                text-2xl
                font-black
                tracking-[0.28em]
                text-primary
              "
            >
              WOWYOU
            </div>

            <p
              className="
                mt-2
                text-[10px]
                font-semibold
                tracking-[0.32em]
                text-muted
              "
            >
              EVENT TECHNOLOGY
            </p>
          </div>

          {/* Heading */}

          <div className="mb-9">

            {(step === "otp" ||
              step ===
                "emailVerification") && (
              <button
                type="button"
                onClick={backToLogin}
                className="
                  mb-6
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-primary
                  transition
                  hover:text-primary-light
                "
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            )}

            <h1
              className="
                text-4xl
                font-bold
                tracking-tight
                text-foreground
              "
            >
              {step === "credentials"
                ? "Welcome Back"
                : step ===
                    "emailVerification"
                  ? "Verify your email"
                  : "Check your email"}
            </h1>

            <p
              className="
                mt-3
                text-[15px]
                leading-7
                text-text-secondary
              "
            >
              {step === "credentials"
                ? "Sign in to continue to your organizer dashboard."
                : step ===
                    "emailVerification"
                  ? `Your email address hasn't been verified yet. Please verify ${email} before signing in.`
                  : `We sent a 6-digit verification code to ${email}.`}
            </p>
          </div>

          {/* Error */}

          {error && (
            <div
              className="
                mb-6
                rounded-2xl
                border
                border-danger/20
                bg-danger/10
                px-4
                py-3.5
                text-sm
                text-danger
              "
            >
              {error}
            </div>
          )}

          {/* Success */}

          {successMessage && (
            <div
              className="
                mb-6
                rounded-2xl
                border
                border-primary/20
                bg-primary-light/10
                px-4
                py-3.5
                text-sm
                text-primary
              "
            >
              {successMessage}
            </div>
          )}

          {/* Credentials */}

          {step === "credentials" && (
            <div className="space-y-5">

              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="
                    mb-2.5
                    block
                    text-sm
                    font-medium
                    text-text-secondary
                  "
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="
                    h-14
                    w-full
                    rounded-2xl
                    border
                    border-white/[0.08]
                    bg-surface-elevated
                    px-5
                    text-[15px]
                    text-foreground
                    outline-none
                    transition
                    placeholder:text-muted
                    focus:border-primary/70
                    focus:ring-4
                    focus:ring-primary/10
                  "
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value,
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter"
                    ) {
                      submit();
                    }
                  }}
                />
              </div>

              {/* Password */}

              <div>
                <div
                  className="
                    mb-2.5
                    flex
                    items-center
                    justify-between
                  "
                >
                  <label
                    htmlFor="password"
                    className="
                      text-sm
                      font-medium
                      text-text-secondary
                    "
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="
                      text-xs
                      font-semibold
                      text-primary
                      transition
                      hover:text-primary-light
                    "
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    className="
                      h-14
                      w-full
                      rounded-2xl
                      border
                      border-white/[0.08]
                      bg-surface-elevated
                      px-5
                      pr-14
                      text-[15px]
                      text-foreground
                      outline-none
                      transition
                      placeholder:text-muted
                      focus:border-primary/70
                      focus:ring-4
                      focus:ring-primary/10
                    "
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value,
                      )
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter"
                      ) {
                        submit();
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current,
                      )
                    }
                    className="
                      absolute
                      right-4
                      top-1/2
                      flex
                      h-9
                      w-9
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-xl
                      text-muted
                      transition
                      hover:bg-white/[0.05]
                      hover:text-primary
                    "
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sign In */}

              <button
                type="button"
                onClick={submit}
                disabled={loading}
                className="
                  mt-2
                  flex
                  h-14
                  w-full
                  items-center
                  justify-center
                  rounded-2xl
                  bg-primary
                  px-6
                  text-[15px]
                  font-bold
                  text-background
                  transition
                  hover:bg-primary-light
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading
                  ? "Checking..."
                  : "Sign In"}
              </button>

              {/* Create Account */}

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/register",
                  )
                }
                className="
                  flex
                  h-14
                  w-full
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-primary/25
                  bg-primary/[0.05]
                  px-6
                  text-[15px]
                  font-bold
                  text-primary
                  transition
                  hover:border-primary/50
                  hover:bg-primary/[0.10]
                "
              >
                Create Account
              </button>
            </div>
          )}

          {/* Email Verification */}

          {step ===
            "emailVerification" && (
            <div className="space-y-5">

              <div
                className="
                  flex
                  flex-col
                  items-center
                  rounded-3xl
                  border
                  border-white/[0.06]
                  bg-surface-elevated
                  px-6
                  py-8
                  text-center
                "
              >
                <div
                  className="
                    mb-5
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-primary/20
                    bg-primary-light/10
                  "
                >
                  <MailCheck className="h-7 w-7 text-primary" />
                </div>

                <h2
                  className="
                    text-lg
                    font-bold
                    text-foreground
                  "
                >
                  Verify your email address
                </h2>

                <p
                  className="
                    mt-3
                    text-sm
                    leading-6
                    text-text-secondary
                  "
                >
                  We need you to verify your
                  email address before you can
                  sign in. Check your inbox for
                  the verification link.
                </p>
              </div>

              {/* Resend Verification */}

              <div
                className="
                  text-center
                  text-sm
                  text-text-secondary
                "
              >
                Didn't receive the email?

                <button
                  type="button"
                  onClick={
                    handleResendVerificationEmail
                  }
                  disabled={
                    resendLoading ||
                    resendCountdown > 0
                  }
                  className="
                    ml-1.5
                    font-semibold
                    text-primary
                    transition
                    hover:text-primary-light
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {resendLoading
                    ? "Sending..."
                    : resendCountdown >
                        0
                      ? `Resend in ${resendCountdown}s`
                      : "Resend verification email"}
                </button>
              </div>

              {/* Return */}

              <button
                type="button"
                onClick={
                  backToLogin
                }
                className="
                  flex
                  h-14
                  w-full
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-primary/25
                  bg-primary/[0.05]
                  px-6
                  text-[15px]
                  font-bold
                  text-primary
                  transition
                  hover:border-primary/50
                  hover:bg-primary/[0.10]
                "
              >
                Back to Sign In
              </button>
            </div>
          )}

          {/* OTP */}

          {step === "otp" && (
            <div className="space-y-5">

              <div>
                <label
                  htmlFor="otp"
                  className="
                    mb-2.5
                    block
                    text-sm
                    font-medium
                    text-text-secondary
                  "
                >
                  Verification Code
                </label>

                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  autoFocus
                  className="
                    h-16
                    w-full
                    rounded-2xl
                    border
                    border-white/[0.08]
                    bg-surface-elevated
                    px-5
                    text-center
                    text-2xl
                    font-bold
                    tracking-[0.45em]
                    text-foreground
                    outline-none
                    transition
                    placeholder:text-muted
                    focus:border-primary/70
                    focus:ring-4
                    focus:ring-primary/10
                  "
                  placeholder="000000"
                  value={otp}
                  onChange={(e) =>
                    setOtp(
                      e.target.value
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
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter"
                    ) {
                      submitOtp();
                    }
                  }}
                />
              </div>

              {/* Verify */}

              <button
                type="button"
                onClick={submitOtp}
                disabled={
                  loading ||
                  otp.length !== 6
                }
                className="
                  flex
                  h-14
                  w-full
                  items-center
                  justify-center
                  rounded-2xl
                  bg-primary
                  px-6
                  text-[15px]
                  font-bold
                  text-background
                  transition
                  hover:bg-primary-light
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading
                  ? "Verifying..."
                  : "Verify Code"}
              </button>

              {/* Resend OTP */}

              <div
                className="
                  text-center
                  text-sm
                  text-text-secondary
                "
              >
                Didn't receive the code?

                <button
                  type="button"
                  onClick={
                    handleResendOtp
                  }
                  disabled={
                    resendLoading ||
                    resendCountdown > 0
                  }
                  className="
                    ml-1.5
                    font-semibold
                    text-primary
                    transition
                    hover:text-primary-light
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {resendLoading
                    ? "Sending..."
                    : resendCountdown >
                        0
                      ? `Resend in ${resendCountdown}s`
                      : "Resend code"}
                </button>
              </div>

              {/* Change account */}

              <button
                type="button"
                onClick={
                  backToLogin
                }
                className="
                  flex
                  h-14
                  w-full
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-primary/25
                  bg-primary/[0.05]
                  px-6
                  text-[15px]
                  font-bold
                  text-primary
                  transition
                  hover:border-primary/50
                  hover:bg-primary/[0.10]
                "
              >
                Use another account
              </button>
            </div>
          )}

          {/* Footer */}

          <div
            className="
              mt-10
              border-t
              border-white/[0.06]
              pt-7
              text-center
            "
          >
            <p
              className="
                text-xs
                leading-6
                text-muted
              "
            >
              WOWYOU organizer
              <span className="mx-2 text-white/15">
                •
              </span>
              Manage events. Connect people. Create experiences.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}