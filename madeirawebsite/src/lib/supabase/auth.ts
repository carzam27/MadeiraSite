// src/lib/supabase/auth.ts
import { supabase } from './client'
import { clearSupabaseCookies } from './server'
import { type Database } from '@/types/supabase';

type Usuario = Database['public']['Tables']['usuarios']['Row']

export async function signIn(email: string, password: string) {
  try {
    const { data: user, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) throw authError

    // Obtener datos adicionales del usuario
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single()

    if (userError) throw userError

    return {
      user,
      userData,
    }
  } catch (error) {
    console.error('Error in signIn:', error)
    throw error
  }
}

export async function signOut() {
  try {
    // 1. Revocar tokens de Supabase
    const { error: signOutError } = await supabase.auth.signOut({
      scope: 'global' // Cerrar todas las sesiones
    })

    if (signOutError) {
      console.error('Error in Supabase signOut:', signOutError)
    }

    // 2. Limpiar cookies de Supabase
    await clearSupabaseCookies()

    // Ya no es necesario clearSession() ya que signOut() maneja esto internamente
    
    return { success: true }
  } catch (error) {
    console.error('Error in signOut:', error)
    throw error
  }
}

export async function signUp(userData: {
  email: string
  password: string
  nombre_completo: string
  unidad: string
  tipo_residente: Database['public']['Enums']['tipo_residente']
}) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          nombre_completo: userData.nombre_completo,
        }
      }
    })

    if (authError) throw authError

    // Crear registro en la tabla usuarios
    const { data: user, error: userError } = await supabase
      .from('usuarios')
      .insert({
        ...userData,
        id: authData.user?.id,
        id_rol: (await getRolResidente()).id,
        estado: 'pendiente'
      })
      .select()
      .single()

    if (userError) {
      // Si falla la creación del usuario, eliminar la auth
      if (authData.user) {
        await supabase.auth.admin.deleteUser(authData.user.id)
      }
      throw userError
    }

    return {
      authData,
      user,
    }
  } catch (error) {
    console.error('Error in signUp:', error)
    throw error
  }
}

async function getRolResidente() {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('nombre', 'residente')
    .single()

  if (error) throw error
  return data
}