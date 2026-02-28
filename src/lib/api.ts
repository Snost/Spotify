import { tokenStore } from '@/lib/tokenStore'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:5000'
const AUTH_PREFIX = process.env.NEXT_PUBLIC_AUTH_PREFIX ?? '/api/v1/auth'

type FetchOptions = RequestInit & { skipAuth?: boolean }

export async function apiFetch<T = unknown>(path: string, options: FetchOptions = {}): Promise<T> {
  const headers = new Headers(options.headers)

  if (!options.skipAuth) {
    const token = tokenStore.get()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  if (res.status === 401 && !options.skipAuth) {
    const refreshed = await tryRefresh()
    if (refreshed) {
      const retryHeaders = new Headers(options.headers)
      const token = tokenStore.get()
      if (token) retryHeaders.set('Authorization', `Bearer ${token}`)

      const retryRes = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: retryHeaders,
        credentials: 'include',
      })

      if (!retryRes.ok) throw await toError(retryRes)
      return (await retryRes.json()) as T
    }
  }

  if (!res.ok) throw await toError(res)
  return (await res.json()) as T
}

async function tryRefresh() {
  try {
    const res = await fetch(`${API_BASE}${AUTH_PREFIX}/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!res.ok) return false

    const data = (await res.json()) as { accessToken: string }
    tokenStore.set(data.accessToken)
    return true
  } catch {
    return false
  }
}

async function toError(res: Response) {
  let message = `Request failed (${res.status})`
  try {
    const body = await res.json()
    if ((body as any)?.title) message = (body as any).title
    if ((body as any)?.detail) message = (body as any).detail
    if ((body as any)?.message) message = (body as any).message
  } catch {}
  return new Error(message)
}