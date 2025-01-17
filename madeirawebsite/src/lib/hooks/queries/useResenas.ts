import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { 
  ProveedorResena,
  ProveedorResenaInsert,
  ProveedorResenaUpdate,
  ResenaConUsuario 
} from '@/types/supabase'

export function useResenasProveedor(proveedorId: string, options = {}) {
  return useQuery({
    queryKey: ['resenas', proveedorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resenas_proveedores')
        .select(`
          *,
          usuarios (
            id,
            nombre_completo,
            unidad
          ),
          proveedores_servicios (
            id,
            nombre_negocio
          )
        `)
        .eq('id_proveedor', proveedorId)
        .eq('eliminado', false)
        .order('fecha_creacion', { ascending: false })

      if (error) throw error
      return data as ResenaConUsuario[]
    },
    ...options
  })
}

export function useCreateResena() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (newResena: ProveedorResenaInsert) => {
      const { data, error } = await supabase
        .from('resenas_proveedores')
        .insert(newResena)
        .select()
        .single()

      if (error) throw error
      return data as ProveedorResena
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['resenas', data.id_proveedor] })
      queryClient.invalidateQueries({ queryKey: ['proveedores'] })
    }
  })
}

export function useUpdateResena() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & ProveedorResenaUpdate) => {
      const { data, error } = await supabase
        .from('resenas_proveedores')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as ProveedorResena
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['resenas', data.id_proveedor] })
      queryClient.invalidateQueries({ queryKey: ['proveedores'] })
    }
  })
}