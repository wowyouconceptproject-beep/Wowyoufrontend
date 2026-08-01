import { getEventUrl } from "./event-url";

interface ShareEvent {
  title: string;
  id: string;
  description?: string;
}

export function buildShareLinks(
  event: ShareEvent
) {
 const url = getEventUrl(event.id);

  return {
    url,

    whatsapp: `https://wa.me/?text=${encodeURIComponent(
      `${event.title}\n${url}`
    )}`,

    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`,

    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      event.title
    )}&url=${encodeURIComponent(url)}`,

    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`,

    email: `mailto:?subject=${encodeURIComponent(
      event.title
    )}&body=${encodeURIComponent(
      `${event.title}\n\n${url}`
    )}`,
  };
}