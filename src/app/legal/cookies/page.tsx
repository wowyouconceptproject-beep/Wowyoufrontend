"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { acceptCookieConsent } from "@/services/legal";

const categories = [
  {
    key: "analytics",
    title: "Performance & Analytics",
    description:
      "Helps us understand how EventOS is used, identify errors and improve platform performance.",
  },
  {
    key: "functional",
    title: "Functional & Personalisation",
    description:
      "Enables preferences, personalised experiences and functionality that improves your use of the platform.",
  },
  {
    key: "aiPersonalisation",
    title: "AI Personalisation",
    description:
      "Supports optional AI-assisted personalisation and recommendations.",
  },
  {
    key: "marketing",
    title: "Marketing & Advertising",
    description:
      "Allows marketing and advertising technologies to measure campaigns and provide relevant communications.",
  },
];

export default function CookieConsentPage() {
  const router = useRouter();

  const [preferences, setPreferences] =
    useState({
      analytics: false,
      functional: false,
      aiPersonalisation: false,
      marketing: false,
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  function updatePreference(
    key: keyof typeof preferences,
  ) {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  async function saveConsent(
    status:
      | "ACCEPTED_ALL"
      | "REJECTED_NON_ESSENTIAL"
      | "CUSTOMISED",
    cookieCategories: typeof preferences,
  ) {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      const userId =
        localStorage.getItem("userId");

      const userFullName =
        localStorage.getItem(
          "userFullName",
        );

      const userEmail =
        localStorage.getItem(
          "userEmail",
        );

      const data =
        await acceptCookieConsent({
          userId:
            userId ?? undefined,

          fullName:
            userFullName ?? undefined,

          email:
            userEmail ?? undefined,

          role: "organizer",

          consentSource:
            "organizer_WEB",

          cookieCategories,

          consentStatus: status,
        });

      if (!data.success) {
        throw new Error(
          data.message ??
            "Unable to save cookie preferences.",
        );
      }

      router.replace("/dashboard");
    } catch (err) {
      console.error(
        "Cookie consent error:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save cookie preferences.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleAcceptAll() {
    const allAccepted = {
      analytics: true,
      functional: true,
      aiPersonalisation: true,
      marketing: true,
    };

    saveConsent(
      "ACCEPTED_ALL",
      allAccepted,
    );
  }

  function handleRejectNonEssential() {
    const rejected = {
      analytics: false,
      functional: false,
      aiPersonalisation: false,
      marketing: false,
    };

    saveConsent(
      "REJECTED_NON_ESSENTIAL",
      rejected,
    );
  }

  function handleSavePreferences() {
    saveConsent(
      "CUSTOMISED",
      preferences,
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-4xl px-6 py-12 md:px-10 md:py-20">
        {/* Header */}

        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#53A6C7]">
            WoWYou EventTech
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            Cookie preferences
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/55">
            Choose which optional cookies and
            similar technologies you allow
            WoWYou EventTech to use. Strictly
            necessary cookies are always active
            because they are required for the
            platform to function.
          </p>
        </div>

        {/* Always active */}

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 className="font-semibold">
                Strictly Necessary
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/45">
                Required for authentication,
                security, session management and
                core EventOS functionality.
              </p>
            </div>

            <span className="shrink-0 rounded-full border border-[#14B8A6]/20 bg-[#14B8A6]/10 px-3 py-1 text-xs font-semibold text-[#14B8A6]">
              Always Active
            </span>
          </div>
        </div>

        {/* Optional categories */}

        <div className="mt-4 space-y-3">
          {categories.map(
            (category) => (
              <div
                key={category.key}
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.02]
                  p-5
                "
              >
                <div className="flex items-start gap-5">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={
                      preferences[
                        category.key as keyof typeof preferences
                      ]
                    }
                    onClick={() =>
                      updatePreference(
                        category.key as keyof typeof preferences,
                      )
                    }
                    className={`
                      relative
                      mt-1
                      h-6
                      w-11
                      shrink-0
                      rounded-full
                      transition
                      ${
                        preferences[
                          category.key as keyof typeof preferences
                        ]
                          ? "bg-[#3E86A4]"
                          : "bg-white/15"
                      }
                    `}
                  >
                    <span
                      className={`
                        absolute
                        top-1
                        h-4
                        w-4
                        rounded-full
                        bg-white
                        transition
                        ${
                          preferences[
                            category.key as keyof typeof preferences
                          ]
                            ? "left-6"
                            : "left-1"
                        }
                      `}
                    />
                  </button>

                  <div>
                    <h2 className="font-semibold">
                      {category.title}
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-white/45">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>

        {/* Error */}

        {error && (
          <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm leading-6 text-red-300">
            {error}
          </div>
        )}

        {/* Actions */}

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            disabled={loading}
            onClick={
              handleRejectNonEssential
            }
            className="
              h-14
              rounded-2xl
              border
              border-white/15
              bg-white/[0.03]
              px-5
              text-sm
              font-semibold
              text-white
              transition
              hover:border-white/30
              hover:bg-white/[0.06]
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            Reject Non-Essential
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={
              handleSavePreferences
            }
            className="
              h-14
              rounded-2xl
              border
              border-white/15
              bg-white/[0.03]
              px-5
              text-sm
              font-semibold
              text-white
              transition
              hover:border-white/30
              hover:bg-white/[0.06]
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            Save Preferences
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleAcceptAll}
            className="
              h-14
              rounded-2xl
              bg-[#3E86A4]
              px-5
              text-sm
              font-bold
              text-white
              transition
              hover:bg-[#1F7197]
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            Accept All
          </button>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-white/30">
          You can change your cookie
          preferences later through the
          platform&apos;s cookie settings.
        </p>
      </div>
    </main>
  );
}