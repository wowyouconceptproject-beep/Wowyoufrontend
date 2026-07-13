import { Announcement } from "@/services/announcement";

interface Props {
  announcement: Announcement;
}

export default function AnnouncementCard({
  announcement,
}: Props) {
  const priorityColor = {
    INFO:
      "bg-blue-100 text-blue-700",

    SUCCESS:
      "bg-green-100 text-green-700",

    WARNING:
      "bg-yellow-100 text-yellow-700",

    URGENT:
      "bg-red-100 text-red-700",
  }[
    announcement.priority
  ] ??
    "bg-gray-100 text-gray-700";

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <div className="flex items-start justify-between gap-6">

        <div className="flex-1">

          <div className="flex items-center gap-3">

            <h3 className="text-lg font-semibold">
              {announcement.title}
            </h3>

            {announcement.isPinned && (
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                Pinned
              </span>
            )}

          </div>

          <p className="mt-3 leading-7 text-gray-600">
            {announcement.message}
          </p>

        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${priorityColor}`}
        >
          {announcement.priority}
        </span>

      </div>

      <div className="mt-6 flex flex-wrap gap-5 text-sm text-gray-500">

        <span>
          <strong>Author:</strong>{" "}
          {announcement.authorName ??
            "System"}
        </span>

        <span>
          <strong>Audience:</strong>{" "}
          {announcement.audience}
        </span>

        <span>
          <strong>Created:</strong>{" "}
          {new Date(
            announcement.createdAt,
          ).toLocaleString()}
        </span>

      </div>

    </div>
  );
}