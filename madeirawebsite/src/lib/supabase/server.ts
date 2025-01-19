// src/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            console.error('Error setting cookie:', name, error)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // Forzar expiración inmediata
            cookieStore.set({ 
              name, 
              value: '', 
              ...options,
              maxAge: 0,
              expires: new Date(0),
            })
          } catch (error) {
            console.error('Error removing cookie:', name, error)
          }
        },
      },
    }
  )
}

// Función helper para limpiar todas las cookies de Supabase
export async function clearSupabaseCookies() {
  const cookieStore = await cookies()
  const supabaseCookies = [
    'sb-access-token',
    'sb-refresh-token',
    'supabase-auth-token'
  ]

  for (const name of supabaseCookies) {
    try {
      cookieStore.set({
        name,
        value: '',
        maxAge: 0,
        expires: new Date(0),
        path: '/'
      })
    } catch (error) {
      console.error(`Error clearing cookie: ${name}`, error)
    }
  }
}