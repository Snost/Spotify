import { ApiError, mapApiError } from './error'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response

  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
      credentials: 'include',
    })
  } catch {
    throw new ApiError('Не вдалося підключитися до сервера')
  }

  if (res.ok) {
    if (res.status === 204) return undefined as T
    return (await res.json()) as T
  }

  let payload: any = null

  try {
    payload = await res.json()
  } catch {
    payload = null
  }

  throw mapApiError(payload, res.status)
}

export type TokenResponse = { accessToken: string }

export function login(dto: { email: string; password: string }) {
  return request<TokenResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: dto.email,
      password: dto.password,
    }),
  })
}

export function register(dto: {
  email: string
  password: string
  displayName: string
  birthDate: string
  gender: string
}) {
  return request<TokenResponse>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: dto.email,
      password: dto.password,
      displayName: dto.displayName,
      birthDate: dto.birthDate,
      gender: dto.gender,
    }),
  })
}

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