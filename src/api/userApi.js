const API_URL = import.meta.env.VITE_API_URL;

export async function userExists(tgId) {
  const res = await fetch(`${API_URL}/users/${tgId}/exists`);
  if (!res.ok) throw new Error('exists failed');
  return res.json(); // { exists: true/false }
}

export async function createUser(data) {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(t);
  }

  return res.json();
}

export async function getUser(tgId) {
  const res = await fetch(`${API_URL}/users/${tgId}`);
  if (!res.ok) throw new Error('get user failed');
  return res.json();
}
