"use client";

import {
  ButtonHTMLAttributes,
} from "react";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "danger"
    | "destructive";

  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  loading = false,
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const styles = {
    primary:
      "bg-black text-white hover:bg-neutral-800",

    secondary:
      "bg-gray-100 text-gray-900 hover:bg-gray-200",

    outline:
      "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",

    danger:
      "bg-red-600 text-white hover:bg-red-700",

    destructive:
      "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      {...props}
      type={type}
      disabled={
        disabled || loading
      }
      className={`
        inline-flex
        items-center
        justify-center
        rounded-xl
        px-5
        py-3
        font-medium
        transition-colors
        duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-black
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${styles[variant]}
        ${className}
      `}
    >
      {loading ? (
        <span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}