const API_URL =
  process.env
    .NEXT_PUBLIC_API_URL
    ?.replace(/\/$/, "");

export async function createTicket(
  eventId: string,
  data: {
    name: string;
    price: number;
    quantity: number;
  }
) {
  const response =
    await fetch(
      `${API_URL}/tickets/${eventId}`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(
          data
        ),
      }
    );

  return response.json();
}

export async function getTickets(
  eventId: string
) {
  const response =
    await fetch(
      `${API_URL}/tickets/${eventId}`
    );

  return response.json();
}