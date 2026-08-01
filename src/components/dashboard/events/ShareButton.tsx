"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

import ShareEventDialog from "./ShareEventDialog";
import { getEventUrl } from "@/lib/event-url";

interface Props {
  event: {
    id: string;
    title: string;
    description?: string;
  };
}

export default function ShareButton({
  event,
}: Props) {
  const [open, setOpen] = useState(false);

  async function handleShare() {
    const url = getEventUrl(event.id);

    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description ?? "",
          url,
        });

        return;
      } catch {
        // User cancelled the native share dialog.
      }
    }

    setOpen(true);
  }

  return (
    <>
      <button
        onClick={handleShare}
        className="
          inline-flex
          h-12
          items-center
          gap-2
          rounded-xl
          border
          border-[#3E86A4]/20
          bg-[#3E86A4]
          px-6
          text-sm
          font-semibold
          text-white
          transition-all
          duration-200
          hover:bg-[#1F7197]
          hover:shadow-lg
          hover:shadow-[#3E86A4]/25
        "
      >
        <Share2 className="h-4 w-4" />
        Share Event
      </button>

      <ShareEventDialog
        open={open}
        onOpenChange={setOpen}
        event={event}
      />
    </>
  );
}