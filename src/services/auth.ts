
import { apiFetch } from "@/lib/api";

/*
|--------------------------------------------------------------------------
| Register Payload
|--------------------------------------------------------------------------
*/

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

/*
|--------------------------------------------------------------------------
| User
|--------------------------------------------------------------------------
*/

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
| Forgot Password
|--------------------------------------------------------------------------
*/

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
}

/*
|--------------------------------------------------------------------------
| Verify Password Reset Code
|--------------------------------------------------------------------------
*/

export interface VerifyResetCodePayload {
  email: string;
  code: string;
}

export interface VerifyResetCodeResponse {
  success: boolean;
  resetToken?: string;
  message?: string;
}

/*
|--------------------------------------------------------------------------
| Reset Password
|--------------------------------------------------------------------------
*/

export interface ResetPasswordPayload {
  email: string;
  resetToken: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}

/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
*/

export function registerUser(data: RegisterPayload) {
  return apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    withAuth: false,
    body: JSON.stringify(data),
  });
}

/*
|--------------------------------------------------------------------------
| Login User
|--------------------------------------------------------------------------
*/

export function loginUser(email: string, password: string) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    withAuth: false,
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

/*
|--------------------------------------------------------------------------
| Verify Login OTP
|--------------------------------------------------------------------------
*/

export function verifyLoginOtp(data: VerifyLoginOtpPayload) {
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

export function resendLoginOtp(email: string) {
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

export function resendVerificationEmail(email: string) {
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
  return apiFetch<CurrentUserResponse>("/auth/me");
}

/*
|--------------------------------------------------------------------------
| Request Password Reset Code
|--------------------------------------------------------------------------
*/

export function forgotPassword(data: ForgotPasswordPayload) {
  return apiFetch<ForgotPasswordResponse>(
    "/auth/forgot-password",
    {
      method: "POST",
      withAuth: false,
      body: JSON.stringify(data),
    },
  );
}

/*
|--------------------------------------------------------------------------
| Verify Password Reset Code
|--------------------------------------------------------------------------
*/

export function verifyResetCode(data: VerifyResetCodePayload) {
  return apiFetch<VerifyResetCodeResponse>(
    "/auth/verify-reset-code",
    {
      method: "POST",
      withAuth: false,
      body: JSON.stringify(data),
    },
  );
}

/*
|--------------------------------------------------------------------------
| Submit New Password
|--------------------------------------------------------------------------
*/

export function resetPassword(data: ResetPasswordPayload) {
  return apiFetch<ResetPasswordResponse>(
    "/auth/reset-password",
    {
      method: "POST",
      withAuth: false,
      body: JSON.stringify(data),
    },
  );
}
