"use client";

import {
  useEffect,
  useState,
  useTransition,
} from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Ban,
  Check,
  Copy,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  regenerateCode,
  disableStaff,
} from "./actions";

interface Staff {
  id: string;
  name: string;
  role: string;
  station?: string;
  phone?: string;
  email?: string;
  accessCode: string;
  permissions: string[];
  isActive: boolean;
  isRevoked: boolean;
  lastUsedAt?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (
    open: boolean
  ) => void;
  eventId: string;
  staff: Staff;
}

export function AccessCodeDialog({
  open,
  onOpenChange,
  eventId,
  staff,
}: Props) {
  const [
    pending,
    startTransition,
  ] = useTransition();

  const [
    code,
    setCode,
  ] = useState(
    staff.accessCode
  );

  const [
    copied,
    setCopied,
  ] = useState(false);

  useEffect(() => {
    setCode(
      staff.accessCode
    );

    setCopied(false);
  }, [
    staff.id,
    staff.accessCode,
  ]);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(
        code
      );

      setCopied(true);

      window.setTimeout(
        () => {
          setCopied(false);
        },
        1800
      );
    } catch (error) {
      console.error(
        "Unable to copy access code:",
        error
      );
    }
  }

  function regenerate() {
    startTransition(
      async () => {
        try {
          const result =
            await regenerateCode(
              staff.id,
              eventId
            );

          if (
            result?.accessCode
          ) {
            setCode(
              result.accessCode
            );

            setCopied(false);
          }
        } catch (error) {
          console.error(
            "Unable to regenerate access code:",
            error
          );
        }
      }
    );
  }

  function disable() {
    startTransition(
      async () => {
        try {
          await disableStaff(
            staff.id,
            eventId
          );

          onOpenChange(
            false
          );
        } catch (error) {
          console.error(
            "Unable to disable staff:",
            error
          );
        }
      }
    );
  }

  const formattedRole =
    staff.role
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );

  const statusLabel =
    staff.isRevoked
      ? "Revoked"
      : staff.isActive
        ? "Active"
        : "Inactive";

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent
        className="
          max-h-[90vh]
          w-[calc(100%-2rem)]
          max-w-[560px]
          overflow-y-auto
          rounded-[28px]
          border
          border-white/10
          bg-[#0A0A0A]
          p-0
          text-white
          shadow-2xl
          sm:w-full
        "
      >
        {/* Header */}

        <div
          className="
            border-b
            border-white/[0.08]
            px-6
            pb-6
            pt-7
            sm:px-8
          "
        >
          <DialogHeader>

            <div className="flex items-start gap-4">

              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-[#D4AF37]/20
                  bg-[#D4AF37]/10
                "
              >
                <UserRound
                  className="
                    h-5
                    w-5
                    text-[#D4AF37]
                  "
                />
              </div>

              <div className="min-w-0 flex-1">

                <DialogTitle
                  className="
                    text-left
                    text-xl
                    font-bold
                    tracking-tight
                    text-white
                  "
                >
                  {staff.name}
                </DialogTitle>

                <div
                  className="
                    mt-2
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  <span
                    className="
                      text-sm
                      text-white/45
                    "
                  >
                    {formattedRole}
                  </span>

                  <span className="text-white/20">
                    •
                  </span>

                  <span
                    className={`
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      px-2.5
                      py-1
                      text-xs
                      font-semibold
                      ${
                        staff.isRevoked
                          ? "border-red-500/20 bg-red-500/10 text-red-400"
                          : staff.isActive
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : "border-white/10 bg-white/5 text-white/50"
                      }
                    `}
                  >
                    <span
                      className={`
                        h-1.5
                        w-1.5
                        rounded-full
                        ${
                          staff.isRevoked
                            ? "bg-red-400"
                            : staff.isActive
                              ? "bg-emerald-400"
                              : "bg-white/30"
                        }
                      `}
                    />

                    {statusLabel}
                  </span>

                </div>

              </div>

            </div>

          </DialogHeader>
        </div>

        {/* Content */}

        <div
          className="
            space-y-7
            px-6
            py-7
            sm:px-8
          "
        >

          {/* Access Code */}

          <section
            className="
              overflow-hidden
              rounded-[22px]
              border
              border-[#D4AF37]/20
              bg-[#D4AF37]/[0.035]
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
                border-b
                border-[#D4AF37]/10
                px-5
                py-4
              "
            >

              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#D4AF37]/10
                "
              >
                <KeyRound
                  className="
                    h-4
                    w-4
                    text-[#D4AF37]
                  "
                />
              </div>

              <div>

                <p
                  className="
                    text-sm
                    font-semibold
                    text-white
                  "
                >
                  Staff Access Code
                </p>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-white/40
                  "
                >
                  Used to access event
                  operations.
                </p>

              </div>

            </div>

            <div
              className="
                px-4
                py-8
                text-center
                sm:px-6
              "
            >
              <p
                className="
                  break-all
                  font-mono
                  text-2xl
                  font-black
                  tracking-[0.2em]
                  text-white
                  sm:text-3xl
                "
              >
                {code}
              </p>
            </div>

            <div
              className="
                grid
                grid-cols-2
                border-t
                border-[#D4AF37]/10
              "
            >

              <button
                type="button"
                onClick={
                  copyCode
                }
                className="
                  flex
                  min-h-14
                  items-center
                  justify-center
                  gap-2
                  border-r
                  border-[#D4AF37]/10
                  px-4
                  text-sm
                  font-semibold
                  text-white/70
                  transition
                  hover:bg-[#D4AF37]/10
                  hover:text-white
                "
              >
                {copied ? (
                  <>
                    <Check
                      className="
                        h-4
                        w-4
                        text-emerald-400
                      "
                    />

                    Copied
                  </>
                ) : (
                  <>
                    <Copy
                      className="
                        h-4
                        w-4
                        text-[#D4AF37]
                      "
                    />

                    Copy Code
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={
                  pending
                }
                onClick={
                  regenerate
                }
                className="
                  flex
                  min-h-14
                  items-center
                  justify-center
                  gap-2
                  px-4
                  text-sm
                  font-semibold
                  text-white/70
                  transition
                  hover:bg-[#D4AF37]/10
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <RefreshCw
                  className={`
                    h-4
                    w-4
                    text-[#D4AF37]
                    ${
                      pending
                        ? "animate-spin"
                        : ""
                    }
                  `}
                />

                Regenerate
              </button>

            </div>

          </section>

          {/* Staff Details */}

          <section>

            <div
              className="
                mb-3
                flex
                items-center
                gap-2
              "
            >
              <ShieldCheck
                className="
                  h-4
                  w-4
                  text-[#D4AF37]
                "
              />

              <h3
                className="
                  text-sm
                  font-bold
                  text-white
                "
              >
                Staff Details
              </h3>
            </div>

            <div
              className="
                overflow-hidden
                rounded-[20px]
                border
                border-white/[0.08]
                bg-white/[0.025]
              "
            >
              <DetailRow
                icon={MapPin}
                label="Station"
                value={
                  staff.station ??
                  "Not assigned"
                }
              />

              <DetailRow
                icon={Phone}
                label="Phone"
                value={
                  staff.phone ??
                  "Not provided"
                }
              />

              <DetailRow
                icon={Mail}
                label="Email"
                value={
                  staff.email ??
                  "Not provided"
                }
                last
              />
            </div>

          </section>

          {/* Permissions */}

          <section>

            <div
              className="
                mb-3
                flex
                items-center
                justify-between
              "
            >
              <p
                className="
                  text-sm
                  font-bold
                  text-white
                "
              >
                Permissions
              </p>

              <span
                className="
                  text-xs
                  text-white/30
                "
              >
                {staff.permissions.length}
                {" "}
                assigned
              </span>
            </div>

            {staff.permissions.length >
            0 ? (
              <div
                className="
                  flex
                  flex-wrap
                  gap-2
                "
              >
                {staff.permissions.map(
                  (
                    permission
                  ) => (
                    <span
                      key={
                        permission
                      }
                      className="
                        rounded-full
                        border
                        border-[#D4AF37]/15
                        bg-[#D4AF37]/[0.06]
                        px-3
                        py-1.5
                        text-xs
                        font-medium
                        text-[#D4AF37]
                      "
                    >
                      {permission
                        .replaceAll(
                          "_",
                          " "
                        )
                        .toLowerCase()
                        .replace(
                          /\b\w/g,
                          (
                            letter
                          ) =>
                            letter.toUpperCase()
                        )}
                    </span>
                  )
                )}
              </div>
            ) : (
              <div
                className="
                  rounded-2xl
                  border
                  border-dashed
                  border-white/10
                  px-4
                  py-5
                "
              >
                <p
                  className="
                    text-sm
                    text-white/35
                  "
                >
                  No permissions
                  assigned.
                </p>
              </div>
            )}

          </section>

          {/* Last Activity */}

          <section
            className="
              flex
              items-center
              justify-between
              gap-5
              border-t
              border-white/[0.08]
              pt-6
            "
          >
            <div>
              <p
                className="
                  text-xs
                  uppercase
                  tracking-[0.18em]
                  text-white/30
                "
              >
                Last Access
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-medium
                  text-white/70
                "
              >
                {staff.lastUsedAt
                  ? new Date(
                      staff.lastUsedAt
                    ).toLocaleString()
                  : "Never logged in"}
              </p>
            </div>

            <div
              className={`
                h-2
                w-2
                shrink-0
                rounded-full
                ${
                  staff.lastUsedAt
                    ? "bg-emerald-400"
                    : "bg-white/20"
                }
              `}
            />

          </section>

          {/* Danger Zone */}

          <section
            className="
              rounded-[20px]
              border
              border-red-500/15
              bg-red-500/[0.035]
              p-5
            "
          >

            <div
              className="
                flex
                flex-col
                gap-5
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div>

                <p
                  className="
                    text-sm
                    font-semibold
                    text-white
                  "
                >
                  Disable staff access
                </p>

                <p
                  className="
                    mt-1
                    max-w-[290px]
                    text-xs
                    leading-5
                    text-white/40
                  "
                >
                  Immediately revoke this
                  member&apos;s access to
                  event operations.
                </p>

              </div>

              <button
                type="button"
                disabled={
                  pending ||
                  staff.isRevoked
                }
                onClick={
                  disable
                }
                className="
                  inline-flex
                  h-11
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-red-500/20
                  bg-red-500/10
                  px-4
                  text-sm
                  font-semibold
                  text-red-400
                  transition
                  hover:bg-red-500/20
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <Ban
                  className="
                    h-4
                    w-4
                  "
                />

                {staff.isRevoked
                  ? "Disabled"
                  : "Disable"}
              </button>

            </div>

          </section>

        </div>

      </DialogContent>
    </Dialog>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  last = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`
        flex
        items-center
        gap-4
        px-4
        py-4
        ${
          last
            ? ""
            : "border-b border-white/[0.06]"
        }
      `}
    >
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-white/[0.06]
          bg-white/[0.04]
        "
      >
        <Icon
          className="
            h-4
            w-4
            text-[#D4AF37]
          "
        />
      </div>

      <div className="min-w-0 flex-1">

        <p
          className="
            text-xs
            uppercase
            tracking-[0.12em]
            text-white/30
          "
        >
          {label}
        </p>

        <p
          className="
            mt-1
            truncate
            text-sm
            font-semibold
            text-white/80
          "
        >
          {value}
        </p>

      </div>
    </div>
  );
}