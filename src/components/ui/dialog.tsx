"use client";

import { ReactNode } from "react";

interface DialogProps {
  open: boolean;

  onOpenChange(
    open: boolean
  ): void;

  children: ReactNode;
}

interface DialogContentProps {
  children: ReactNode;

  className?: string;
}

export function Dialog({
  open,
  onOpenChange,
  children,
}: DialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">

      <div
        className="absolute inset-0 bg-black/50"
        onClick={() =>
          onOpenChange(false)
        }
      />

      <div className="relative flex min-h-screen items-center justify-center p-6">
        {children}
      </div>

    </div>
  );
}

export function DialogContent({
  children,
  className = "",
}: DialogContentProps) {
  return (
    <div
      onClick={(e) =>
        e.stopPropagation()
      }
      className={`w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl ${className}`}
    >
      {children}
    </div>
  );
}

export function DialogHeader({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mb-6">
      {children}
    </div>
  );
}

export function DialogTitle({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <h2 className="text-2xl font-bold">
      {children}
    </h2>
  );
}

export function DialogFooter({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mt-8 flex justify-end gap-3">
      {children}
    </div>
  );
}