import { useAuth } from "@/features/auth/model/auth-context";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

type ApiFetchOptions = RequestInit & {
  auth?: boolean; // додати Authorization автоматично
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    // refresh cookie HttpOnly -> треба include
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }

  // на випадок 204
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/**
 * Client-side helper: додає Bearer токен
 * (використовуй у хуках/мутаціях)
 */
export function useAuthedFetch() {
  const { accessToken } = useAuth();

  return async function authedFetch<T>(path: string, options: ApiFetchOptions = {}) {
    const headers = new Headers(options.headers);

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return apiFetch<T>(path, { ...options, headers });
  };
}
