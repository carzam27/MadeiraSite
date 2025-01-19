// src/tests/auth.test.ts
import { describe, it, expect } from 'vitest'
import { AuthService } from '@/lib/auth/service'
import { supabase } from '@/lib/supabase/client'

describe('Auth Flow Tests', () => {
  // Datos de prueba
  const testUser = {
    email: 'test@example.com',
    password: 'TestPassword123!',
    nombre_completo: 'Test User'
  }

  // Pruebas de registro
  describe('Registration', () => {
    it('should create a new user in pending state', async () => {
      // Limpiar usuario de prueba si existe
      await cleanupTestUser(testUser.email)

      // Registrar usuario
      const userData = await AuthService.validateCredentials(
        testUser.email,
        testUser.password,
        'Mozilla/5.0 (Test Browser)',
        '127.0.0.1'
      )

      // Verificar estado
      expect(userData.status).toBe('pendiente')

      // Verificar refresh token
      const { data: refreshToken } = await supabase
        .from('refresh_tokens')
        .select('*')
        .eq('user_id', userData.id)
        .single()

      expect(refreshToken).toBeTruthy()
      expect(refreshToken.device_name).toContain('Test Browser')
    })

    it('should prevent login for pending users', async () => {
      try {
        await AuthService.validateCredentials(
          testUser.email,
          testUser.password
        )
        fail('Should not allow login for pending user')
      } catch (error) {
        expect(error.message).toContain('pendiente')
      }
    })
  })

  // Pruebas de múltiples dispositivos
  describe('Multiple Devices', () => {
    it('should handle multiple login sessions', async () => {
      // Simular logins desde diferentes dispositivos
      const devices = [
        { agent: 'Chrome Mobile', ip: '192.168.1.1' },
        { agent: 'Firefox Desktop', ip: '192.168.1.2' },
      ]

      for (const device of devices) {
        await AuthService.validateCredentials(
          testUser.email,
          testUser.password,
          device.agent,
          device.ip
        )
      }

      // Verificar dispositivos registrados
      const userDevices = await AuthService.getUserDevices(testUser.id)
      expect(userDevices).toHaveLength(devices.length)
    })
  })

  // Pruebas de logout
  describe('Logout', () => {
    it('should revoke specific device session', async () => {
      const devices = await AuthService.getUserDevices(testUser.id)
      const deviceId = devices[0].id

      await AuthService.revokeDevice(testUser.id, deviceId)

      const updatedDevices = await AuthService.getUserDevices(testUser.id)
      expect(updatedDevices).toHaveLength(devices.length - 1)
    })

    it('should revoke all sessions', async () => {
      await AuthService.revokeAllUserTokens(testUser.id)
      
      const devices = await AuthService.getUserDevices(testUser.id)
      expect(devices).toHaveLength(0)
    })
  })
})

// Función auxiliar para limpiar datos de prueba
async function cleanupTestUser(email: string) {
  const { data: user } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', email)
    .single()

  if (user) {
    await supabase.from('refresh_tokens').delete().eq('user_id', user.id)
    await supabase.from('auth_logs').delete().eq('user_id', user.id)
    await supabase.from('usuarios').delete().eq('id', user.id)
  }
}