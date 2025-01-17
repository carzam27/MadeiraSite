'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { useState, type PropsWithChildren, useEffect } from 'react'

export function Providers({ children }: PropsWithChildren) {
  // Crear una nueva instancia del queryClient para cada sesión
  const [queryClient] = useState(() => new QueryClient())
  // Estado para controlar el renderizado en el cliente
  const [mounted, setMounted] = useState(false)

  // Efecto para manejar el montaje
  useEffect(() => {
    setMounted(true)
  }, [])

  // No renderizar nada hasta que estemos en el cliente
  if (!mounted) return null

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  )
}