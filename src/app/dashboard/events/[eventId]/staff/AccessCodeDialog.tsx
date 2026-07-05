"use client";

import { useState, useTransition } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  Copy,
  RefreshCw,
  Ban,
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
  const [pending, startTransition] =
    useTransition();

  const [code, setCode] =
    useState(staff.accessCode);

  async function regenerate() {
    startTransition(async () => {
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
      }
    });
  }

  async function disable() {
    startTransition(async () => {
      await disableStaff(
        staff.id,
        eventId
      );

      onOpenChange(false);
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="max-w-lg">

        <DialogHeader>

          <DialogTitle>
            {staff.name}
          </DialogTitle>

        </DialogHeader>

        <div className="space-y-6">

          <div>

            <div className="text-sm text-muted-foreground">
              Role
            </div>

            <div className="font-semibold">
              {staff.role.replaceAll(
                "_",
                " "
              )}
            </div>

          </div>

          <div>

            <div className="text-sm text-muted-foreground">
              Station
            </div>

            <div className="font-semibold">
              {staff.station ??
                "-"}
            </div>

          </div>

          <div>

            <div className="text-sm text-muted-foreground">
              Phone
            </div>

            <div>
              {staff.phone ??
                "-"}
            </div>

          </div>

          <div>

            <div className="text-sm text-muted-foreground">
              Email
            </div>

            <div>
              {staff.email ??
                "-"}
            </div>

          </div>

          <div>

            <div className="text-sm text-muted-foreground mb-2">
              Access Code
            </div>

            <div className="rounded-xl border p-4 text-center text-2xl font-black tracking-widest">
              {code}
            </div>

          </div>

          <div className="space-y-2">

            <Button
              className="w-full"
              onClick={() =>
                navigator.clipboard.writeText(
                  code
                )
              }
            >
              <Copy className="mr-2 h-4 w-4" />

              Copy Access Code
            </Button>

            <Button
              variant="outline"
              className="w-full"
              disabled={
                pending
              }
              onClick={
                regenerate
              }
            >
              <RefreshCw className="mr-2 h-4 w-4" />

              Regenerate Code
            </Button>

            <Button
              variant="destructive"
              className="w-full"
              disabled={
                pending
              }
              onClick={
                disable
              }
            >
              <Ban className="mr-2 h-4 w-4" />

              Disable Staff
            </Button>

          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}