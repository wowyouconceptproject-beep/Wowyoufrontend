import { Announcement } from "@/services/announcement";

import AnnouncementCard from "./AnnouncementCard";

interface Props {
  announcements: Announcement[];
}

export default function AnnouncementList({
  announcements,
}: Props) {
  if (
    announcements.length === 0
  ) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center text-gray-500">
        No announcements yet.
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {announcements.map(
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