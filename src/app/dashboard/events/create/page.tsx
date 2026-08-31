"use client";

import {
  ChangeEvent,
  useRef,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  createEvent,
} from "@/services/event";

import DateTimePicker from "@/components/ui/date-time-picker";

const categories = [
  "BUSINESS",
  "TECHNOLOGY",
  "MUSIC",
  "SPORTS",
  "FASHION",
  "FOOD",
  "ENTERTAINMENT",
  "EDUCATION",
  "COMMUNITY",
  "OTHER",
];

const currencies = [
  {
    value: "USD",
    label: "USD ($)",
  },
  {
    value: "EUR",
    label: "EUR (€)",
  },
  {
    value: "GBP",
    label: "GBP (£)",
  },
  {
    value: "NGN",
    label: "NGN (₦)",
  },
  {
    value: "KES",
    label: "KES",
  },
  {
    value: "ZAR",
    label: "ZAR",
  },
];

export default function CreateEventPage() {
  const router = useRouter();

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [
    coverFile,
    setCoverFile,
  ] = useState<File | null>(null);

  const [
    coverPreview,
    setCoverPreview,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",

    category: "",

    venue: "",
    venueAddress: "",
    city: "",
    country: "",

    /*
     * Map coordinates are intentionally kept in the
     * event payload for future Google Maps integration.
     *
     * They are NOT required for V1 event creation.
     */
    venueLatitude: undefined as
      | number
      | undefined,

    venueLongitude: undefined as
      | number
      | undefined,

    capacity: 100,
    currency: "USD",

    startDate: "",
    endDate: "",

    isPublic: true,
  });

  function updateField(
    field: string,
    value:
      | string
      | number
      | boolean
      | undefined,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function selectCover(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type,
      )
    ) {
      setError(
        "Please select a JPG, PNG or WEBP image.",
      );

      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      setError(
        "Cover image must be smaller than 10 MB.",
      );

      return;
    }

    setError("");

    setCoverFile(file);

    const preview =
      URL.createObjectURL(file);

    setCoverPreview(preview);
  }

  async function uploadCover(
    token: string,
  ) {
    if (!coverFile) {
      return null;
    }

    const body =
      new FormData();

    body.append(
      "image",
      coverFile,
    );

    const baseUrl =
      process.env
        .NEXT_PUBLIC_API_URL;

    if (!baseUrl) {
      throw new Error(
        "API URL is not configured.",
      );
    }

    const response =
      await fetch(
        `${baseUrl}/media/event-cover`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          body,
        },
      );

    const result =
      await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
          "Unable to upload event cover.",
      );
    }

    return (
      result.image?.url ??
      null
    );
  }

  async function submit() {
    if (loading) {
      return;
    }

    setError("");

    if (
      !form.title.trim()
    ) {
      setError(
        "Event title is required.",
      );

      return;
    }

    if (
      !form.description.trim()
    ) {
      setError(
        "Event description is required.",
      );

      return;
    }

    /*
     * Venue is now manually entered.
     *
     * Google Maps / coordinates are NOT required
     * for V1 event creation.
     */

    if (
      !form.venue.trim()
    ) {
      setError(
        "Venue is required.",
      );

      return;
    }

    if (
      !form.venueAddress.trim()
    ) {
      setError(
        "Venue address is required.",
      );

      return;
    }

    if (
      !form.city.trim()
    ) {
      setError(
        "City is required.",
      );

      return;
    }

    if (
      !form.country.trim()
    ) {
      setError(
        "Country is required.",
      );

      return;
    }

    if (
      !form.startDate ||
      !form.endDate
    ) {
      setError(
        "Start and end dates are required.",
      );

      return;
    }

    if (
      new Date(
        form.endDate,
      ) <=
      new Date(
        form.startDate,
      )
    ) {
      setError(
        "End date must be after the start date.",
      );

      return;
    }

    if (
      form.capacity < 1
    ) {
      setError(
        "Capacity must be at least 1.",
      );

      return;
    }

    const token =
      localStorage.getItem(
        "token",
      );

    if (!token) {
      setError(
        "Your session has expired. Please sign in again.",
      );

      return;
    }

    try {
      setLoading(true);

      /*
       * Upload cover first.
       */

      const coverImage =
        await uploadCover(
          token,
        );

      /*
       * Create event.
       *
       * Coordinates remain part of the payload
       * if they exist, but are no longer required.
       */

      const result =
        await createEvent({
          ...form,

          title:
            form.title.trim(),

          description:
            form.description.trim(),

          venue:
            form.venue.trim(),

          venueAddress:
            form.venueAddress.trim(),

          city:
            form.city.trim(),

          country:
            form.country.trim(),

          category:
            form.category ||
            undefined,

          coverImage:
            coverImage ||
            undefined,
        });

      if (!result.success) {
        throw new Error(
          result.message ||
            "Unable to create event.",
        );
      }

      /*
       * Send organizer directly
       * into the newly created
       * Event Control Center.
       */

      if (
        result.event?.id
      ) {
        router.push(
          `/dashboard/events/${result.event.id}`,
        );

        return;
      }

      router.push(
        "/dashboard",
      );
    } catch (err) {
      console.error(
        "CREATE EVENT ERROR:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create event.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070707] text-white">

      <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-10 md:py-14">

        {/* ============================================================ */}
        {/* HEADER */}
        {/* ============================================================ */}

        <div className="mb-12 max-w-3xl">

          <div className="mb-5 flex items-center gap-3">

            <div className="h-px w-10 bg-[#3E86A4]" />

            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#3E86A4]">
              Event Creation
            </p>

          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Create your event
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/50">
            Build the foundation of your
            event. Tickets, staff, vendors,
            activities and attendee
            experiences can be configured
            afterwards.
          </p>

        </div>

        <div className="space-y-8">

          {/* ============================================================ */}
          {/* EVENT IDENTITY */}
          {/* ============================================================ */}

          <section className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035]">

            <div className="border-b border-white/10 px-6 py-6 md:px-8">

              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#3E86A4]">
                01 · Event Identity
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Make it recognizable
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/45">
                This information appears
                across discovery, event
                details and the attendee
                experience.
              </p>

            </div>

            <div className="p-6 md:p-8">

              {/* Cover */}

              <div>

                <label className="mb-3 block text-sm font-medium text-white/80">
                  Event Cover
                </label>

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="group relative flex aspect-[16/7] w-full overflow-hidden rounded-2xl border border-dashed border-white/15 bg-black/30 transition hover:border-[#3E86A4]/60"
                >

                  {coverPreview ? (
                    <>
                      <img
                        src={coverPreview}
                        alt="Event cover preview"
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/50">

                        <span className="translate-y-2 rounded-full border border-white/20 bg-black/60 px-5 py-2 text-sm font-medium opacity-0 backdrop-blur transition group-hover:translate-y-0 group-hover:opacity-100">
                          Change cover
                        </span>

                      </div>
                    </>
                  ) : (
                    <div className="m-auto flex flex-col items-center px-6 text-center">

                      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#53A6C7]/12 text-2xl text-[#3E86A4]">
                        +
                      </div>

                      <p className="font-semibold">
                        Upload event artwork
                      </p>

                      <p className="mt-2 text-sm text-white/40">
                        JPG, PNG or WEBP ·
                        Maximum 10 MB
                      </p>

                      <p className="mt-1 text-xs text-white/25">
                        Landscape artwork
                        recommended
                      </p>

                    </div>
                  )}

                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={selectCover}
                  className="hidden"
                />

              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">

                <Field
                  label="Event Name"
                  className="md:col-span-2"
                >
                  <input
                    value={form.title}
                    onChange={(e) =>
                      updateField(
                        "title",
                        e.target.value,
                      )
                    }
                    placeholder="e.g. Lagos Tech Summit 2026"
                    className={inputClass}
                  />
                </Field>

                <Field label="Category">

                  <select
                    value={form.category}
                    onChange={(e) =>
                      updateField(
                        "category",
                        e.target.value,
                      )
                    }
                    className={inputClass}
                  >

                    <option
                      value=""
                      className="bg-[#111]"
                    >
                      Select category
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                          className="bg-[#111]"
                        >
                          {formatCategory(
                            category,
                          )}
                        </option>
                      ),
                    )}

                  </select>

                </Field>

                <div />

                <Field
                  label="Description"
                  className="md:col-span-2"
                >

                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      updateField(
                        "description",
                        e.target.value,
                      )
                    }
                    rows={6}
                    placeholder="Tell attendees what this event is about and why they should attend."
                    className={`${inputClass} resize-none`}
                  />

                </Field>

              </div>

            </div>

          </section>

          {/* ============================================================ */}
          {/* LOCATION + TIME */}
          {/* ============================================================ */}

          <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 md:p-8">

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#3E86A4]">
              02 · Place & Time
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Where and when
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
              Enter the event venue manually.
              Location maps will be available
              in a future update.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

              {/* Venue */}

              <Field
                label="Venue"
                className="md:col-span-2"
              >

                <input
                  value={form.venue}
                  onChange={(e) =>
                    updateField(
                      "venue",
                      e.target.value,
                    )
                  }
                  placeholder="e.g. Dublin Royal Convention Centre"
                  className={inputClass}
                />

              </Field>

              {/* Address */}

              <Field
                label="Venue Address"
                className="md:col-span-2"
              >

                <input
                  value={form.venueAddress}
                  onChange={(e) =>
                    updateField(
                      "venueAddress",
                      e.target.value,
                    )
                  }
                  placeholder="e.g. 15 Convention Centre Road"
                  className={inputClass}
                />

              </Field>

              {/* City */}

              <Field label="City">

                <input
                  value={form.city}
                  onChange={(e) =>
                    updateField(
                      "city",
                      e.target.value,
                    )
                  }
                  placeholder="Dublin"
                  className={inputClass}
                />

              </Field>

              {/* Country */}

              <Field label="Country">

                <input
                  value={form.country}
                  onChange={(e) =>
                    updateField(
                      "country",
                      e.target.value,
                    )
                  }
                  placeholder="Ireland"
                  className={inputClass}
                />

              </Field>

              {/* Starts */}

              <DateTimePicker
                label="Starts"
                value={form.startDate}
                onChange={(value) =>
                  updateField(
                    "startDate",
                    value,
                  )
                }
              />

              {/* Ends */}

              <DateTimePicker
                label="Ends"
                value={form.endDate}
                onChange={(value) =>
                  updateField(
                    "endDate",
                    value,
                  )
                }
              />

            </div>

          </section>

          {/* ============================================================ */}
          {/* CONFIGURATION */}
          {/* ============================================================ */}

          <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 md:p-8">

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#3E86A4]">
              03 · Configuration
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Event setup
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <Field label="Capacity">

                <input
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(e) =>
                    updateField(
                      "capacity",
                      Number(
                        e.target.value,
                      ),
                    )
                  }
                  className={inputClass}
                />

              </Field>

              <Field label="Currency">

                <select
                  value={form.currency}
                  onChange={(e) =>
                    updateField(
                      "currency",
                      e.target.value,
                    )
                  }
                  className={inputClass}
                >

                  {currencies.map(
                    (currency) => (
                      <option
                        key={currency.value}
                        value={currency.value}
                        className="bg-[#111]"
                      >
                        {currency.label}
                      </option>
                    ),
                  )}

                </select>

              </Field>

            </div>

            {/* Visibility */}

            <div className="mt-8 border-t border-white/10 pt-8">

              <p className="mb-4 text-sm font-medium text-white/80">
                Event Visibility
              </p>

              <div className="grid gap-4 md:grid-cols-2">

                <VisibilityOption
                  active={form.isPublic}
                  title="Public Event"
                  description="Anyone can discover this event on WOWYOU."
                  onClick={() =>
                    updateField(
                      "isPublic",
                      true,
                    )
                  }
                />

                <VisibilityOption
                  active={!form.isPublic}
                  title="Private Event"
                  description="The event won't appear in public discovery."
                  onClick={() =>
                    updateField(
                      "isPublic",
                      false,
                    )
                  }
                />

              </div>

            </div>

          </section>

          {/* ============================================================ */}
          {/* ERROR */}
          {/* ============================================================ */}

          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.07] px-5 py-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* ============================================================ */}
          {/* SUBMIT */}
          {/* ============================================================ */}

          <div className="flex flex-col gap-6 rounded-[28px] border border-white/10 bg-white/[0.035] p-6 md:flex-row md:items-center md:justify-between md:p-8">

            <div className="max-w-xl">

              <p className="font-semibold">
                Ready to build your
                event?
              </p>

              <p className="mt-2 text-sm leading-6 text-white/45">
                Your event will begin
                as a draft. After
                creation you can
                configure tickets,
                staff, vendors,
                activities and the
                attendee experience.
              </p>

            </div>

            <button
              type="button"
              disabled={loading}
              onClick={submit}
              className="min-w-[190px] rounded-2xl bg-[#3E86A4] px-7 py-4 font-bold text-white transition hover:bg-[#1F7197] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Creating Event..."
                : "Create Event"}
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}

/*
|--------------------------------------------------------------------------
| UI Helpers
|--------------------------------------------------------------------------
*/

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#3E86A4]/60 focus:ring-1 focus:ring-[#3E86A4]/20";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>

      <label className="mb-2 block text-sm font-medium text-white/70">
        {label}
      </label>

      {children}

    </div>
  );
}

function VisibilityOption({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-4 rounded-2xl border p-5 text-left transition ${
        active
          ? "border-[#3E86A4]/60 bg-[#3E86A4]/[0.08]"
          : "border-white/10 bg-black/20 hover:border-white/20"
      }`}
    >

      <span
        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
          active
            ? "border-[#3E86A4]"
            : "border-white/30"
        }`}
      >

        {active && (
          <span className="h-2.5 w-2.5 rounded-full bg-[#3E86A4]" />
        )}

      </span>

      <span>

        <span className="block font-semibold">
          {title}
        </span>

        <span className="mt-1 block text-sm leading-6 text-white/40">
          {description}
        </span>

      </span>

    </button>
  );
}

function formatCategory(
  category: string,
) {
  return category
    .toLowerCase()
    .replace(
      /(^|\s)\S/g,
      (letter) =>
        letter.toUpperCase(),
    );
}