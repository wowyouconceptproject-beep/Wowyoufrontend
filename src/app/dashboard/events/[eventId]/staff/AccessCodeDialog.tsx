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

import { Button } from "@/components/ui/button";

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
      await navigator.clipboard
        .writeText(code);

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
      <DialogContent>

        <div className="w-full max-w-lg">

          {/* Header */}

          <DialogHeader>

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10">

                <UserRound className="h-5 w-5 text-[#D4AF37]" />

              </div>

              <div className="min-w-0 flex-1">

                <DialogTitle>
                  {staff.name}
                </DialogTitle>

                <div className="mt-2 flex flex-wrap items-center gap-2">

                  <span className="text-sm text-muted-foreground">
                    {formattedRole}
                  </span>

                  <span className="text-muted-foreground/30">
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
                          ? "border-red-500/20 bg-red-500/10 text-red-500"
                          : staff.isActive
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                            : "border-border bg-muted text-muted-foreground"
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
                            ? "bg-red-500"
                            : staff.isActive
                              ? "bg-emerald-500"
                              : "bg-muted-foreground"
                        }
                      `}
                    />

                    {statusLabel}

                  </span>

                </div>

              </div>

            </div>

          </DialogHeader>

          <div className="mt-7 space-y-6">

            {/* Access Credential */}

            <section className="overflow-hidden rounded-3xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.04]">

              <div className="flex items-center gap-3 border-b border-[#D4AF37]/10 px-5 py-4">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4AF37]/10">

                  <KeyRound className="h-4 w-4 text-[#D4AF37]" />

                </div>

                <div>

                  <p className="text-sm font-semibold">
                    Staff Access Code
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Used to access event operations.
                  </p>

                </div>

              </div>

              <div className="px-5 py-7 text-center">

                <p className="break-all font-mono text-3xl font-black tracking-[0.22em] sm:text-4xl">
                  {code}
                </p>

              </div>

              <div className="grid grid-cols-2 border-t border-[#D4AF37]/10">

                <button
                  type="button"
                  onClick={
                    copyCode
                  }
                  className="flex min-h-12 items-center justify-center gap-2 border-r border-[#D4AF37]/10 px-4 text-sm font-semibold transition hover:bg-[#D4AF37]/10"
                >

                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-500" />

                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />

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
                  className="flex min-h-12 items-center justify-center gap-2 px-4 text-sm font-semibold transition hover:bg-[#D4AF37]/10 disabled:cursor-not-allowed disabled:opacity-40"
                >

                  <RefreshCw
                    className={`h-4 w-4 ${
                      pending
                        ? "animate-spin"
                        : ""
                    }`}
                  />

                  Regenerate

                </button>

              </div>

            </section>

            {/* Staff Details */}

            <section>

              <div className="mb-3 flex items-center gap-2">

                <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />

                <h3 className="text-sm font-bold">
                  Staff Details
                </h3>

              </div>

              <div className="overflow-hidden rounded-2xl border">

                <DetailRow
                  icon={
                    MapPin
                  }
                  label="Station"
                  value={
                    staff.station ??
                    "Not assigned"
                  }
                />

                <DetailRow
                  icon={
                    Phone
                  }
                  label="Phone"
                  value={
                    staff.phone ??
                    "Not provided"
                  }
                />

                <DetailRow
                  icon={
                    Mail
                  }
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

              <p className="mb-3 text-sm font-bold">
                Permissions
              </p>

              {staff.permissions
                .length >
              0 ? (

                <div className="flex flex-wrap gap-2">

                  {staff.permissions.map(
                    (
                      permission
                    ) => (
                      <span
                        key={
                          permission
                        }
                        className="rounded-full border bg-muted/30 px-3 py-1.5 text-xs font-medium text-muted-foreground"
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

                <p className="text-sm text-muted-foreground">
                  No permissions assigned.
                </p>

              )}

            </section>

            {/* Last Activity */}

            {staff.lastUsedAt && (

              <div className="flex items-center justify-between border-t pt-5">

                <span className="text-sm text-muted-foreground">
                  Last access
                </span>

                <span className="text-sm font-medium">
                  {new Date(
                    staff.lastUsedAt
                  ).toLocaleString()}
                </span>

              </div>

            )}

            {/* Danger Zone */}

            <section className="rounded-2xl border border-red-500/15 bg-red-500/[0.03] p-4">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-sm font-semibold">
                    Disable staff access
                  </p>

                  <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                    This staff member will no longer be able to access event operations.
                  </p>

                </div>

                <Button
                  variant="destructive"
                  disabled={
                    pending ||
                    staff.isRevoked
                  }
                  onClick={
                    disable
                  }
                >

                  <Ban className="mr-2 h-4 w-4" />

                  {staff.isRevoked
                    ? "Disabled"
                    : "Disable"}

                </Button>

              </div>

            </section>

          </div>

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
      className={`flex items-center gap-4 px-4 py-4 ${
        last
          ? ""
          : "border-b"
      }`}
    >

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted">

        <Icon className="h-4 w-4 text-muted-foreground" />

      </div>

      <div className="min-w-0 flex-1">

        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-semibold">
          {value}
        </p>

      </div>

    </div>
  );
}