import axios from 'axios'

function getAccessTokenFromStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = window.localStorage.getItem('auth')
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw)
    return parsed?.state?.accessToken ?? null
  } catch {
    return null
  }
}

function setAccessTokenInStorage(accessToken: string | null) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const raw = window.localStorage.getItem('auth')
    if (!raw) {
      return
    }

    const parsed = JSON.parse(raw)
    const next = {
      ...parsed,
      state: {
        ...parsed.state,
        accessToken,
      },
    }

    window.localStorage.setItem('auth', JSON.stringify(next))
  } catch {
    // ignore
  }
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  withCredentials: true,
})

const refreshClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessTokenFromStorage()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true

  refreshPromise = refreshClient
    .post('/api/v1/auth/refresh')
    .then((response) => {
      const newAccessToken =
        response.data?.accessToken ??
        response.data?.token ??
        response.data?.access_token ??
        null

      if (newAccessToken) {
        setAccessTokenInStorage(newAccessToken)
        return newAccessToken
      }

      return null
    })
    .catch(() => {
      setAccessTokenInStorage(null)
      return null
    })
    .finally(() => {
      isRefreshing = false
      refreshPromise = null
    })

  return refreshPromise
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (!originalRequest) {
      return Promise.reject(error)
    }

    const status = error.response?.status

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const newAccessToken = await refreshAccessToken()

      if (newAccessToken) {
        originalRequest.headers = originalRequest.headers ?? {}
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      }
    }

    return Promise.reject(error)
  },
)