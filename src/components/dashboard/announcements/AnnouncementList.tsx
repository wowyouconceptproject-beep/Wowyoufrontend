import {
  Megaphone,
  Plus,
} from "lucide-react";

import {
  Announcement,
} from "@/services/announcement";

import AnnouncementCard from "./AnnouncementCard";

interface Props {
  announcements: Announcement[];
}

export default function AnnouncementList({
  announcements,
}: Props) {
  /*
  |--------------------------------------------------------------------------
  | Empty State
  |--------------------------------------------------------------------------
  */

  if (
    announcements.length === 0
  ) {
    return (
      <div
        className="
          flex
          min-h-[360px]
          flex-col
          items-center
          justify-center
          rounded-[28px]
          border
          border-dashed
          border-white/[0.09]
          bg-white/[0.015]
          px-6
          py-14
          text-center
        "
      >
        {/* Icon */}

        <div
          className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            border
            border-[#D4AF37]/15
            bg-[#D4AF37]/[0.05]
          "
        >
          <Megaphone
            className="
              h-6
              w-6
              text-[#D4AF37]
            "
          />
        </div>

        {/* Copy */}

        <h3
          className="
            mt-7
            text-xl
            font-black
            tracking-tight
            text-white
            md:text-2xl
          "
        >
          No Announcements Yet
        </h3>

        <p
          className="
            mt-3
            max-w-md
            text-sm
            leading-7
            text-white/30
          "
        >
          Event announcements will
          appear here as they are
          created and broadcast to
          attendees and event teams.
        </p>

        {/* Status */}

        <div
          className="
            mt-7
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-white/[0.07]
            bg-white/[0.025]
            px-4
            py-2
            text-[10px]
            font-bold
            uppercase
            tracking-[0.14em]
            text-white/30
          "
        >
          <Plus
            className="
              h-3
              w-3
            "
          />

          Waiting for first announcement
        </div>

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Sort
  |--------------------------------------------------------------------------
  |
  | Pinned announcements appear first.
  | Within each group, newest announcements
  | appear before older announcements.
  |
  */

  const sortedAnnouncements =
    [...announcements].sort(
      (a, b) => {
        if (
          a.isPinned &&
          !b.isPinned
        ) {
          return -1;
        }

        if (
          !a.isPinned &&
          b.isPinned
        ) {
          return 1;
        }

        return (
          new Date(
            b.createdAt,
          ).getTime() -
          new Date(
            a.createdAt,
          ).getTime()
        );
      },
    );

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-5">

      {sortedAnnouncements.map(
        (
          announcement,
        ) => (
          <AnnouncementCard
            key={
              announcement.id
            }
            announcement={
              announcement
            }
          />
        ),
      )}

    </div>
  );
}