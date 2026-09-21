import { apiFetch } from "@/lib/api";

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

/*
|--------------------------------------------------------------------------
| Register Response
|--------------------------------------------------------------------------
|
| Registration always returns a user.
|
*/

export interface RegisterResponse {
  success: boolean;
  token: string;
  user: User;
  requiresEmailVerification?: boolean;
  message?: string;
}

/*
|--------------------------------------------------------------------------
| Login Response
|--------------------------------------------------------------------------
|
| Login can have two possible outcomes:
|
| 1. Email is not verified
|    -> requiresEmailVerification
|
| 2. Email is verified
|    -> requiresOtp
|
| JWT is only returned after OTP verification.
|
*/

export interface LoginResponse {
  success: boolean;
  requiresEmailVerification?: boolean;
  requiresOtp?: boolean;
  token?: string;
  user?: User;
  email?: string;
  message?: string;
}

/*
|--------------------------------------------------------------------------
| Verify Login OTP
|--------------------------------------------------------------------------
*/

export interface VerifyLoginOtpPayload {
  email: string;
  otp: string;
}

export interface VerifyLoginOtpResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

/*
|--------------------------------------------------------------------------
| Resend Login OTP
|--------------------------------------------------------------------------
*/

export interface ResendLoginOtpResponse {
  success: boolean;
  message?: string;
}

/*
|--------------------------------------------------------------------------
| Resend Email Verification
|--------------------------------------------------------------------------
*/

export interface ResendVerificationEmailResponse {
  success: boolean;
  message?: string;
}

/*
|--------------------------------------------------------------------------
| Current User
|--------------------------------------------------------------------------
*/

export interface CurrentUserResponse {
  success: boolean;
  user: User;
  message?: string;
}

/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
*/

export function registerUser(
  data: RegisterPayload,
) {
  return apiFetch<RegisterResponse>(
    "/auth/register",
    {
      method: "POST",
      withAuth: false,
      body: JSON.stringify(data),
    },
  );
}

/*
|--------------------------------------------------------------------------
| Login User
|--------------------------------------------------------------------------
*/

export function loginUser(
  email: string,
  password: string,
) {
  return apiFetch<LoginResponse>(
    "/auth/login",
    {
      method: "POST",
      withAuth: false,
      body: JSON.stringify({
        email,
        password,
      }),
    },
  );
}

/*
|--------------------------------------------------------------------------
| Verify Login OTP
|--------------------------------------------------------------------------
*/

export function verifyLoginOtp(
  data: VerifyLoginOtpPayload,
) {
  return apiFetch<VerifyLoginOtpResponse>(
    "/auth/verify-login-otp",
    {
      method: "POST",
      withAuth: false,
      body: JSON.stringify(data),
    },
  );
}

/*
|--------------------------------------------------------------------------
| Resend Login OTP
|--------------------------------------------------------------------------
*/

export function resendLoginOtp(
  email: string,
) {
  return apiFetch<ResendLoginOtpResponse>(
    "/auth/resend-login-otp",
    {
      method: "POST",
      withAuth: false,
      body: JSON.stringify({
        email,
      }),
    },
  );
}

/*
|--------------------------------------------------------------------------
| Resend Email Verification
|--------------------------------------------------------------------------
*/

export function resendVerificationEmail(
  email: string,
) {
  return apiFetch<ResendVerificationEmailResponse>(
    "/auth/resend-verification",
    {
      method: "POST",
      withAuth: false,
      body: JSON.stringify({
        email,
      }),
    },
  );
}

/*
|--------------------------------------------------------------------------
| Current User
|--------------------------------------------------------------------------
*/

export function getCurrentUser() {
  return apiFetch<CurrentUserResponse>(
    "/auth/me",
  );
}