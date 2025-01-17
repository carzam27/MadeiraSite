// src/lib/auth/types.ts
export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
  permissions: string[]
}

export interface RefreshToken {
  id: string
  token: string
  user_id: string
  device_id: string
  expires_at: string
  created_at?: string
  last_used_at?: string | null
  user_agent?: string | null
  ip_address?: string | null
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}