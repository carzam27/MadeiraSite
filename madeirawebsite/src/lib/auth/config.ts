// src/lib/auth/config.ts
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { AuthService } from './service'
import { getDeviceId } from './device'
import type { User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import type { AuthUser } from './types'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credenciales',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
        remember: { label: "Recordarme", type: "checkbox" }
      },
      async authorize(credentials, req): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Faltan credenciales')
          throw new Error('Email y contraseña son requeridos')
        }

        try {
          console.log('🔍 Intentando validar credenciales para:', credentials.email)
          
          // Validar credenciales
          const userData: AuthUser = await AuthService.validateCredentials(
            credentials.email,
            credentials.password
          )

          console.log('✅ Credenciales validadas correctamente', {
            userId: userData.id,
            role: userData.role
          })

          // Crear el objeto User base
          const user: User = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            permissions: userData.permissions,
            image: null
          }

          // Si el usuario quiere ser recordado, crear refresh token
          if (credentials.remember === 'true') {
            console.log('📝 Creando refresh token para usuario:', user.id)
            const deviceId = await getDeviceId()
            const refreshToken = await AuthService.createRefreshToken(userData.id, deviceId)
            // Guardamos el token en un campo temporal que solo usaremos en el callback jwt
            ;(user as any)._refreshToken = refreshToken.token
            console.log('✅ Refresh token creado correctamente')
          }

          return user
        } catch (error) {
          console.error('❌ Error en authorize:', error)
          throw new Error(error instanceof Error ? error.message : 'Error de autenticación')
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      // Inicial sign in
      if (user) {
        console.log('🔑 Generando JWT inicial para usuario:', user.id)
        return {
          ...token,
          id: user.id,
          role: user.role,
          permissions: user.permissions,
          // Recuperamos el token temporal
          refreshToken: (user as any)._refreshToken
        }
      }

      // En subsiguientes llamadas, verificar refresh token
      if (token.refreshToken) {
        console.log('🔄 Verificando refresh token')
        const refreshToken = await AuthService.validateRefreshToken(token.refreshToken)

        // Si el refresh token es válido, renovar el token
        if (refreshToken) {
          console.log('✅ Refresh token válido, renovando JWT')
          return {
            ...token,
            refreshToken: refreshToken.token
          }
        }
        console.log('❌ Refresh token inválido o expirado')
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        console.log('👤 Actualizando sesión con datos del token')
        session.user.id = token.id
        session.user.role = token.role
        session.user.permissions = token.permissions
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  debug: true // Habilita logs detallados de NextAuth
}