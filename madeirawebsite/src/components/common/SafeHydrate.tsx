'use client'

import { useLayoutEffect, useState, type PropsWithChildren } from 'react'

export function SafeHydrate({ children }: PropsWithChildren) {
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? (
    <div suppressHydrationWarning>{children}</div>
  ) : null
}