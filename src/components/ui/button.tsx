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
    /*
    |--------------------------------------------------------------------------
    | Primary
    |--------------------------------------------------------------------------
    | Main EventTech action.
    */

    primary:
      "bg-primary text-[#072933] hover:bg-primary-light",

    /*
    |--------------------------------------------------------------------------
    | Secondary
    |--------------------------------------------------------------------------
    | Elevated teal surface for secondary actions.
    */

    secondary:
      "bg-surface-elevated text-foreground hover:bg-surface-hover",

    /*
    |--------------------------------------------------------------------------
    | Outline
    |--------------------------------------------------------------------------
    | Transparent teal surface with a subtle cyan border.
    */

    outline:
      "border border-divider-strong bg-transparent text-foreground hover:bg-white/[0.06] hover:border-primary/40",

    /*
    |--------------------------------------------------------------------------
    | Danger
    |--------------------------------------------------------------------------
    */

    danger:
      "bg-danger text-white hover:bg-danger/90",

    /*
    |--------------------------------------------------------------------------
    | Destructive
    |--------------------------------------------------------------------------
    */

    destructive:
      "bg-danger text-white hover:bg-danger/90",
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
        transition-all
        duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-primary/50
        focus:ring-offset-2
        focus:ring-offset-background
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${styles[variant]}
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span
            className="
              h-4
              w-4
              animate-spin
              rounded-full
              border-2
              border-current/30
              border-t-current
            "
          />

          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}