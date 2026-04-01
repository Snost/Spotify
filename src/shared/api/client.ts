import axios from 'axios'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:5000/api/v1',
  withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const rawAuth = localStorage.getItem('auth')

    if (rawAuth) {
      try {
        const parsed = JSON.parse(rawAuth)
        const token = parsed?.state?.accessToken

        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch {}
    }
  }

  return config
})