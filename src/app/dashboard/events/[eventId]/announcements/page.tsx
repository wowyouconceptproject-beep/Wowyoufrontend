"use client";

import {
  useEffect,
  useState,
} from "react";

import AnnouncementList from "@/components/dashboard/announcements/AnnouncementList";

import {
  Announcement,
  getAnnouncements,
} from "@/services/announcement";

import {
  useRealtime,
} from "@/hooks/useRealtime";

export default function AnnouncementPage() {
  const [
    announcements,
    setAnnouncements,
  ] = useState<
    Announcement[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load Announcements
  |--------------------------------------------------------------------------
  */

  async function loadAnnouncements() {
    try {
      setLoading(true);

      const result =
        await getAnnouncements();

      if (
        result.success
      ) {
        setAnnouncements(
          result.announcements ??
            [],
        );

        setError("");
      }
    } catch (err: any) {
      console.error(err);

      setError(
        err.message ??
          "Unable to load announcements.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnnouncements();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Realtime
  |--------------------------------------------------------------------------
  */

  useRealtime({
    onAnnouncementCreated(
      announcement,
    ) {
      setAnnouncements(
        (previous) => {
          const exists =
            previous.some(
              (item) =>
                item.id ===
                announcement.id,
            );

          if (exists) {
            return previous;
          }

          return [
            announcement,
            ...previous,
          ];
        },
      );
    },

    onAnnouncementUpdated(
      announcement,
    ) {
      setAnnouncements(
        (previous) =>
          previous.map(
            (item) =>
              item.id ===
              announcement.id
                ? announcement
                : item,
          ),
      );
    },

    onAnnouncementDeleted(
      payload,
    ) {
      setAnnouncements(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !==
              payload.id,
          ),
      );
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="p-8">
        Loading announcements...
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <main className="p-8">

        <h1 className="mb-6 text-3xl font-bold">
          Announcements
        </h1>

        <div className="rounded-lg border border-red-200 bg-red-50 p-6">

          <h2 className="font-semibold text-red-700">
            Failed to load announcements
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

        </div>

      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <main className="space-y-8 p-8">

      <div>

        <h1 className="text-3xl font-bold">
          Live Announcements
        </h1>

        <p className="mt-2 text-gray-500">
          Realtime operational announcements
          from across the platform.
        </p>

      </div>

      <AnnouncementList
        announcements={
          announcements
        }
      />

    </main>
  );
}