import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { 
  Usuario,
  UsuarioInsert,
  UsuarioUpdate 
} from '@/types/supabase'

export function useUsuarios(options = {}) {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          *,
          roles (
            id,
            nombre
          )
        `)
        .eq('eliminado', false)
        .order('nombre_completo')

      if (error) throw error
      return data as Usuario[]
    },
    ...options
  })
}