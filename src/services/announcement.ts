
import { apiFetch } from "@/lib/api";

export type AnnouncementType =
  | "INFO"
  | "SUCCESS"
  | "WARNING"
  | "EMERGENCY";

export type AnnouncementPriority =
  | "LOW"
  | "NORMAL"
  | "HIGH"
  | "CRITICAL";

export type AnnouncementAudience =
  | "ALL"
  | "ATTENDEES"
  | "STAFF"
  | "ORGANIZERS";

export interface Announcement {
  id: string;
  eventId: string;
  title: string;
  message: string;
  type: AnnouncementType | string;
  priority: AnnouncementPriority | string;
  audience: AnnouncementAudience | string;
  isPinned: boolean;
  authorId: string;
  authorName?: string;
  createdAt: string;
}

export interface AnnouncementResponse {
  success: boolean;
  announcements: Announcement[];
  message?: string;
}

export interface SingleAnnouncementResponse {
  success: boolean;
  announcement: Announcement;
  message?: string;
}

export interface CreateAnnouncementInput {
  title: string;
  message: string;
  type: AnnouncementType;
  priority: AnnouncementPriority;
  audience: AnnouncementAudience;
  isPinned?: boolean;
  expiresAt?: string | null;
}

export function getAnnouncements(
  eventId: string,
  limit = 50,
) {
  return apiFetch<AnnouncementResponse>(
    `/events/${encodeURIComponent(eventId)}/announcements?limit=${limit}`,
  );
}

export function createAnnouncement(
  eventId: string,
  input: CreateAnnouncementInput,
) {
  return apiFetch<SingleAnnouncementResponse>(
    `/events/${encodeURIComponent(eventId)}/announcements`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function setAnnouncementPinned(
  eventId: string,
  announcementId: string,
  isPinned: boolean,
) {
  return apiFetch<SingleAnnouncementResponse>(
    `/events/${encodeURIComponent(eventId)}/announcements/${encodeURIComponent(announcementId)}/pin`,
    {
      method: "PATCH",
      body: JSON.stringify({ isPinned }),
    },
  );
}

export function deleteAnnouncement(
  eventId: string,
  announcementId: string,
) {
  return apiFetch<{ success: boolean; message?: string }>(
    `/events/${encodeURIComponent(eventId)}/announcements/${encodeURIComponent(announcementId)}`,
    {
      method: "DELETE",
    },
  );
}
