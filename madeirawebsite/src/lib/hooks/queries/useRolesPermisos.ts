import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { 
  RolPermiso,
  RolPermisoInsert ,
  Permiso
} from '@/types/supabase'

export function useRolPermisos(rolId: string, options = {}) {
  return useQuery({
    queryKey: ['rol-permisos', rolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles_permisos')
        .select(`
          *,
          permisos (*)
        `)
        .eq('id_rol', rolId)
        .eq('eliminado', false)

      if (error) throw error
      return data as (RolPermiso & { permisos: Permiso })[]
    },
    ...options
  })
}

export function useAsignarPermisos() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      rolId, 
      permisoIds 
    }: { 
      rolId: string
      permisoIds: string[]
    }) => {
      // Primero eliminamos todos los permisos existentes
      await supabase
        .from('roles_permisos')
        .update({ eliminado: true })
        .eq('id_rol', rolId)

      // Luego insertamos los nuevos permisos
      const nuevosPermisos: RolPermisoInsert[] = permisoIds.map(id_permiso => ({
        id_rol: rolId,
        id_permiso,
        eliminado: false
      }))

      const { data, error } = await supabase
        .from('roles_permisos')
        .insert(nuevosPermisos)
        .select()

      if (error) throw error
      return data as RolPermiso[]
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rol-permisos', variables.rolId] })
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    }
  })
}