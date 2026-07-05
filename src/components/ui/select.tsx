"use client";

import {
  SelectHTMLAttributes,
} from "react";

export function Select(
  props: SelectHTMLAttributes<HTMLSelectElement>
) {
  return (
    <select
      {...props}
      className={`
        w-full
        rounded-xl
        border
        px-4
        py-3
        ${props.className ?? ""}
      `}
    />
  );
}

export function SelectTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export function SelectValue() {
  return null;
}

export function SelectContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export function SelectItem({
  value,
  children,
}: {
  value: string;

  children: React.ReactNode;
}) {
  return (
    <option value={value}>
      {children}
    </option>
  );
}