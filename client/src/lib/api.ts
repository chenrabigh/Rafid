const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function apiGet<T>(path: string, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  if (!response.ok) {
    throw new Error(`GET ${path} failed: ${response.status}`);
  }

  return response.json();
}

export async function apiPost<T>(path: string, body: unknown, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`POST ${path} failed: ${response.status} - ${text}`);
  }

  return response.json();
}
export async function apiPatch<T>(path: string, body: unknown, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PATCH ${path} failed: ${response.status} - ${text}`);
  }

  return response.json();
}