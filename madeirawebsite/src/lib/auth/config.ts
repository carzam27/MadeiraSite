// src/lib/auth/config.ts
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { AuthService } from './service'
import type { User } from 'next-auth'
import { cookies } from 'next/headers'

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
          throw new Error('Email y contraseña son requeridos')
        }

        try {
          const userData = await AuthService.validateCredentials(
            credentials.email,
            credentials.password,
            req?.headers?.['user-agent'],
            req?.headers?.['x-forwarded-for']?.toString()
          )

          if (userData.status !== 'activo') {
            throw new Error(`Tu cuenta está ${userData.status}`)
          }

          return {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            permissions: userData.permissions,
            status: userData.status,
            image: null
          }
        } catch (error) {
          console.error('Error en authorize:', error)
          throw error
        }
      },
    })
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account,trigger }) {
      console.log("JWT Callback:", { tokenExists: !!token, userExists: !!user, trigger })
      
      if (user) {
        token.id = user.id
        token.role = user.role
        token.permissions = user.permissions
      }

      // Para manejar el signOut, verificamos si el token está vacío
      if (!token || Object.keys(token).length === 0) {
        console.log("JWT: Token vacío o inexistente")
        return {
          ...token,
          id: '',
          role: '',
          permissions: [],
          status: ''
        }
      }
      return token
    },
    async session({ session, token }) {
      console.log("Session Callback:", { sessionExists: !!session, tokenExists: !!token })
      
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.permissions = token.permissions as string[]
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
}