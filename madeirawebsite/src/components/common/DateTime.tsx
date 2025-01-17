'use client'

import { ClientOnly } from './ClientOnly'

export function DateTime({ date }: { date: Date }) {
  return (
    <ClientOnly>
      <time dateTime={date.toISOString()}>
        {date.toLocaleDateString()}
      </time>
    </ClientOnly>
  )
}