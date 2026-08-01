"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import QRCode from "react-qr-code";

import {
  Check,
  Copy,
  Globe,
  Mail,
  MessageCircle,
  X,
} from "lucide-react";

import { getEventUrl } from "@/lib/event-url";
import { buildShareLinks } from "@/lib/share-links";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  event: {
    id: string;
    title: string;
    description?: string;
  };
}

export default function ShareEventDialog({
  open,
  onOpenChange,
  event,
}: Props) {
  const [copied, setCopied] =
    useState(false);

  const url = getEventUrl(event.id);

  const links =
    buildShareLinks(event);

  useEffect(() => {
    if (!open) return;

    const previous =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleEscape(
      e: KeyboardEvent
    ) {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleEscape
      );
  }, [open, onOpenChange]);

  if (!open) return null;

  async function copyLink() {
    await navigator.clipboard.writeText(
      url
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/80
        p-4
        backdrop-blur-sm
      "
      onMouseDown={(e) => {
        if (
          e.target ===
          e.currentTarget
        ) {
          onOpenChange(false);
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="
          relative
          w-full
          max-w-xl
          overflow-hidden
          rounded-[28px]
          border
          border-white/10
          bg-[#090909]
          text-white
          shadow-2xl
        "
      >
        {/* Header */}

        <header
          className="
            flex
            items-center
            justify-between
            border-b
            border-white/10
            px-7
            py-6
          "
        >
          <div>
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.25em]
                text-[#3E86A4]
              "
            >
              Share
            </p>

            <h2
              className="
                mt-2
                text-2xl
                font-bold
              "
            >
              Share Event
            </h2>
          </div>

          <button
            onClick={() =>
              onOpenChange(false)
            }
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-white/[0.04]
              transition
              hover:bg-white/[0.08]
            "
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-8 p-7">
          {/* Public Link */}

          <section>
            <p
              className="
                mb-3
                text-sm
                font-semibold
              "
            >
              Public Event Link
            </p>

            <div
              className="
                flex
                overflow-hidden
                rounded-2xl
                border
                border-[#3E86A4]/20
              "
            >
              <input
                readOnly
                value={url}
                className="
                  flex-1
                  bg-transparent
                  px-4
                  py-4
                  text-sm
                  outline-none
                "
              />

              <button
                onClick={copyLink}
                className="
                  flex
                  items-center
                  gap-2
                  border-l
                  border-[#3E86A4]/20
                  bg-[#3E86A4]/10
                  px-5
                  transition
                  hover:bg-[#3E86A4]/20
                "
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Social */}

          <section>
            <p
              className="
                mb-4
                text-sm
                font-semibold
              "
            >
              Share Directly
            </p>

            <div className="grid grid-cols-2 gap-3">
              <ShareCard
                icon={<MessageCircle />}
                title="WhatsApp"
                href={links.whatsapp}
              />

              <ShareCard
                icon={<Globe />}
                title="Facebook"
                href={links.facebook}
              />

              <ShareCard
                icon={<Globe />}
                title="LinkedIn"
                href={links.linkedin}
              />

              <ShareCard
                icon={<Mail />}
                title="Email"
                href={links.email}
              />
            </div>
          </section>

          {/* QR Code */}

          <section>
            <p
              className="
                mb-4
                text-sm
                font-semibold
              "
            >
              QR Code
            </p>

            <div
              className="
                flex
                justify-center
                rounded-3xl
                border
                border-[#3E86A4]/20
                bg-white
                p-6
              "
            >
              <QRCode
                value={url}
                size={180}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ShareCard({
  icon,
  title,
  href,
}: {
  icon: ReactNode;
  title: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-white/10
        bg-white/[0.03]
        p-4
        transition
        hover:border-[#3E86A4]/40
        hover:bg-[#3E86A4]/10
      "
    >
      <div className="text-[#3E86A4]">
        {icon}
      </div>

      <span className="font-medium">
        {title}
      </span>
    </a>
  );
}