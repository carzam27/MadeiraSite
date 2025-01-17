import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { 
  Rol,
  RolInsert,
  RolUpdate,
  RolConPermisos 
} from '@/types/supabase'

export function useRoles(options = {}) {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select(`
          *,
          roles_permisos (
            permisos (
              *
            )
          )
        `)
        .eq('eliminado', false)
        .order('nombre')

      if (error) throw error
      return data as RolConPermisos[]
    },
    ...options
  })
}

export function useCreateRol() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (newRol: RolInsert) => {
      const { data, error } = await supabase
        .from('roles')
        .insert(newRol)
        .select()
        .single()

      if (error) throw error
      return data as Rol
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    }
  })
}

export function useUpdateRol() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & RolUpdate) => {
      const { data, error } = await supabase
        .from('roles')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Rol
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    }
  })
}