
/**
 * JWT authentication helpers.
 * Tokens are stored in localStorage and remain valid for 7 days,
 * as configured by the backend.
 */

const TOKEN_KEY = "token";

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }

  if (!token) {
    clearToken();
    return;
  }

  localStorage.setItem(TOKEN_KEY, token);

  // Remove the legacy token key.
  localStorage.removeItem("wowyou_token");
}

export function clearToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("wowyou_token");
}
