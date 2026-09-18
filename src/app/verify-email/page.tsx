"use client";

import {
  useEffect,
  useState,
} from "react";

import { useSearchParams } from "next/navigation";

type VerificationStatus =
  | "loading"
  | "success"
  | "error";

export default function VerifyEmailPage() {
  const searchParams =
    useSearchParams();

  const [
    status,
    setStatus,
  ] =
    useState<VerificationStatus>(
      "loading",
    );

  const [
    message,
    setMessage,
  ] = useState(
    "Verifying your email...",
  );

  useEffect(() => {
    const token =
      searchParams.get("token");

    /*
    |--------------------------------------------------------------------------
    | Missing Token
    |--------------------------------------------------------------------------
    */

    if (!token) {
      setStatus("error");

      setMessage(
        "Verification token is missing.",
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Token Is Now Narrowed To String
    |--------------------------------------------------------------------------
    */

    const verificationToken =
      token;

    /*
    |--------------------------------------------------------------------------
    | Verify Email
    |--------------------------------------------------------------------------
    */

    async function verify() {
      try {
        const apiUrl =
          process.env
            .NEXT_PUBLIC_API_URL ||
          "http://127.0.0.1:5000";

        const response =
          await fetch(
            `${apiUrl}/api/auth/verify-email?token=${encodeURIComponent(
              verificationToken,
            )}`,
            {
              method:
                "GET",

              headers: {
                Accept:
                  "application/json",
              },
            },
          );

        /*
        |--------------------------------------------------------------------------
        | Parse Response
        |--------------------------------------------------------------------------
        */

        const data =
          await response.json();

        /*
        |--------------------------------------------------------------------------
        | API Error
        |--------------------------------------------------------------------------
        */

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Email verification failed.",
          );
        }

        /*
        |--------------------------------------------------------------------------
        | Success
        |--------------------------------------------------------------------------
        */

        setStatus(
          "success",
        );

        setMessage(
          "Your email has been verified successfully.",
        );
      } catch (error: unknown) {
        setStatus(
          "error",
        );

        setMessage(
          error instanceof Error
            ? error.message
            : "Email verification failed.",
        );
      }
    }

    verify();
  }, [searchParams]);

  /*
  |--------------------------------------------------------------------------
  | Page
  |--------------------------------------------------------------------------
  */

  return (
    <main
      style={{
        minHeight:
          "100vh",

        display:
          "flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        background:
          "#080808",

        color:
          "#ffffff",

        padding:
          "24px",

        boxSizing:
          "border-box",
      }}
    >
      <div
        style={{
          width:
            "100%",

          maxWidth:
            "480px",

          background:
            "#111111",

          border:
            "1px solid #242424",

          borderRadius:
            "18px",

          padding:
            "40px",

          textAlign:
            "center",

          boxSizing:
            "border-box",
        }}
      >
        {/* Logo */}

        <div
          style={{
            fontSize:
              "18px",

            fontWeight:
              800,

            letterSpacing:
              "0.16em",

            marginBottom:
              "32px",
          }}
        >
          WOWYOU
        </div>

        {/* Status Icon */}

        <div
          style={{
            width:
              "64px",

            height:
              "64px",

            margin:
              "0 auto 24px",

            borderRadius:
              "50%",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            background:
              status ===
              "success"
                ? "rgba(62, 134, 164, 0.15)"
                : status ===
                    "error"
                  ? "rgba(220, 80, 80, 0.12)"
                  : "rgba(255, 255, 255, 0.06)",

            border:
              status ===
              "success"
                ? "1px solid rgba(62, 134, 164, 0.35)"
                : status ===
                    "error"
                  ? "1px solid rgba(220, 80, 80, 0.25)"
                  : "1px solid #292929",

            fontSize:
              "28px",
          }}
        >
          {status ===
          "loading"
            ? "…"
            : status ===
                "success"
              ? "✓"
              : "!"
          }
        </div>

        {/* Heading */}

        <h1
          style={{
            fontSize:
              "28px",

            lineHeight:
              "1.2",

            margin:
              "0 0 16px",

            fontWeight:
              700,
          }}
        >
          {status ===
          "loading"
            ? "Verifying your email"
            : status ===
                "success"
              ? "Email verified"
              : "Verification failed"}
        </h1>

        {/* Message */}

        <p
          style={{
            color:
              "#999999",

            lineHeight:
              1.7,

            fontSize:
              "15px",

            margin:
              0,
          }}
        >
          {message}
        </p>

        {/* Success */}

        {status ===
          "success" && (
          <a
            href="/login"
            style={{
              display:
                "inline-block",

              marginTop:
                "28px",

              padding:
                "13px 20px",

              background:
                "#3E86A4",

              color:
                "#ffffff",

              textDecoration:
                "none",

              borderRadius:
                "10px",

              fontSize:
                "14px",

              fontWeight:
                700,
            }}
          >
            Continue to login
          </a>
        )}

        {/* Error */}

        {status ===
          "error" && (
          <a
            href="/login"
            style={{
              display:
                "inline-block",

              marginTop:
                "28px",

              padding:
                "13px 20px",

              background:
                "#3E86A4",

              color:
                "#ffffff",

              textDecoration:
                "none",

              borderRadius:
                "10px",

              fontSize:
                "14px",

              fontWeight:
                700,
            }}
          >
            Back to login
          </a>
        )}
      </div>
    </main>
  );
}