import { type GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'

export async function getCurrentUser(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)
  return session?.user
}

export function hasPermission(userPermissions: string[] = [], requiredPermission: string) {
  return userPermissions.includes(requiredPermission)
}

export function hasRole(userRole: string, allowedRoles: string[]) {
  return allowedRoles.includes(userRole)
}