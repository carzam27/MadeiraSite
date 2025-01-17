import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { 
  Proveedor,
  ProveedorInsert,
  ProveedorUpdate 
} from '@/types/supabase'

export function useProveedores(options = {}) {
  return useQuery({
    queryKey: ['proveedores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proveedores_servicios')
        .select(`
          *,
          categorias_servicios (
            id,
            nombre
          )
        `)
        .eq('eliminado', false)
        .order('nombre_negocio')

      if (error) throw error
      return data as Proveedor[]
    },
    ...options
  })
}

export function useCreateProveedor() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (newProveedor: ProveedorInsert) => {
      const { data, error } = await supabase
        .from('proveedores_servicios')
        .insert(newProveedor)
        .select()
        .single()

      if (error) throw error
      return data as Proveedor
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] })
    }
  })
}