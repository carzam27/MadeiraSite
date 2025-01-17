import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { 
  Categoria,
  CategoriaInsert,
  CategoriaUpdate 
} from '@/types/supabase'

export function useCategorias(options = {}) {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categorias_servicios')
        .select('*')
        .eq('eliminado', false)
        .order('orden_visualizacion')

      if (error) throw error
      return data as Categoria[]
    },
    ...options
  })
}