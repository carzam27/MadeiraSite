import { supabase } from '../supabase/client'
import { cookies } from 'next/headers'
import type { Usuario } from '@/types/supabase'
import type { AuthUser, RefreshToken } from './types'
import bcrypt from 'bcryptjs'

export class AuthService {
  static async validateCredentials(email: string, password: string): Promise<AuthUser> {
    // Buscar usuario
    const { data: user, error } = await supabase
      .from('usuarios')
      .select(`
        *,
        roles (
          nombre,
          roles_permisos (
            permisos (
              codigo
            )
          )
        )
      `)
      .eq('email', email.toLowerCase())
      .eq('eliminado', false)
      .single()

    if (error || !user) {
      console.error('❌ Error o usuario no encontrado:', error)
      throw new Error('Credenciales inválidas')
    }

    console.log('✅ Usuario encontrado:', { id: user.id, estado: user.estado })
    // Verificar estado
    if (user.estado !== 'activo') {
      throw new Error('Usuario no activo')
    }

    // Verificar contraseña
    console.log('🔐 Verificando contraseña')
    const isValid = await bcrypt.compare(password, user.password_hash)

    if (!isValid) {
      console.log('❌ Contraseña inválida')
      throw new Error('Credenciales inválidas')
    }
    console.log('✅ Contraseña verificada correctamente')

    // Extraer permisos
    const permisos = user.roles?.roles_permisos
      ?.map((rp: { permisos: { codigo: any } }) => rp.permisos?.codigo)
      .filter(Boolean) as string[]

    return {
      id: user.id,
      email: user.email,
      name: user.nombre_completo,
      role: user.roles?.nombre,
      permissions: permisos
    }
  }

  // Actualizar la función createRefreshToken en src/lib/auth/service.ts
static async createRefreshToken(userId: string, deviceId: string): Promise<RefreshToken> {
  console.log('📝 Creando refresh token para usuario:', userId)
  
  try {
      // Primero, eliminar tokens existentes para este dispositivo
      const { error: deleteError } = await supabase
          .from('refresh_tokens')
          .delete()
          .match({ user_id: userId, device_id: deviceId })

      if (deleteError) {
          console.error('Error eliminando tokens antiguos:', deleteError)
          // Continuamos a pesar del error
      }

      const token = crypto.randomUUID()
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días

      const { data, error } = await supabase
          .from('refresh_tokens')
          .insert({
              token,
              user_id: userId,
              device_id: deviceId,
              expires_at: expiresAt.toISOString()
          })
          .select()
          .single()

      if (error) {
          console.error('Error insertando refresh token:', error)
          throw new Error(`Error creando refresh token: ${error.message}`)
      }

      console.log('✅ Refresh token creado correctamente')
      return data
  } catch (error) {
      console.error('❌ Error en createRefreshToken:', error)
      throw error instanceof Error 
          ? error 
          : new Error('Error inesperado creando refresh token')
  }
}

  static async validateRefreshToken(token: string): Promise<RefreshToken | null> {
    const { data: refreshToken, error } = await supabase
      .from('refresh_tokens')
      .select('*')
      .eq('token', token)
      .single()

    if (error || !refreshToken) {
      return null
    }

    // Verificar expiración
    if (new Date(refreshToken.expires_at) < new Date()) {
      await supabase
        .from('refresh_tokens')
        .delete()
        .eq('token', token)
      return null
    }

    return refreshToken
  }

  static async revokeRefreshToken(token: string): Promise<void> {
    await supabase
      .from('refresh_tokens')
      .delete()
      .eq('token', token)
  }
}