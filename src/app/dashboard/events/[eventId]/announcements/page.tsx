
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { ElementType } from "react";
import {
  Radio,
  RefreshCw,
  AlertCircle,
  Megaphone,
  Activity,
  Bell,
} from "lucide-react";

import AnnouncementComposer from "@/components/dashboard/announcements/AnnouncementComposer";
import AnnouncementList from "@/components/dashboard/announcements/AnnouncementList";

import {
  type Announcement,
  getAnnouncements,
} from "@/services/announcement";

import { useRealtime } from "@/hooks/useRealtime";

export default function AnnouncementPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params.eventId;

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnnouncements = useCallback(async () => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await getAnnouncements(eventId);

      if (!result.success) {
        throw new Error(
          result.message || "Unable to load announcements.",
        );
      }

      setAnnouncements(result.announcements ?? []);
    } catch (err: unknown) {
      console.error("Failed to load announcements:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load announcements.",
      );
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    void loadAnnouncements();
  }, [loadAnnouncements]);

  useRealtime({
    eventId,

    onAnnouncementCreated(announcement) {
      setAnnouncements((previous) => {
        const exists = previous.some(
          (item) => item.id === announcement.id,
        );

        if (exists) {
          return previous.map((item) =>
            item.id === announcement.id ? announcement : item,
          );
        }

        return [announcement, ...previous];
      });

      setError("");
    },

    onAnnouncementUpdated(announcement) {
      setAnnouncements((previous) =>
        previous.map((item) =>
          item.id === announcement.id ? announcement : item,
        ),
      );
    },

    onAnnouncementDeleted(payload) {
      setAnnouncements((previous) =>
        previous.filter((item) => item.id !== payload.id),
      );
    },
  });

  function handleAnnouncementCreated(announcement: Announcement) {
    setAnnouncements((previous) => {
      const exists = previous.some(
        (item) => item.id === announcement.id,
      );

      if (exists) {
        return previous.map((item) =>
          item.id === announcement.id ? announcement : item,
        );
      }

      return [announcement, ...previous];
    });

    setError("");
  }

  return (
    <main className="min-h-screen bg-background p-6 text-white md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page header */}
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-primary" />

              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                Event Communications
              </p>
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
              Live Announcements
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
              Broadcast important information, operational updates and
              live event notices to your attendees.
            </p>
          </div>

          {/* Realtime connection indicator */}
          <div className="flex w-fit items-center gap-3 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.05] px-4 py-3">
            <div className="relative">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />
              <span className="relative block h-2 w-2 rounded-full bg-emerald-400" />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-400/60">
                Realtime
              </p>

              <p className="mt-0.5 text-xs font-bold text-emerald-400">
                Live Connection
              </p>
            </div>
          </div>
        </header>

        {/* Communication overview */}
        <section className="grid gap-4 md:grid-cols-3">
          <OverviewCard
            icon={Megaphone}
            label="Announcements"
            value={announcements.length}
            description="Messages currently available for this event."
          />

          <OverviewCard
            icon={Radio}
            label="Delivery"
            value="Realtime"
            description="New announcements are delivered through the live event channel."
          />

          <OverviewCard
            icon={Activity}
            label="Communication"
            value="Active"
            description="Manage event updates from one central communication channel."
          />
        </section>

        {/* Announcement composer */}
        <AnnouncementComposer
          eventId={eventId}
          onCreated={handleAnnouncementCreated}
        />

        {/* Announcement feed */}
        <section className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-surface">
          <div className="flex flex-col gap-5 border-b border-white/[0.07] px-6 py-6 md:flex-row md:items-center md:justify-between md:px-7">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/15 bg-primary/[0.06]">
                <Bell className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  Announcement Feed
                </h2>

                <p className="mt-1 text-sm text-white/35">
                  Live communication history for this event.
                </p>
              </div>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-lg border border-white/[0.06] bg-background/20 px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />

              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
                {announcements.length}{" "}
                {announcements.length === 1 ? "Message" : "Messages"}
              </span>
            </div>
          </div>

          {/* Feed loading state */}
          {loading ? (
            <div className="space-y-4 p-6">
              <div className="h-5 w-48 animate-pulse rounded bg-white/[0.06]" />
              <div className="h-24 animate-pulse rounded-2xl bg-white/[0.04]" />
              <div className="h-24 animate-pulse rounded-2xl bg-white/[0.04]" />
            </div>
          ) : error ? (
            <div className="m-6 rounded-2xl border border-red-500/15 bg-red-500/[0.04] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>

              <h3 className="mt-4 text-lg font-bold">
                Failed to Load Announcements
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/50">
                {error}
              </p>

              <button
                type="button"
                onClick={() => void loadAnnouncements()}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-white/90"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          ) : announcements.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-primary/15 bg-primary/[0.05]">
                <div className="absolute inset-2 rounded-full border border-primary/10" />
                <Megaphone className="relative h-8 w-8 text-primary" />
              </div>

              <h2 className="mt-6 text-xl font-bold">
                No Announcements Yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/35">
                Your event communication feed is currently quiet.
                Publish an announcement above to start sharing updates.
              </p>
            </div>
          ) : (
            <div className="p-4 md:p-6">
              <AnnouncementList announcements={announcements} />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function OverviewCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: ElementType;
  label: string;
  value: number | string;
  description: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[22px] border border-white/[0.08] bg-surface p-6 transition hover:border-primary/20">
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/[0.035] blur-3xl" />

      <div className="relative">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/15 bg-primary/[0.06]">
          <Icon className="h-4 w-4 text-primary" />
        </div>

        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.16em] text-white/30">
          {label}
        </p>

        <p className="mt-2 text-3xl font-black tracking-tight">
          {value}
        </p>

        <p className="mt-2 text-xs leading-5 text-white/40">
          {description}
        </p>
      </div>
    </div>
  );
}
