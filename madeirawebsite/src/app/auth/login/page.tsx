// src/app/auth/login/page.tsx
'use client'

import React, { useState } from 'react'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
  remember: z.boolean().default(false)
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Page() {  // Cambiado de LoginPage a Page
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null)
      setIsLoading(true)
      console.log('Intentando login con:', data.email)
  
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        remember: data.remember,
        redirect: false,
        callbackUrl: '/dashboard'
      })
  
      console.log('Resultado del login:', result)
  
      if (result?.error) {
        setError(result.error)
        return
      }
  
      if (result?.ok) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error en login:', error)
      setError(error instanceof Error ? error.message : 'Error inesperado')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Status Bar */}
      <div className="bg-blue-600 text-white h-6 text-xs flex items-center justify-between px-4">
        <span>9:41</span>
        <div className="flex space-x-2">
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6">
        {/* Logo Area */}
        <div className="mt-12 mb-8 text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Bienvenido</h1>
          <p className="mt-2 text-gray-600">Portal de Servicios Residenciales</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-8">
          {/* Email Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('email')}
              type="email"
              placeholder="Correo electrónico"
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              className={`block w-full pl-10 pr-10 py-3 border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('remember')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">Recordarme</span>
            </label>
            <button
              type="button"
              onClick={() => router.push('/auth/recovery')}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          {/* Register Link */}
          <div className="text-center mt-6">
            <span className="text-gray-600 text-sm">¿No tienes una cuenta? </span>
            <button
              type="button"
              onClick={() => router.push('/auth/register')}
              className="text-blue-600 text-sm font-medium hover:text-blue-500"
            >
              Regístrate aquí
            </button>
          </div>
        </form>
      </div>

      {/* Bottom Safe Area */}
      <div className="h-6 bg-gray-50" />
    </div>
  )
}