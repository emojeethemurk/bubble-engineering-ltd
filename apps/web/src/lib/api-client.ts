const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface LoginResponse {
  requiresTwoFactor: boolean;
  user?: { id: string; email: string; firstName: string; lastName: string; role: string; permissions: string[] };
}

async function parseError(res: Response) {
  const body = await res.json().catch(() => ({}));
  const message = Array.isArray(body.message) ? body.message.join(", ") : body.message;
  return message ?? `Request failed (${res.status})`;
}

export async function sessionFetch(path: string, init: RequestInit = {}) {
  const request = () => fetch(`${API_URL}${path}`, { ...init, credentials: "include" });
  let response = await request();
  if (response.status === 401 && !path.startsWith("/api/v1/auth/")) {
    const refresh = await fetch(`${API_URL}/api/v1/auth/refresh`, { method: "POST", credentials: "include" });
    if (refresh.ok) response = await request();
  }
  return response;
}

export async function loginRequest(payload: { email: string; password: string; rememberMe?: boolean; twoFactorCode?: string }): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/api/v1/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function logoutRequest() {
  const res = await fetch(`${API_URL}/api/v1/auth/logout`, { method: "POST", credentials: "include" });
  if (!res.ok) throw new Error(await parseError(res));
}

export async function meRequest<T>() {
  const res = await sessionFetch("/api/v1/auth/me");
  if (!res.ok) throw new Error(await parseError(res));
  return res.json() as Promise<T>;
}
