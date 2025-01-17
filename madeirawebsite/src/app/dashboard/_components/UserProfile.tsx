// src/app/dashboard/_components/UserProfile.tsx
'use client'

import { User } from 'next-auth'
import { useState } from 'react'
import { X, User as UserIcon, Mail, Phone, Home, Shield } from 'lucide-react'

interface UserProfileProps {
  isOpen: boolean
  onClose: () => void
  user: User
}

export function UserProfile({ isOpen, onClose, user }: UserProfileProps) {
  const [loading, setLoading] = useState(false)

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Profile Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 bg-white transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="h-[5.5rem] bg-blue-600 px-4 flex items-end justify-between pb-4">
          <h2 className="text-white text-lg font-semibold">Mi Perfil</h2>
          <button
            onClick={onClose}
            className="text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <span className="text-blue-600 text-2xl font-medium">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>

          {/* User Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-700">
              <Mail className="h-5 w-5 text-gray-400" />
              <span>{user.email}</span>
            </div>
            
            <div className="flex items-center space-x-3 text-gray-700">
              <Shield className="h-5 w-5 text-gray-400" />
              <span>Rol: {user.role}</span>
            </div>

            {/* Example of additional info */}
            <div className="flex items-center space-x-3 text-gray-700">
              <Home className="h-5 w-5 text-gray-400" />
              <span>Unidad: A-101</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <button
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={loading}
            >
              Editar Perfil
            </button>

            <button
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={loading}
            >
              Cambiar Contraseña
            </button>
          </div>
        </div>
      </div>
    </>
  )
}