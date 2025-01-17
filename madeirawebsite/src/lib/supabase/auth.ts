import { supabase } from './client'
import { type Database } from './types'

type Usuario = Database['public']['Tables']['usuarios']['Row']

export async function signIn(email: string, password: string) {
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
}

export async function signUp(userData: {
  email: string
  password: string
  nombre_completo: string
  unidad: string
  tipo_residente: Database['public']['Enums']['tipo_residente']
}) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
  })

  if (authError) throw authError

  // Crear registro en la tabla usuarios
  const { data: user, error: userError } = await supabase
    .from('usuarios')
    .insert({
      ...userData,
      id: authData.user?.id,
      id_rol: (await getRolResidente()).id, // Función auxiliar que debes crear
    })
    .select()
    .single()

  if (userError) throw userError

  return {
    authData,
    user,
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