// src/lib/auth/service.ts
import { supabase } from '../supabase/client'
import type { AuthLog, RefreshToken, UserDevice } from './types'
import { UAParser } from 'ua-parser-js'

export class AuthService {
  static async validateCredentials(email: string, password: string, userAgent?: string, ipAddress?: string) {
    try {
      // 1. Autenticar con Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) {
        throw new Error('Credenciales inválidas')
      }

      // 2. Obtener datos del usuario
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select(`
          *,
          roles (
            id,
            nombre,
            roles_permisos (
              permisos (
                nombre
              )
            )
          )
        `)
        .eq('id', authData.user.id)
        .single()

      if (userError) {
        console.error('Error de usuario:', userError)
        throw new Error('Error al obtener datos del usuario')
      }

      // 3. Verificaciones de estado
      if (userData.eliminado) {
        throw new Error('Esta cuenta no está disponible')
      }

      if (userData.estado === 'pendiente') {
        throw new Error('Tu cuenta está pendiente de aprobación')
      }

      if (userData.estado === 'inactivo') {
        throw new Error('Tu cuenta está inactiva')
      }

      // 4. Formatear permisos
      const permissions = userData.roles.roles_permisos?.map(
        (rp: any) => rp.permisos.nombre
      ) || []

      // 5. Crear refresh token si el usuario está activo
      if (userData.estado === 'activo') {
        const deviceId = crypto.randomUUID()
        try {
          await this.createRefreshToken(userData.id, deviceId, {
            deviceName: this.getDeviceName(userAgent),
            userAgent,
            ipAddress
          })
        } catch (tokenError) {
          console.error('Error refresh token:', tokenError)
        }
      }

      // 6. Registrar evento de login
      await this.logAuthEvent(userData.id, 'login', ipAddress, userAgent)

      return {
        id: userData.id,
        email: userData.email,
        name: userData.nombre_completo,
        role: userData.roles.nombre,
        permissions,
        status: userData.estado
      }
    } catch (error) {
      console.error('Error en validateCredentials:', error)
      throw error
    }
  }

  private static getDeviceName(userAgent?: string): string {
    if (!userAgent) return 'Dispositivo Desconocido'
    
    try {
      // Implementar lógica simple de detección de dispositivo
      if (userAgent.includes('Mobile')) return 'Dispositivo Móvil'
      if (userAgent.includes('Tablet')) return 'Tablet'
      if (userAgent.includes('Windows')) return 'PC Windows'
      if (userAgent.includes('Mac')) return 'PC Mac'
      if (userAgent.includes('Linux')) return 'PC Linux'
      return 'Navegador Web'
    } catch {
      return 'Dispositivo Desconocido'
    }
  }

  static async createRefreshToken(
    userId: string,
    deviceId: string,
    details: {
      deviceName?: string
      userAgent?: string
      ipAddress?: string
    }
  ) {
    try {
      // Generar token único
      const token = crypto.randomUUID()
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días

      const { data, error } = await supabase
        .from('refresh_tokens')
        .insert({
          user_id: userId,
          token,
          device_id: deviceId,
          device_name: details.deviceName || 'Dispositivo Desconocido',
          ip_address: details.ipAddress,
          user_agent: details.userAgent,
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error('Error inserting refresh token:', error)
        throw new Error('Error al crear refresh token')
      }

      return data
    } catch (error) {
      console.error('createRefreshToken error:', error)
      throw error
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
      await this.revokeRefreshToken(token)
      return null
    }

    // Actualizar último uso
    await supabase
      .from('refresh_tokens')
      .update({ last_used: new Date().toISOString() })
      .eq('token', token)

    return refreshToken
  }

  static async revokeRefreshToken(token: string): Promise<void> {
    await supabase
      .from('refresh_tokens')
      .delete()
      .eq('token', token)
  }

  static async revokeAllUserTokens(userId: string): Promise<void> {
    await supabase
      .from('refresh_tokens')
      .delete()
      .eq('user_id', userId)
  }

  static async getUserDevices(userId: string): Promise<UserDevice[]> {
    const { data, error } = await supabase
      .from('refresh_tokens')
      .select('device_id, device_name, last_used, ip_address, user_agent')
      .eq('user_id', userId)
      .order('last_used', { ascending: false })

    if (error) {
      throw new Error('Error obteniendo dispositivos')
    }

    return data.map(token => ({
      id: token.device_id,
      device_name: token.device_name || 'Dispositivo desconocido',
      last_active: token.last_used,
      ip_address: token.ip_address,
      user_agent: token.user_agent
    }))
  }

  static async revokeDevice(userId: string, deviceId: string): Promise<void> {
    await supabase
      .from('refresh_tokens')
      .delete()
      .eq('user_id', userId)
      .eq('device_id', deviceId)
  }

  static async logAuthEvent(
    userId: string,
    event: AuthLog['event'],
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await supabase
      .from('auth_logs')
      .insert({
        user_id: userId,
        event,
        ip_address: ipAddress,
        user_agent: userAgent,
      })
  }

  static async logout(userId: string, deviceId?: string): Promise<void> {
    try {
      console.log('Iniciando logout para usuario:', userId)
  
      // 1. Revocar tokens de refresh
      await this.revokeAllUserTokens(userId)
      console.log('Tokens revocados')
  
      // 2. Cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error en Supabase signOut:', error)
      }
      console.log('Sesión de Supabase cerrada')
  
      // 3. Limpiar storage local
      if (typeof window !== 'undefined') {
        const keysToRemove = [
          'supabase.auth.token',
          'next-auth.session-token',
          'next-auth.callback-url',
          'next-auth.csrf-token'
        ]
        
        keysToRemove.forEach(key => {
          localStorage.removeItem(key)
          sessionStorage.removeItem(key)
        })
      }
      
      // Removido el return { success: true }
    } catch (error) {
      console.error('Error durante logout:', error)
      throw error
    }
  }
}