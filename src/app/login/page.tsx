"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { loginUser } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    try {
      setLoading(true);
      setError("");

      const data = await loginUser(email, password);

      console.log("LOGIN RESPONSE:", data);

      if (!data.success) {
        setError(data.message || "Login failed");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

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
            <h1
              className="
                text-4xl
                font-bold
                tracking-tight
                text-foreground
              "
            >
              Welcome Back
            </h1>

            <p
              className="
                mt-3
                text-[15px]
                leading-7
                text-text-secondary
              "
            >
              Sign in to continue to your organizer dashboard.
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

          {/* Form */}
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
                onChange={(e) => setEmail(e.target.value)}
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

              {/* Password input with visibility toggle */}
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
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
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
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
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {/* Create Account */}
            <button
              type="button"
              onClick={() => router.push("/register")}
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