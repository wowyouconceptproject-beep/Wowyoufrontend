import {
  AlertTriangle,
  Check,
  CircleAlert,
  Info,
  Megaphone,
  Pin,
  UserRound,
  Users,
  Clock3,
} from "lucide-react";

import {
  Announcement,
} from "@/services/announcement";

interface Props {
  announcement: Announcement;
}

export default function AnnouncementCard({
  announcement,
}: Props) {
  /*
  |--------------------------------------------------------------------------
  | Priority
  |--------------------------------------------------------------------------
  */

  const priorityConfig = {
    INFO: {
      label: "Information",
      icon: Info,
      badge:
        "border-blue-500/15 bg-blue-500/[0.07] text-blue-400",
      iconStyle:
        "border-blue-500/15 bg-blue-500/[0.07] text-blue-400",
    },

    SUCCESS: {
      label: "Update",
      icon: Check,
      badge:
        "border-emerald-500/15 bg-emerald-500/[0.07] text-emerald-400",
      iconStyle:
        "border-emerald-500/15 bg-emerald-500/[0.07] text-emerald-400",
    },

    WARNING: {
      label: "Warning",
      icon: AlertTriangle,
      badge:
        "border-amber-500/15 bg-amber-500/[0.07] text-amber-400",
      iconStyle:
        "border-amber-500/15 bg-amber-500/[0.07] text-amber-400",
    },

    URGENT: {
      label: "Urgent",
      icon: CircleAlert,
      badge:
        "border-red-500/15 bg-red-500/[0.07] text-red-400",
      iconStyle:
        "border-red-500/15 bg-red-500/[0.07] text-red-400",
    },
  };

  const config =
    priorityConfig[
      announcement.priority as keyof typeof priorityConfig
    ] ?? {
      label:
        announcement.priority,
      icon: Megaphone,
      badge:
        "border-white/[0.08] bg-white/[0.04] text-white/50",
      iconStyle:
        "border-white/[0.08] bg-white/[0.04] text-white/50",
    };

  const PriorityIcon =
    config.icon;

  /*
  |--------------------------------------------------------------------------
  | Date
  |--------------------------------------------------------------------------
  */

  const createdAt =
    new Date(
      announcement.createdAt,
    );

  const formattedDate =
    createdAt.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      },
    );

  const formattedTime =
    createdAt.toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      },
    );

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <article
      className={`
        group
        relative
        overflow-hidden
        rounded-[24px]
        border
        bg-[#0D0D0D]
        transition
        duration-300
        hover:bg-[#101010]

        ${
          announcement.isPinned
            ? "border-[#D4AF37]/20"
            : "border-white/[0.07] hover:border-white/[0.12]"
        }
      `}
    >
      {/* Pinned Accent */}

      {announcement.isPinned && (
        <div
          className="
            absolute
            left-0
            top-0
            h-full
            w-[3px]
            bg-[#0F766E]
          "
        />
      )}

      <div className="p-6 md:p-7">

        {/* Header */}

        <div
          className="
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-start
            sm:justify-between
          "
        >
          <div
            className="
              flex
              min-w-0
              items-start
              gap-4
            "
          >
            {/* Priority Icon */}

            <div
              className={`
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                ${config.iconStyle}
              `}
            >
              <PriorityIcon
                className="h-4 w-4"
              />
            </div>

            {/* Title */}

            <div className="min-w-0">

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-3
                "
              >
                <h3
                  className="
                    text-lg
                    font-black
                    tracking-tight
                    text-white
                    md:text-xl
                  "
                >
                  {announcement.title}
                </h3>

                {announcement.isPinned && (
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-[#D4AF37]/20
                      bg-[#0F766E]/[0.07]
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      text-[#D4AF37]
                    "
                  >
                    <Pin
                      className="
                        h-3
                        w-3
                      "
                    />

                    Pinned
                  </span>
                )}

              </div>

              <p
                className="
                  mt-1
                  text-xs
                  text-white/25
                "
              >
                Event Announcement
              </p>

            </div>

          </div>

          {/* Priority Badge */}

          <span
            className={`
              inline-flex
              w-fit
              shrink-0
              items-center
              gap-2
              rounded-full
              border
              px-3
              py-1.5
              text-[10px]
              font-bold
              uppercase
              tracking-[0.12em]
              ${config.badge}
            `}
          >
            <PriorityIcon
              className="h-3 w-3"
            />

            {config.label}
          </span>

        </div>

        {/* Message */}

        <div
          className="
            mt-6
            border-l
            border-white/[0.07]
            pl-5
            sm:ml-[60px]
          "
        >
          <p
            className="
              max-w-4xl
              text-sm
              leading-7
              text-white/55
              md:text-[15px]
            "
          >
            {announcement.message}
          </p>
        </div>

        {/* Metadata */}

        <div
          className="
            mt-7
            flex
            flex-wrap
            items-center
            gap-x-6
            gap-y-3
            border-t
            border-white/[0.06]
            pt-5
            text-xs
            text-white/30
            sm:ml-[60px]
          "
        >
          {/* Author */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <UserRound
              className="
                h-3.5
                w-3.5
                text-white/20
              "
            />

            <span>
              {announcement.authorName ??
                "System"}
            </span>
          </div>

          {/* Audience */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <Users
              className="
                h-3.5
                w-3.5
                text-white/20
              "
            />

            <span>
              {announcement.audience}
            </span>
          </div>

          {/* Date */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <Clock3
              className="
                h-3.5
                w-3.5
                text-white/20
              "
            />

            <span>
              {formattedDate}
              {" · "}
              {formattedTime}
            </span>
          </div>

        </div>

      </div>
    </article>
  );
}