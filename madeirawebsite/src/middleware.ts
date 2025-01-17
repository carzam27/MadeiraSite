// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withAuth } from 'next-auth/middleware'

// Lista de rutas públicas que no requieren autenticación
const publicPaths = [
  '/test-connection',
  '/test',
  '/api/public/test-connection'
]

// Función para verificar si una ruta es pública
const isPublicPath = (path: string) => {
  return publicPaths.some(publicPath => path.startsWith(publicPath))
}

export function middleware(request: NextRequest) {
  // Obtener la ruta actual
  const path = request.nextUrl.pathname

  // Si es una ruta pública, permitir acceso
  if (isPublicPath(path)) {
    return NextResponse.next()
  }

  // Para rutas protegidas, verificar la sesión
  // Aquí podrías agregar la lógica de verificación de sesión si es necesario
  
  // Por ahora, permitimos todas las rutas que no son públicas
  return NextResponse.next()
}

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      const path = req.nextUrl.pathname
      
      // Rutas públicas
      if (path.startsWith('/auth') || path === '/') {
        return true
      }

      // Rutas admin
      if (path.startsWith('/admin')) {
        return token?.role === 'admin'
      }

      // Resto de rutas requieren autenticación
      return !!token
    }
  }
})

export const config = {
  matcher: [
    // Rutas que quieres que pasen por el middleware
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/:path*',
    '/((?!_next/static|favicon.ico).*)',
  ]
}