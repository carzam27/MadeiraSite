// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withAuth } from 'next-auth/middleware'

// Lista de rutas públicas
const publicPaths = [
  '/auth',
  '/test-connection',
  '/test',
  '/api/public',
  '/_next',
  '/favicon.ico',
  '/assets'
]

const isPublicPath = (path: string) => {
  return publicPaths.some(publicPath => path.startsWith(publicPath))
}

export default withAuth(
  function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname
    console.log('Middleware checking path:', path)

  // Modificar la lógica de redirección
  if (isPublicPath(path)) {
    return NextResponse.next()
  }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const path = req.nextUrl.pathname
        console.log('Auth check for path:', path, 'Token:', token ? 'exists' : 'null')
 /*
        // Si estamos en login y hay token, redirigir a dashboard
        if (path === '/auth/login' && token) {
          return false
        }

        // Si hay token, permitir acceso a rutas protegidas
        if (token && (path.startsWith('/dashboard') || path === '/')) {
          return true
        }

        // Si no hay token, requerir login
        if (!token && !isPublicPath(path)) {
          return false
        }

        // Rutas admin requieren rol específico
        if (path.startsWith('/admin')) {
          return token?.role === 'admin'
        }

        // Por defecto requerir autenticación
        return !!token
        */
        // Lógica más clara para rutas protegidas
        if (!token && !isPublicPath(path)) {
          return false
        }

        if (path === '/auth/login' && token) {
          return false  // Redirigir a dashboard si hay token
        }

        return true
      }
    },
    pages: {
      signIn: '/auth/login',
      error: '/auth/error'
    }
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/:path*',
    '/',
    '/auth/login',
    '/((?!_next/static|_next/image|favicon.ico|assets/).*)'
  ]
}