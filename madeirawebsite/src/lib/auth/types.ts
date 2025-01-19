// src/lib/auth/types.ts
export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
  permissions: string[]
  status?: string
}

export interface AuthLog {
  id: string
  user_id: string
  event: 'login' | 'logout' | 'token_refresh' | 'password_change'
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface RefreshToken {
  id: string
  user_id: string
  token: string
  device_id: string
  device_name?: string
  ip_address?: string
  expires_at: string
  created_at: string
  last_used?: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface UserDevice {
  id: string
  device_name: string
  last_active: string
  ip_address?: string
  user_agent?: string
}