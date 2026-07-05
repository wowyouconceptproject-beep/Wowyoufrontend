const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(
    /\/$/,
    ""
  );

if (!API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not configured."
  );
}

export interface ApiFetchOptions
  extends Omit<
    RequestInit,
    "headers"
  > {
  headers?: HeadersInit;

  /**
   * Attach Authorization header.
   * Default: true
   */
  withAuth?: boolean;
}

export async function apiFetch<
  T = any
>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const {
    withAuth = true,
    headers: customHeaders,
    ...fetchOptions
  } = options;

  const token =
    typeof window !==
    "undefined"
      ? localStorage.getItem(
          "token"
        )
      : null;

  const headers =
    new Headers(
      customHeaders
    );

  if (
    !(
      fetchOptions.body instanceof
      FormData
    ) &&
    !headers.has(
      "Content-Type"
    )
  ) {
    headers.set(
      "Content-Type",
      "application/json"
    );
  }

  if (
    withAuth &&
    token
  ) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  const response =
    await fetch(
      `${API_URL}${endpoint}`,
      {
        ...fetchOptions,
        headers,
      }
    );

  if (!response.ok) {
    let message =
      "Request failed.";

    try {
      const body =
        await response.json();

      message =
        body.message ??
        body.error ??
        message;
    } catch {}

    throw new Error(
      message
    );
  }

  if (
    response.status === 204
  ) {
    return {} as T;
  }

  const contentType =
    response.headers.get(
      "content-type"
    );

  if (
    !contentType?.includes(
      "application/json"
    )
  ) {
    return {} as T;
  }

  return response.json();
}