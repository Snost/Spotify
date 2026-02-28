import { apiFetch } from '@/lib/api'
import { tokenStore } from '@/lib/tokenStore'

const AUTH_PREFIX = process.env.NEXT_PUBLIC_AUTH_PREFIX ?? '/api/v1/auth'

export type LoginDto = {
  email: string
  password: string
}

export type RegisterDto = {
  email: string
  password: string
  displayName: string
  birthDate: string // yyyy-mm-dd from input
  gender: 'Male' | 'Female' | 'Other'
}

type TokenResponse = { accessToken: string }

export async function login(dto: LoginDto) {
  // бек може очікувати або {request:{...}} або просто {...}
  const data = await apiFetch<TokenResponse>(`${AUTH_PREFIX}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    skipAuth: true,
    body: JSON.stringify({ request: dto }),
  })

  tokenStore.set(data.accessToken)
  return data
}

export async function registerUser(dto: RegisterDto) {
  const payload = {
    request: {
      ...dto,
      birthDate: new Date(dto.birthDate).toISOString(), // ISO для DateTimeOffset
    },
  }

  const data = await apiFetch<TokenResponse>(`${AUTH_PREFIX}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    skipAuth: true,
    body: JSON.stringify(payload),
  })

  tokenStore.set(data.accessToken)
  return data
}

export async function logout() {
  // бекер казав: просто Authorization header + він почистить refresh cookie
  await apiFetch(`${AUTH_PREFIX}/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  tokenStore.set(null)
  return { ok: true }
}

// Email verification
export async function verifyEmail(code: string) {
  return apiFetch(`${AUTH_PREFIX}/email/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    skipAuth: true,
    body: JSON.stringify({ request: { code } }),
  })
}

// Phone verification
export async function sendPhoneCode(phoneNumber: string) {
  return apiFetch(`${AUTH_PREFIX}/phone/send-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    skipAuth: true,
    body: JSON.stringify({ request: { phoneNumber } }),
  })
}

export async function verifyPhone(code: string) {
  return apiFetch(`${AUTH_PREFIX}/phone/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    skipAuth: true,
    body: JSON.stringify({ request: { code } }),
  })
}