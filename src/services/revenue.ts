const API_URL =
  process.env
    .NEXT_PUBLIC_API_URL
    ?.replace(/\/$/, "");

export async function getRevenue(
  eventId: string
) {
  const response =
    await fetch(
      `${API_URL}/revenue/event/${eventId}`
    );

  return response.json();
}