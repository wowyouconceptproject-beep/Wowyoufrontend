
"use client";

import { FormEvent, useState } from "react";
import {
  Bell,
  LoaderCircle,
  Send,
  Pin,
  PinOff,
  AlertTriangle,
  CheckCircle2,
  Info,
  Trash2,
} from "lucide-react";

import {
  createAnnouncement,
  type Announcement,
  type AnnouncementType,
  type AnnouncementPriority,
  type AnnouncementAudience,
} from "@/services/announcement";

interface AnnouncementComposerProps {
  eventId: string;
  onCreated: (announcement: Announcement) => void;
}

const fieldClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function AnnouncementComposer({
  eventId,
  onCreated,
}: AnnouncementComposerProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<AnnouncementType>("INFO");
  const [priority, setPriority] =
    useState<AnnouncementPriority>("NORMAL");
  const [audience, setAudience] =
    useState<AnnouncementAudience>("ALL");
  const [isPinned, setIsPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanTitle = title.trim();
    const cleanMessage = message.trim();

    if (!cleanTitle || !cleanMessage) {
      setError("Enter an announcement title and message.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createAnnouncement(eventId, {
        title: cleanTitle,
        message: cleanMessage,
        type,
        priority,
        audience,
        isPinned,
      });

      if (!result.success || !result.announcement) {
        throw new Error(
          result.message || "Unable to publish the announcement.",
        );
      }

      onCreated(result.announcement);

      setTitle("");
      setMessage("");
      setType("INFO");
      setPriority("NORMAL");
      setAudience("ALL");
      setIsPinned(false);
      setSuccess("Announcement published successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while publishing.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="flex items-start gap-3 border-b border-border p-5 sm:p-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Bell size={21} />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-foreground">
            Create announcement
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Share important event updates with your audience.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
        <div>
          <label
            htmlFor="announcement-title"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Announcement title
          </label>
          <input
            id="announcement-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Venue opening time updated"
            maxLength={120}
            required
            className={fieldClass}
          />
          <p className="mt-1 text-right text-xs text-muted-foreground">
            {title.length}/120
          </p>
        </div>

        <div>
          <label
            htmlFor="announcement-message"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Message
          </label>
          <textarea
            id="announcement-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write the details your audience needs to know..."
            rows={5}
            maxLength={5000}
            required
            className={`${fieldClass} resize-y`}
          />
          <p className="mt-1 text-right text-xs text-muted-foreground">
            {message.length}/5000
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="announcement-type"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Announcement type
            </label>
            <select
              id="announcement-type"
              value={type}
              onChange={(event) =>
                setType(event.target.value as AnnouncementType)
              }
              className={fieldClass}
            >
              <option value="INFO">Information</option>
              <option value="SUCCESS">Success</option>
              <option value="WARNING">Warning</option>
              <option value="EMERGENCY">Emergency</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="announcement-priority"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Priority
            </label>
            <select
              id="announcement-priority"
              value={priority}
              onChange={(event) =>
                setPriority(
                  event.target.value as AnnouncementPriority,
                )
              }
              className={fieldClass}
            >
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="announcement-audience"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Audience
          </label>
          <select
            id="announcement-audience"
            value={audience}
            onChange={(event) =>
              setAudience(
                event.target.value as AnnouncementAudience,
              )
            }
            className={fieldClass}
          >
            <option value="ALL">Everyone</option>
            <option value="ATTENDEES">Attendees</option>
            <option value="STAFF">Event staff</option>
            <option value="ORGANIZERS">Organizers</option>
          </select>
          <p className="mt-1 text-xs text-muted-foreground">
            Choose who this announcement is intended for.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPinned((current) => !current)}
          aria-pressed={isPinned}
          className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
            isPinned
              ? "border-primary/40 bg-primary/5"
              : "border-border hover:bg-background"
          }`}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background text-primary">
            {isPinned ? <Pin size={18} /> : <PinOff size={18} />}
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-foreground">
              Pin announcement
            </span>
            <span className="mt-1 block text-xs text-muted-foreground">
              Keep this announcement at the top of the feed.
            </span>
          </span>

          <span
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
              isPinned ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                isPinned ? "left-6" : "left-1"
              }`}
            />
          </span>
        </button>

        {type === "EMERGENCY" && (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm">
            <AlertTriangle
              size={19}
              className="mt-0.5 shrink-0 text-red-500"
            />
            <p className="text-foreground">
              Emergency announcements should contain clear, actionable
              instructions. Confirm your audience before publishing.
            </p>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-600"
          >
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="flex items-start gap-2 rounded-xl border border-green-500/30 bg-green-500/5 p-3 text-sm text-green-600"
          >
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Publishing sends the announcement to the selected audience.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Send size={18} />
                Publish announcement
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
