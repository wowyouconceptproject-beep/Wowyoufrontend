import { apiFetch } from "@/lib/api";

export interface Announcement {
  id: string;

  eventId: string;

  title: string;

  message: string;

  type: string;

  priority: string;

  audience: string;

  isPinned: boolean;

  authorId: string;

  authorName?: string;

  createdAt: string;
}

export interface AnnouncementResponse {
  success: boolean;

  announcements: Announcement[];
}

export function getAnnouncements(
  limit = 50
) {
  return apiFetch<AnnouncementResponse>(
    `/operations/announcements?limit=${limit}`
  );
}