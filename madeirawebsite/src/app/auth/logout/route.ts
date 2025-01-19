import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const cookieStore = await cookies()
  
  // Limpiar todas las cookies relacionadas con la sesión
  const cookiesToClear = [
    'next-auth.session-token',
    'next-auth.csrf-token',
    'next-auth.callback-url',
    '__Secure-next-auth.session-token',
    '__Secure-next-auth.callback-url',
    '__Host-next-auth.csrf-token'
  ]

  cookiesToClear.forEach(name => {
    cookieStore.delete(name)
  })

  return NextResponse.json({ success: true })
}