// src/app/dashboard/_components/DashboardClient.tsx
'use client'

import { useState, type PropsWithChildren } from 'react'
import { useRouter } from 'next/navigation'
import { User } from 'next-auth'
import { Menu,User as UserIcon, X, Bell, Search, Home, Settings, LogOut, Users, FileText, List } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { UserProfile } from './UserProfile'

interface DashboardClientProps extends PropsWithChildren {
  user: User
}

export function DashboardClient({ children, user }: DashboardClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userProfileOpen, setUserProfileOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-blue-600 text-white px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-1"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <h1 className="text-lg font-semibold">Portal de Servicios</h1>
          
          <button 
            onClick={() => setUserProfileOpen(true)}
            className="p-1 rounded-full bg-blue-500"
          >
            <UserIcon className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-theme(spacing.6)-theme(spacing.14))]">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          user={user}
        />
        
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>

      {/* User Profile Drawer */}
      <UserProfile
        isOpen={userProfileOpen}
        onClose={() => setUserProfileOpen(false)}
        user={user}
      />
    </div>
  )
}