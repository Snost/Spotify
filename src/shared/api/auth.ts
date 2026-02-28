const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    credentials: 'include',
  })

  // success
  if (res.ok) {
    // інколи бек може повертати 204
    if (res.status === 204) return undefined as T
    return (await res.json()) as T
  }

  // error
  let payload: any = null
  try {
    payload = await res.json()
  } catch {
    // ignore
  }

  // витягуємо нормальний текст помилки
  const msg =
    payload?.errors?.request?.[0] ||
    payload?.errors?.email?.[0] ||
    payload?.title ||
    payload?.detail ||
    `HTTP ${res.status}`

  throw new Error(msg)
}

export type TokenResponse = { accessToken: string }

export function login(dto: { email: string; password: string }) {
  // бек очікує { email, password }
  return request<TokenResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: dto.email,
      password: dto.password,
    }),
  })
}

export function register(dto: { email: string; password: string; displayName: string }) {
  // бек очікує плоский JSON
  return request<TokenResponse>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: dto.email,
      password: dto.password,
      displayName: dto.displayName,
      birthDate: '2000-01-01T00:00:00+00:00',
      gender: 'Female',
    }),
  })
}

// якщо в тебе refresh/logout НЕ в /api/v1, скажеш — замінимо шлях
export function refresh() {
  return request<TokenResponse>('/api/v1/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({}),
  })
}

export function logout(accessToken: string) {
  return request<void>('/api/v1/auth/logout', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({}),
  })
}