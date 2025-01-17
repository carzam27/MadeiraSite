import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { 
  Menu,
  MenuInsert,
  MenuUpdate,
  MenuConPermiso 
} from '@/types/supabase'

export function useMenus(options = {}) {
  return useQuery({
    queryKey: ['menus'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menus')
        .select(`
          *,
          permisos (*)
        `)
        .eq('eliminado', false)
        .order('orden_visualizacion')

      if (error) throw error
      return data as MenuConPermiso[]
    },
    ...options
  })
}

export function useCreateMenu() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (newMenu: MenuInsert) => {
      const { data, error } = await supabase
        .from('menus')
        .insert(newMenu)
        .select()
        .single()

      if (error) throw error
      return data as Menu
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] })
    }
  })
}