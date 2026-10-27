
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

export interface RegisterResponse {
  success: boolean;
  token?: string;
  user: User;
  requiresEmailVerification?: boolean;
  message?: string;
}

export interface LoginResponse {
  success: boolean;
  requiresEmailVerification?: boolean;
  requiresOtp?: boolean;
  token?: string;
  user?: User;
  email?: string;
  message?: string;
}

export interface VerifyLoginOtpPayload {
  email: string;
  otp: string;
}

export interface VerifyLoginOtpResponse {
  success: boolean;
  token?: string;
  user: User;
  message?: string;
}

export interface ResendLoginOtpResponse {
  success: boolean;
  message?: string;
}

export interface ResendVerificationEmailResponse {
  success: boolean;
  message?: string;
}

export interface CurrentUserResponse {
  success: boolean;
  user: User;
  message?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
}

export interface VerifyResetCodePayload {
  email: string;
  code: string;
}

export interface VerifyResetCodeResponse {
  success: boolean;
  resetToken?: string;
  message?: string;
}

export interface ResetPasswordPayload {
  email: string;
  resetToken: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}

export function registerUser(data: RegisterPayload) {
  return apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    withAuth: false,
    headers: { "X-Auth-Mode": "cookie" },
    body: JSON.stringify(data),
  });
}

export function loginUser(email: string, password: string) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    withAuth: false,
    body: JSON.stringify({ email, password }),
  });
}

export function verifyLoginOtp(data: VerifyLoginOtpPayload) {
  return apiFetch<VerifyLoginOtpResponse>("/auth/verify-login-otp", {
    method: "POST",
    withAuth: false,
    headers: { "X-Auth-Mode": "cookie" },
    body: JSON.stringify(data),
  });
}

export function resendLoginOtp(email: string) {
  return apiFetch<ResendLoginOtpResponse>("/auth/resend-login-otp", {
    method: "POST",
    withAuth: false,
    body: JSON.stringify({ email }),
  });
}

export function resendVerificationEmail(email: string) {
  return apiFetch<ResendVerificationEmailResponse>(
    "/auth/resend-verification",
    {
      method: "POST",
      withAuth: false,
      body: JSON.stringify({ email }),
    },
  );
}

export function getCurrentUser() {
  return apiFetch<CurrentUserResponse>("/auth/me");
}

export async function logoutUser(): Promise<void> {
  try {
    await apiFetch<{ success: boolean; message?: string }>("/auth/logout", {
      method: "POST",
      withAuth: true,
    });
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("wowyou_token");
      localStorage.removeItem("wowyou_user");
    }
  }
}

export function forgotPassword(data: ForgotPasswordPayload) {
  return apiFetch<ForgotPasswordResponse>("/auth/forgot-password", {
    method: "POST",
    withAuth: false,
    body: JSON.stringify(data),
  });
}

export function verifyResetCode(data: VerifyResetCodePayload) {
  return apiFetch<VerifyResetCodeResponse>("/auth/verify-reset-code", {
    method: "POST",
    withAuth: false,
    body: JSON.stringify(data),
  });
}

export function resetPassword(data: ResetPasswordPayload) {
  return apiFetch<ResetPasswordResponse>("/auth/reset-password", {
    method: "POST",
    withAuth: false,
    body: JSON.stringify(data),
  });
}
