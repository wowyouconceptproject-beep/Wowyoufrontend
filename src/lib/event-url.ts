export function getEventUrl(eventId: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    window.location.origin;

  return `${baseUrl}/events/${eventId}`;
}