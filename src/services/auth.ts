const API_URL =
process.env
.NEXT_PUBLIC_API_URL;

export async function registerUser(
data: {
firstName: string;
lastName: string;
email: string;
password: string;
role: string;
}
) {
const response =
await fetch(
`${API_URL}/auth/register`,
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

export async function loginUser(
email: string,
password: string
) {
const response =
await fetch(
`${API_URL}/auth/login`,
{
method: "POST",
headers: {
"Content-Type":
"application/json",
},
body: JSON.stringify({
email,
password,
}),
}
);

const data =
await response.json();

console.log(
"LOGIN API:",
data
);

return data;
}
