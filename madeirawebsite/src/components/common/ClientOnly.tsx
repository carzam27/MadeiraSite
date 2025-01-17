'use client'

import { useEffect, useState, type PropsWithChildren } from 'react'

export function ClientOnly({ children }: PropsWithChildren) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? <>{children}</> : null
}