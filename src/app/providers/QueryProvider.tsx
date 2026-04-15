'use client'

import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '@/shared/stores/auth.store'

function AuthBootstrap() {
  const tryRefresh = useAuthStore((s) => s.tryRefresh)

  React.useEffect(() => {
    void tryRefresh()
  }, [tryRefresh])

  return null
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(() => new QueryClient())

  return (
    <QueryClientProvider client={client}>
      <AuthBootstrap />
      {children}
    </QueryClientProvider>
  )
}