import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from './client'
import type { Database }  from '@/types/supabase';

type Tables = Database['public']['Tables']

// Hook para obtener usuarios
export function useUsers(options = {}) {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('eliminado', false)
      
      if (error) throw error
      return data
    },
    ...options,
  })
}

// Hook para crear usuario
export function useCreateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (newUser: Tables['usuarios']['Insert']) => {
      const { data, error } = await supabase
        .from('usuarios')
        .insert(newUser)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

// Hook para actualizar usuario
export function useUpdateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Tables['usuarios']['Update']) => {
      const { data, error } = await supabase
        .from('usuarios')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}