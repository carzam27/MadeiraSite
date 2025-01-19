// src/app/dashboard/_components/Sidebar.tsx
'use client'

import { User } from 'next-auth'
import { useRouter } from 'next/navigation'
import { getSession, signOut } from 'next-auth/react'
import { 
  Home, Settings, LogOut, Users, FileText, 
  List, X, Building2, Star, MessageCircle 
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { AuthService } from '@/lib/auth/service'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  user: User
}

export function Sidebar({ isOpen, onClose, user }: SidebarProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      // 1. Primero invalidar la sesión de Supabase
      await supabase.auth.signOut()
      
      // 2. Limpiar tokens de refresh
      const session = await getSession()
      if (session?.user?.id) {
        await AuthService.revokeAllUserTokens(session.user.id)
      }
  
      // 3. Forzar expiración del token JWT
      const res = await fetch('/auth/logout', {
        method: 'POST'
      })
  
      if (!res.ok) {
        throw new Error('Error al cerrar sesión')
      }
  
      // 4. Finalmente hacer signOut de NextAuth
      await signOut({
        redirect: true,
        callbackUrl: '/auth/login'
      })
  
    } catch (error) {
      console.error('Error en logout:', error)
      // En caso de error, forzar redirección
      window.location.href = '/auth/login'
    }
  }

  const menuItems = [
    {
      title: 'Inicio',
      icon: Home,
      href: '/dashboard',
    },
    {
      title: 'Proveedores',
      icon: Building2,
      href: '/dashboard/providers',
    },
    {
      title: 'Favoritos',
      icon: Star,
      href: '/dashboard/favorites',
    },
    {
      title: 'Mensajes',
      icon: MessageCircle,
      href: '/dashboard/messages',
    },
    // Solo mostrar si es admin
    ...(user.role === 'admin' ? [
      {
        title: 'Usuarios',
        icon: Users,
        href: '/dashboard/users',
      },
      {
        title: 'Categorías',
        icon: List,
        href: '/dashboard/categories',
      },
    ] : []),
    {
      title: 'Configuración',
      icon: Settings,
      href: '/dashboard/settings',
    },
  ]

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-0`}
      >
        {/* Header */}
        <div className="h-[5.5rem] bg-blue-600 px-4 flex items-end pb-4">
          <button
            onClick={onClose}
            className="text-white lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-medium">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.href}
              onClick={() => {
                router.push(item.href)
                onClose()
              }}
              className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </button>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-red-50 text-red-600"
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </nav>
      </aside>
    </>
  )
}

function revokeAllUserTokens(id: string) {
  throw new Error('Function not implemented.')
}
