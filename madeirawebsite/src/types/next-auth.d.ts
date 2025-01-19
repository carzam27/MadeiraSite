// src/types/next-auth.d.ts
import 'next-auth'
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      permissions: string[]
      status: string  // Agregamos status
    } & DefaultSession['user']
  }

  interface User {
    id: string
    role: string
    permissions: string[]
    status: string  // Agregamos status
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    permissions: string[]
    status: string  // Agregamos status
    refreshToken?: string // Agregamos el refreshToken al tipo JWT
  }
}