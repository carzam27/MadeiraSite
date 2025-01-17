import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { 
  ProveedorFavorito,
  ProveedorFavoritoInsert,
  Proveedor
} from '@/types/supabase'

export function useFavoritosUsuario(userId: string, options = {}) {
  return useQuery({
    queryKey: ['favoritos', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favoritos_proveedores')
        .select(`
          *,
          proveedores_servicios (
            *,
            categorias_servicios (
              id,
              nombre
            )
          )
        `)
        .eq('id_usuario', userId)
        .eq('eliminado', false)

      if (error) throw error
      return data as (ProveedorFavorito & { proveedores_servicios: Proveedor })[]
    },
    ...options
  })
}

export function useToggleFavorito() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      proveedorId, 
      userId 
    }: { 
      proveedorId: string
      userId: string 
    }) => {
      // Primero verificamos si ya existe
      const { data: existente } = await supabase
        .from('favoritos_proveedores')
        .select('*')
        .eq('id_proveedor', proveedorId)
        .eq('id_usuario', userId)
        .single()

      if (existente) {
        // Si existe, lo eliminamos
        const { error } = await supabase
          .from('favoritos_proveedores')
          .delete()
          .eq('id', existente.id)

        if (error) throw error
        return null
      } else {
        // Si no existe, lo creamos
        const nuevoFavorito: ProveedorFavoritoInsert = {
          id_proveedor: proveedorId,
          id_usuario: userId,
          creado_por: userId,
          eliminado: false
        }

        const { data, error } = await supabase
          .from('favoritos_proveedores')
          .insert(nuevoFavorito)
          .select()
          .single()

        if (error) throw error
        return data as ProveedorFavorito
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['favoritos', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['proveedores'] })
    }
  })
}