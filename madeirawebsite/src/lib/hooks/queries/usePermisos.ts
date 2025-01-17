import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { 
  Permiso,
  PermisoInsert,
  PermisoUpdate 
} from '@/types/supabase'

export function usePermisos(options = {}) {
  return useQuery({
    queryKey: ['permisos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permisos')
        .select('*')
        .eq('eliminado', false)
        .order('modulo, nombre')

      if (error) throw error
      return data as Permiso[]
    },
    ...options
  })
}

export function useCreatePermiso() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (newPermiso: PermisoInsert) => {
      const { data, error } = await supabase
        .from('permisos')
        .insert(newPermiso)
        .select()
        .single()

      if (error) throw error
      return data as Permiso
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permisos'] })
    }
  })
}