const API_URL =
  process.env
    .NEXT_PUBLIC_API_URL
    ?.replace(/\/$/, "");

export async function createEvent(
  token: string,
  data: any
) {
  const response =
    await fetch(
      `${API_URL}/events`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization:
            `Bearer ${token}`,
        },
        body: JSON.stringify(
          data
        ),
      }
    );

  return response.json();
}

export async function getMyEvents(
  token: string
) {
  const response =
    await fetch(
      `${API_URL}/events/my`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.json();
}

export async function getEvent(
  token: string,
  id: string
) {
  const response =
    await fetch(
      `${API_URL}/events/${id}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.json();
}

export async function publishEvent(
  token: string,
  id: string
) {
  const response =
    await fetch(
      `${API_URL}/events/${id}/publish`,
      {
        method: "PATCH",
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.json();
}