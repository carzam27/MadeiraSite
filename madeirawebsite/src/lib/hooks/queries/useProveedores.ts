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

export function useProveedor(id: string) {
  return useQuery({
    queryKey: ['proveedor', id],
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
        .eq('id', id)
        .single()

      if (error) throw error
      return data as ProveedorUpdate
    },
    enabled: !!id
  })
}

export function useUpdateProveedor() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      updatedProveedor 
    }: { 
      id: string, 
      updatedProveedor: ProveedorUpdate 
    }) => {
      const { data, error } = await supabase
        .from('proveedores_servicios')
        .update(updatedProveedor)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Proveedor
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] })
      queryClient.invalidateQueries({ queryKey: ['proveedor', id] })
    }
  })
}

export function useDeleteProveedor() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('proveedores_servicios')
        .update({ eliminado: true })
        .eq('id', id)
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