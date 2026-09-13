"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { registerUser } from "@/services/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    try {
      setLoading(true);
      setError("");

      const data = await registerUser({
        ...form,
        role: "organizer",
      });

      console.log("REGISTER RESPONSE:", data);

      if (!data.success) {
        setError(data.message || "Registration failed");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);

        localStorage.setItem(
          "userFullName",
          `${data.user.firstName} ${data.user.lastName}`,
        );

        localStorage.setItem(
          "userEmail",
          data.user.email,
        );

        router.push("/legal/accept");
      }
    } catch (err) {
      console.error(err);

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
          <div className="mb-10 text-center">
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
          <div className="mb-8">
            <h1
              className="
                text-4xl
                font-bold
                tracking-tight
                text-foreground
              "
            >
              Create Account
            </h1>

            <p
              className="
                mt-3
                text-[15px]
                leading-7
                text-text-secondary
              "
            >
              Create your organizer account and start building
              unforgettable event experiences.
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
            {/* Name row */}
            <div
              className="
                grid
                grid-cols-1
                gap-5
                sm:grid-cols-2
              "
            >
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="
                    mb-2.5
                    block
                    text-sm
                    font-medium
                    text-text-secondary
                  "
                >
                  First Name
                </label>

                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
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
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      firstName: e.target.value,
                    })
                  }
                />
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="
                    mb-2.5
                    block
                    text-sm
                    font-medium
                    text-text-secondary
                  "
                >
                  Last Name
                </label>

                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
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
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      lastName: e.target.value,
                    })
                  }
                />
              </div>
            </div>

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
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="
                  mb-2.5
                  block
                  text-sm
                  font-medium
                  text-text-secondary
                "
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
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
                  placeholder="Create a password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
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

            {/* Submit */}
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
                ? "Creating account..."
                : "Create Account"}
            </button>
          </div>

          {/* Sign in */}
          <div
            className="
              mt-8
              text-center
              text-sm
              text-text-secondary
            "
          >
            Already have an account?{" "}

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="
                font-semibold
                text-primary
                transition
                hover:text-primary-light
              "
            >
              Sign In
            </button>
          </div>

          {/* Footer */}
          <div
            className="
              mt-8
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
              Create events. Build connections. Shape experiences.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}