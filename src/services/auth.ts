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

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface CurrentUserResponse {
  success: boolean;
  user: User;
  message?: string;
}

export function registerUser(
  data: RegisterPayload
) {
  return apiFetch<LoginResponse>(
    "/auth/register",
    {
      method: "POST",
      withAuth: false,
      body: JSON.stringify(data),
    }
  );
}

export function loginUser(
  email: string,
  password: string
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
    }
  );
}

export function getCurrentUser() {
  return apiFetch<CurrentUserResponse>(
    "/auth/me"
  );
}