"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { registerUser } from "@/services/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function submit() {
    try {
      setLoading(true);
      setError("");

      const data = await registerUser({
  ...form,
  role: "ORGANIZER",
});

console.log(
  "REGISTER RESPONSE:",
  data,
);

if (!data.success) {
  setError(
    data.message ||
      "Registration failed",
  );

  return;
}

if (data.token) {
  localStorage.setItem(
    "token",
    data.token,
  );

  localStorage.setItem(
    "userFullName",
    `${data.user.firstName} ${data.user.lastName}`,
  );

  localStorage.setItem(
    "userEmail",
    data.user.email,
  );

  router.push(
    "/legal/accept",
  );
}
    } catch (err) {
      console.error(err);

      setError(
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
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
          bg-[#53A6C7]/12
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
          bg-[#53A6C7]/8
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
                border-[#3E86A4]/20
                bg-[#53A6C7]/12
              "
            >
              <span
                className="
                  text-xl
                  font-black
                  text-[#3E86A4]
                "
              >
                W
              </span>
            </div>

            <div
              className="
                text-2xl
                font-black
                tracking-[0.28em]
                text-[#3E86A4]
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
                text-white/35
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
                text-white
              "
            >
              Create Account
            </h1>

            <p
              className="
                mt-3
                text-[15px]
                leading-7
                text-white/50
              "
            >
              Create your organizer account
              and start building unforgettable
              event experiences.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="
                mb-6
                rounded-2xl
                border
                border-red-500/20
                bg-red-500/10
                px-4
                py-3.5
                text-sm
                text-red-300
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
              <div>
                <label
                  className="
                    mb-2.5
                    block
                    text-sm
                    font-medium
                    text-white/70
                  "
                >
                  First Name
                </label>

                <input
                  className="
                    h-14
                    w-full
                    rounded-2xl
                    border
                    border-white/[0.08]
                    bg-[#151515]
                    px-5
                    text-[15px]
                    text-white
                    outline-none
                    transition
                    placeholder:text-white/25
                    focus:border-[#3E86A4]/70
                    focus:ring-4
                    focus:ring-[#3E86A4]/10
                  "
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      firstName:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label
                  className="
                    mb-2.5
                    block
                    text-sm
                    font-medium
                    text-white/70
                  "
                >
                  Last Name
                </label>

                <input
                  className="
                    h-14
                    w-full
                    rounded-2xl
                    border
                    border-white/[0.08]
                    bg-[#151515]
                    px-5
                    text-[15px]
                    text-white
                    outline-none
                    transition
                    placeholder:text-white/25
                    focus:border-[#3E86A4]/70
                    focus:ring-4
                    focus:ring-[#3E86A4]/10
                  "
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      lastName:
                        e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                className="
                  mb-2.5
                  block
                  text-sm
                  font-medium
                  text-white/70
                "
              >
                Email
              </label>

              <input
                type="email"
                autoComplete="email"
                className="
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-white/[0.08]
                  bg-[#151515]
                  px-5
                  text-[15px]
                  text-white
                  outline-none
                  transition
                  placeholder:text-white/25
                  focus:border-[#3E86A4]/70
                  focus:ring-4
                  focus:ring-[#3E86A4]/10
                "
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email:
                      e.target.value,
                  })
                }
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="
                  mb-2.5
                  block
                  text-sm
                  font-medium
                  text-white/70
                "
              >
                Password
              </label>

              <input
                type="password"
                autoComplete="new-password"
                className="
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-white/[0.08]
                  bg-[#151515]
                  px-5
                  text-[15px]
                  text-white
                  outline-none
                  transition
                  placeholder:text-white/25
                  focus:border-[#3E86A4]/70
                  focus:ring-4
                  focus:ring-[#3E86A4]/10
                "
                placeholder="Create a password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password:
                      e.target.value,
                  })
                }
              />
            </div>

            {/* Submit */}
            <button
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
                bg-[#3E86A4]
                px-6
                text-[15px]
                font-bold
                text-white
                transition
                hover:bg-[#1F7197]
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
              text-white/45
            "
          >
            Already have an account?{" "}
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/login"
                )
              }
              className="
                font-semibold
                text-[#3E86A4]
                transition
                hover:text-[#53A6C7]
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
                text-white/30
              "
            >
              WOWYOU Organizer
              <span className="mx-2 text-white/15">
                •
              </span>
              Create events. Build connections.
              Shape experiences.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}