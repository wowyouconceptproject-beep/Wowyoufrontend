export function getEventUrl(eventId: string) {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  return `${base}/events/${eventId}`;
}