import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { supabase } from '../supabase/client'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credenciales',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña son requeridos')
        }

        const { data: user, error } = await supabase
          .from('usuarios')
          .select(`
            id,
            email,
            password_hash,
            nombre_completo,
            id_rol,
            estado,
            eliminado
          `)
          .eq('email', credentials.email)
          .eq('eliminado', false)
          .single()

        if (error || !user) {
          throw new Error('Credenciales inválidas')
        }

        if (user.estado !== 'activo') {
          throw new Error('Usuario no activo')
        }

        // Verifica el password_hash
        // Asegúrate de tener bcrypt instalado: npm install bcryptjs @types/bcryptjs
        const isValid = await bcrypt.compare(credentials.password, user.password_hash)
        if (!isValid) {
          throw new Error('Contraseña incorrecta')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.nombre_completo,
          role: user.id_rol,
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  }
}