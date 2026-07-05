"use server";

import { revalidatePath } from "next/cache";

export async function createStaff(
  eventId: string,
  data: {
    name: string;
    phone?: string;
    email?: string;
    role: string;
    station?: string;
  }
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/staff`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },

      body: JSON.stringify(
        data
      ),
    }
  );

  if (!res.ok) {
    throw new Error(
      "Unable to create staff."
    );
  }

  const result =
    await res.json();

  revalidatePath(
    `/dashboard/events/${eventId}/staff`
  );

  return result;
}

export async function regenerateCode(
  staffId: string,
  eventId: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/events/staff/${staffId}/regenerate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(
      "Unable to regenerate access code."
    );
  }

  const result =
    await res.json();

  revalidatePath(
    `/dashboard/events/${eventId}/staff`
  );

  return result;
}

export async function disableStaff(
  staffId: string,
  eventId: string
) {
  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/events/staff/${staffId}/disable`,
    {
      method: "PATCH",

      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    }
  );

  revalidatePath(
    `/dashboard/events/${eventId}/staff`
  );
}