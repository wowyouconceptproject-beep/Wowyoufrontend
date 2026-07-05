"use client";

import { useState } from "react";

import {
  MoreVertical,
  Shield,
  Smartphone,
} from "lucide-react";

import { AccessCodeDialog } from "./AccessCodeDialog";

interface Staff {
  id: string;

  name: string;

  phone?: string;

  email?: string;

  role: string;

  station?: string;

  accessCode: string;

  permissions: string[];

  isActive: boolean;

  isRevoked: boolean;

  online?: boolean;

  lastUsedAt?: string;
}

interface Props {
  eventId: string;

  staff: Staff;
}

function formatRole(
  role: string
) {
  return role
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase()
    );
}

export function StaffCard({
  eventId,
  staff,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const statusText =
    staff.isRevoked
      ? "Revoked"
      : staff.isActive
      ? "Active"
      : "Disabled";

  return (
    <>
      <div
        onClick={() =>
          setOpen(true)
        }
        className="
          cursor-pointer
          rounded-2xl
          border
          bg-white
          p-6
          shadow-sm
          transition-all
          hover:-translate-y-1
          hover:shadow-xl
        "
      >
        <div className="flex items-start justify-between">

          <div>

            <h3 className="text-lg font-bold">
              {staff.name}
            </h3>

            <p className="text-sm text-gray-500">
              {formatRole(
                staff.role
              )}
            </p>

          </div>

          <MoreVertical
            className="h-5 w-5 text-gray-400"
          />

        </div>

        <div className="mt-6 space-y-3">

          <div className="flex items-center justify-between">

            <span className="text-gray-500">
              Station
            </span>

            <span className="font-medium">
              {staff.station ??
                "-"}
            </span>

          </div>

          <div className="flex items-center justify-between">

            <span className="text-gray-500">
              Status
            </span>

            <div className="flex items-center gap-2">

              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  staff.online
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />

              <span
                className={
                  staff.isRevoked
                    ? "font-semibold text-red-500"
                    : staff.isActive
                    ? "font-semibold text-green-600"
                    : "font-semibold text-yellow-600"
                }
              >
                {staff.online
                  ? "Online"
                  : statusText}
              </span>

            </div>

          </div>

        </div>

        <div className="mt-6">

          <div className="mb-3 font-semibold">
            Permissions
          </div>

          {staff.permissions
            .length ===
          0 ? (

            <p className="text-sm text-gray-400">
              No permissions
              assigned.
            </p>

          ) : (

            <div className="space-y-2">

              {staff.permissions.map(
                (
                  permission
                ) => (

                  <div
                    key={
                      permission
                    }
                    className="flex items-center gap-2 text-sm"
                  >

                    <Shield
                      className="h-4 w-4 text-blue-500"
                    />

                    <span>
                      {formatRole(
                        permission
                      )}
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        <div className="mt-8 flex items-center gap-2 border-t pt-4">

          <Smartphone
            className="h-4 w-4 text-gray-400"
          />

          <span className="text-xs text-gray-500">

            {staff.lastUsedAt
              ? `Last active ${new Date(
                  staff.lastUsedAt
                ).toLocaleString()}`
              : "Never logged in"}

          </span>

        </div>

      </div>

      <AccessCodeDialog
        open={open}
        onOpenChange={
          setOpen
        }
        eventId={eventId}
        staff={staff}
      />
    </>
  );
}