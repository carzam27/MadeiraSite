// src/lib/auth/session.ts
import { getServerSession } from 'next-auth'
import { useSession as useNextAuthSession } from 'next-auth/react'
import type { GetServerSidePropsContext } from 'next'
import { authOptions } from './config'

/**
 * Obtiene el usuario actual desde el servidor
 */
export async function getCurrentUser(
  context?: GetServerSidePropsContext
) {
  if (context) {
    return (await getServerSession(context.req, context.res, authOptions))?.user
  }
  return (await getServerSession(authOptions))?.user
}

/**
 * Obtiene los permisos del usuario actual
 */
export async function getCurrentUserPermissions(
  context?: GetServerSidePropsContext
): Promise<string[]> {
  const user = await getCurrentUser(context)
  return user?.permissions || []
}

/**
 * Verifica si el usuario actual tiene un permiso específico
 */
export async function hasPermission(
  permission: string,
  context?: GetServerSidePropsContext
): Promise<boolean> {
  const permissions = await getCurrentUserPermissions(context)
  return permissions.includes(permission)
}

/**
 * Verifica si el usuario actual tiene un rol específico
 */
export async function hasRole(
  role: string,
  context?: GetServerSidePropsContext
): Promise<boolean> {
  const user = await getCurrentUser(context)
  return user?.role === role
}

/**
 * Hook para usar en componentes del cliente
 * Ahora usa directamente el hook de next-auth
 */
export function useSession() {
  return useNextAuthSession()
}

/**
 * Verifica si hay una sesión activa
 */
export async function isAuthenticated(
  context?: GetServerSidePropsContext
): Promise<boolean> {
  const user = await getCurrentUser(context)
  return !!user
}

// Tipos útiles
export type UserPermissions = string[]

export interface SessionUser {
  id: string
  email: string
  name?: string | null
  image?: string | null
  role: string
  permissions: UserPermissions
  status?: string
}