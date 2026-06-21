const API_URL =
  process.env
    .NEXT_PUBLIC_API_URL
    ?.replace(/\/$/, "");

export async function getMyOrganization(
  token: string
) {
  const response =
    await fetch(
      `${API_URL}/organizations/me`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.json();
}

export async function createOrganization(
  token: string,
  name: string,
  slug: string
) {
  const response =
    await fetch(
      `${API_URL}/organizations`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization:
            `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          slug,
        }),
      }
    );

  return response.json();
}