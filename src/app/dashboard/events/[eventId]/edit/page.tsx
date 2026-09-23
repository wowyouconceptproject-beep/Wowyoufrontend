"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  EventPayload,
  getEvent,
  updateEvent,
} from "@/services/event";

const CATEGORIES = [
  "Conference",
  "Concert",
  "Festival",
  "Workshop",
  "Networking",
  "Business",
  "Technology",
  "Fashion",
  "Sports",
  "Food & Drink",
  "Arts & Culture",
  "Other",
];

const CURRENCIES = [
  "USD",
  "GBP",
  "EUR",
  "NGN",
];

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();

  const eventId = String(params.eventId);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState<EventPayload>({
    title: "",
    description: "",
    venue: "",
    venueAddress: "",
    city: "",
    country: "",
    venueLatitude: undefined,
    venueLongitude: undefined,
    startDate: "",
    endDate: "",
    capacity: 1,
    currency: "USD",
    isPublic: true,
    coverImage: "",
    featuredImage: "",
    category: "",
    vendorApplicationsOpen: false,
    vendorApplicationDeadline: "",
    maxVendorSlots: undefined,
  });

  /*
  |--------------------------------------------------------------------------
  | Load Event
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        setError("");

        const response = await getEvent(eventId);

        if (!response.success || !response.event) {
          throw new Error(
            response.message || "Unable to load event.",
          );
        }

        const event = response.event;

        setForm({
          title: event.title || "",
          description: event.description || "",

          venue: event.venue || "",
          venueAddress: event.venueAddress || "",
          city: event.city || "",
          country: event.country || "",

          venueLatitude:
            event.venueLatitude !== undefined
              ? Number(event.venueLatitude)
              : undefined,

          venueLongitude:
            event.venueLongitude !== undefined
              ? Number(event.venueLongitude)
              : undefined,

          startDate: formatDateTimeLocal(event.startDate),
          endDate: formatDateTimeLocal(event.endDate),

          capacity: Number(event.capacity || 1),
          currency: event.currency || "USD",

          isPublic:
            event.isPublic !== undefined
              ? event.isPublic
              : true,

          coverImage: event.coverImage || "",
          featuredImage: event.featuredImage || "",

          category: event.category || "",

          vendorApplicationsOpen:
            event.vendorApplicationsOpen || false,

          vendorApplicationDeadline:
            event.vendorApplicationDeadline
              ? formatDateTimeLocal(
                  event.vendorApplicationDeadline,
                )
              : "",

          maxVendorSlots:
            event.maxVendorSlots !== undefined
              ? Number(event.maxVendorSlots)
              : undefined,
        });
      } catch (err: any) {
        setError(
          err?.message ||
            "Something went wrong while loading the event.",
        );
      } finally {
        setLoading(false);
      }
    }

    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  function formatDateTimeLocal(
    value?: string | null,
  ) {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1,
    ).padStart(2, "0");
    const day = String(
      date.getDate(),
    ).padStart(2, "0");
    const hours = String(
      date.getHours(),
    ).padStart(2, "0");
    const minutes = String(
      date.getMinutes(),
    ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  function updateField<
    K extends keyof EventPayload,
  >(
    field: K,
    value: EventPayload[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Event title is required.");
      return;
    }

    if (!form.description?.trim()) {
      setError("Event description is required.");
      return;
    }

    if (!form.venue.trim()) {
      setError("Venue is required.");
      return;
    }

    if (!form.startDate) {
      setError("Start date and time are required.");
      return;
    }

    if (!form.endDate) {
      setError("End date and time are required.");
      return;
    }

    const start = new Date(form.startDate);
    const end = new Date(form.endDate);

    if (Number.isNaN(start.getTime())) {
      setError("Please enter a valid start date.");
      return;
    }

    if (Number.isNaN(end.getTime())) {
      setError("Please enter a valid end date.");
      return;
    }

    if (end <= start) {
      setError(
        "The event end time must be after the start time.",
      );
      return;
    }

    if (
      !Number.isFinite(Number(form.capacity)) ||
      Number(form.capacity) < 1
    ) {
      setError(
        "Event capacity must be at least 1.",
      );
      return;
    }

    if (
      form.vendorApplicationsOpen &&
      form.maxVendorSlots !== undefined &&
      form.maxVendorSlots !== null &&
      Number(form.maxVendorSlots) < 1
    ) {
      setError(
        "Maximum vendor slots must be at least 1.",
      );
      return;
    }

    try {
      setSaving(true);

      const payload: Partial<EventPayload> = {
        title: form.title.trim(),

        description:
          form.description?.trim() || "",

        venue: form.venue.trim(),

        venueAddress:
          form.venueAddress?.trim() || undefined,

        city:
          form.city?.trim() || undefined,

        country:
          form.country?.trim() || undefined,

        venueLatitude:
          form.venueLatitude !== undefined &&
          form.venueLatitude !== null &&
          String(form.venueLatitude) !== ""
            ? Number(form.venueLatitude)
            : undefined,

        venueLongitude:
          form.venueLongitude !== undefined &&
          form.venueLongitude !== null &&
          String(form.venueLongitude) !== ""
            ? Number(form.venueLongitude)
            : undefined,

        startDate: new Date(
          form.startDate,
        ).toISOString(),

        endDate: new Date(
          form.endDate,
        ).toISOString(),

        capacity: Number(form.capacity),

        currency: form.currency,

        isPublic: form.isPublic,

        coverImage:
          form.coverImage?.trim() || undefined,

        featuredImage:
          form.featuredImage?.trim() || undefined,

        category:
          form.category?.trim() || undefined,

        vendorApplicationsOpen:
          form.vendorApplicationsOpen,

        vendorApplicationDeadline:
          form.vendorApplicationDeadline
            ? new Date(
                form.vendorApplicationDeadline,
              ).toISOString()
            : undefined,

        maxVendorSlots:
          form.maxVendorSlots !== undefined &&
          form.maxVendorSlots !== null &&
          String(form.maxVendorSlots) !== ""
            ? Number(form.maxVendorSlots)
            : undefined,
      };

      const response = await updateEvent(
        eventId,
        payload,
      );

      if (!response.success) {
        throw new Error(
          response.message ||
            "Unable to update event.",
        );
      }

      setSuccess("Event updated successfully.");

      setTimeout(() => {
        router.push(
          `/dashboard/events/${eventId}`,
        );
      }, 700);
    } catch (err: any) {
      setError(
        err?.message ||
          "Something went wrong while updating the event.",
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-56 rounded-xl bg-white/10" />

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <div className="space-y-6">
                <div className="h-14 rounded-xl bg-white/5" />
                <div className="h-32 rounded-xl bg-white/5" />
                <div className="h-14 rounded-xl bg-white/5" />
                <div className="h-14 rounded-xl bg-white/5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Page
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/events/${eventId}`,
                )
              }
              className="mb-4 text-sm font-medium text-white/50 transition hover:text-white"
            >
              ← Back to Event
            </button>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Edit Event
            </h1>

            <p className="mt-2 text-sm text-white/50">
              Update your event information and
              configuration.
            </p>
          </div>
        </div>

        {/* Messages */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-300">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Basic Information */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="mb-7">
              <h2 className="text-xl font-semibold">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-white/40">
                The core information attendees will
                see about your event.
              </p>
            </div>

            <div className="space-y-6">
              <Field
                label="Event Title"
                required
              >
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    updateField(
                      "title",
                      e.target.value,
                    )
                  }
                  placeholder="Enter event title"
                  className={inputClass}
                />
              </Field>

              <Field
                label="Description"
                required
              >
                <textarea
                  value={form.description || ""}
                  onChange={(e) =>
                    updateField(
                      "description",
                      e.target.value,
                    )
                  }
                  placeholder="Tell people what your event is about..."
                  rows={6}
                  className={`${inputClass} resize-none`}
                />
              </Field>

              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Category">
                  <select
                    value={form.category || ""}
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

                    {CATEGORIES.map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                          className="bg-[#111]"
                        >
                          {category}
                        </option>
                      ),
                    )}
                  </select>
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
                    {CURRENCIES.map(
                      (currency) => (
                        <option
                          key={currency}
                          value={currency}
                          className="bg-[#111]"
                        >
                          {currency}
                        </option>
                      ),
                    )}
                  </select>
                </Field>
              </div>
            </div>
          </section>

          {/* Date & Time */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="mb-7">
              <h2 className="text-xl font-semibold">
                Date & Time
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Set when your event starts and ends.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Field
                label="Start Date & Time"
                required
              >
                <input
                  type="datetime-local"
                  value={form.startDate}
                  onChange={(e) =>
                    updateField(
                      "startDate",
                      e.target.value,
                    )
                  }
                  className={inputClass}
                />
              </Field>

              <Field
                label="End Date & Time"
                required
              >
                <input
                  type="datetime-local"
                  value={form.endDate}
                  onChange={(e) =>
                    updateField(
                      "endDate",
                      e.target.value,
                    )
                  }
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          {/* Location */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="mb-7">
              <h2 className="text-xl font-semibold">
                Location
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Tell attendees where the event will
                take place.
              </p>
            </div>

            <div className="space-y-6">
              <Field
                label="Venue"
                required
              >
                <input
                  type="text"
                  value={form.venue}
                  onChange={(e) =>
                    updateField(
                      "venue",
                      e.target.value,
                    )
                  }
                  placeholder="Venue name"
                  className={inputClass}
                />
              </Field>

              <Field label="Venue Address">
                <input
                  type="text"
                  value={
                    form.venueAddress || ""
                  }
                  onChange={(e) =>
                    updateField(
                      "venueAddress",
                      e.target.value,
                    )
                  }
                  placeholder="Full venue address"
                  className={inputClass}
                />
              </Field>

              <div className="grid gap-6 md:grid-cols-2">
                <Field label="City">
                  <input
                    type="text"
                    value={form.city || ""}
                    onChange={(e) =>
                      updateField(
                        "city",
                        e.target.value,
                      )
                    }
                    placeholder="City"
                    className={inputClass}
                  />
                </Field>

                <Field label="Country">
                  <input
                    type="text"
                    value={
                      form.country || ""
                    }
                    onChange={(e) =>
                      updateField(
                        "country",
                        e.target.value,
                      )
                    }
                    placeholder="Country"
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Latitude">
                  <input
                    type="number"
                    step="any"
                    value={
                      form.venueLatitude ??
                      ""
                    }
                    onChange={(e) =>
                      updateField(
                        "venueLatitude",
                        e.target.value === ""
                          ? undefined
                          : Number(
                              e.target.value,
                            ),
                      )
                    }
                    placeholder="e.g. 6.5244"
                    className={inputClass}
                  />
                </Field>

                <Field label="Longitude">
                  <input
                    type="number"
                    step="any"
                    value={
                      form.venueLongitude ??
                      ""
                    }
                    onChange={(e) =>
                      updateField(
                        "venueLongitude",
                        e.target.value === ""
                          ? undefined
                          : Number(
                              e.target.value,
                            ),
                      )
                    }
                    placeholder="e.g. 3.3792"
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>
          </section>

          {/* Capacity */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="mb-7">
              <h2 className="text-xl font-semibold">
                Event Capacity
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Define the maximum number of attendees
                your event can accommodate.
              </p>
            </div>

            <div className="max-w-md">
              <Field
                label="Maximum Capacity"
                required
              >
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
            </div>
          </section>

          {/* Media */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="mb-7">
              <h2 className="text-xl font-semibold">
                Event Media
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Update the images associated with your
                event.
              </p>
            </div>

            <div className="space-y-6">
              <Field label="Cover Image URL">
                <input
                  type="url"
                  value={
                    form.coverImage || ""
                  }
                  onChange={(e) =>
                    updateField(
                      "coverImage",
                      e.target.value,
                    )
                  }
                  placeholder="https://..."
                  className={inputClass}
                />
              </Field>

              <Field label="Featured Image URL">
                <input
                  type="url"
                  value={
                    form.featuredImage || ""
                  }
                  onChange={(e) =>
                    updateField(
                      "featuredImage",
                      e.target.value,
                    )
                  }
                  placeholder="https://..."
                  className={inputClass}
                />
              </Field>

              {form.coverImage && (
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <img
                    src={form.coverImage}
                    alt="Event cover preview"
                    className="h-56 w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />
                </div>
              )}
            </div>
          </section>

          {/* Visibility */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-xl font-semibold">
                  Public Event
                </h2>

                <p className="mt-1 max-w-xl text-sm text-white/40">
                  Public events can be discovered and
                  viewed by attendees on WowYou.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  updateField(
                    "isPublic",
                    !form.isPublic,
                  )
                }
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                  form.isPublic
                    ? "bg-primary"
                    : "bg-white/20"
                }`}
                aria-label="Toggle public event"
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                    form.isPublic
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Vendor Marketplace */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="mb-7">
              <h2 className="text-xl font-semibold">
                Vendor Marketplace
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Configure vendor applications for this
                event.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="text-sm font-semibold">
                    Accept Vendor Applications
                  </h3>

                  <p className="mt-1 text-sm text-white/40">
                    Allow vendors to apply to participate
                    in this event.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    updateField(
                      "vendorApplicationsOpen",
                      !form.vendorApplicationsOpen,
                    )
                  }
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    form.vendorApplicationsOpen
                      ? "bg-primary"
                      : "bg-white/20"
                  }`}
                  aria-label="Toggle vendor applications"
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      form.vendorApplicationsOpen
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              {form.vendorApplicationsOpen && (
                <div className="grid gap-6 md:grid-cols-2">
                  <Field label="Application Deadline">
                    <input
                      type="datetime-local"
                      value={
                        form.vendorApplicationDeadline ||
                        ""
                      }
                      onChange={(e) =>
                        updateField(
                          "vendorApplicationDeadline",
                          e.target.value,
                        )
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Maximum Vendor Slots">
                    <input
                      type="number"
                      min="1"
                      value={
                        form.maxVendorSlots ??
                        ""
                      }
                      onChange={(e) =>
                        updateField(
                          "maxVendorSlots",
                          e.target.value === ""
                            ? undefined
                            : Number(
                                e.target.value,
                              ),
                        )
                      }
                      placeholder="e.g. 50"
                      className={inputClass}
                    />
                  </Field>
                </div>
              )}
            </div>
          </section>

          {/* Actions */}

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/events/${eventId}`,
                )
              }
              disabled={saving}
              className="h-12 rounded-xl border border-white/10 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="h-12 rounded-xl bg-primary px-7 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving Changes..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Field
|--------------------------------------------------------------------------
*/

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/80">
        {label}

        {required && (
          <span className="ml-1 text-primary">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Input
|--------------------------------------------------------------------------
*/

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-primary/50 focus:bg-white/[0.06]";