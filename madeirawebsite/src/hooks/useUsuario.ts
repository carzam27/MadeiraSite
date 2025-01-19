// /src/hooks/useCreateUsuario.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase/client';
import type { RegistroUsuario } from '@/types/supabase';

export function useCreateUsuario() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegistroUsuario) => {
      // 1. Verificar si el email o dni ya existen
      const { data: existingUser, error: checkError } = await supabase
        .from('usuarios')
        .select('id, email, dni')
        .or(`email.eq.${data.email},dni.eq.${data.dni}`)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 es el código cuando no se encuentra registro
        throw new Error('Error al verificar usuario existente');
      }

      if (existingUser) {
        if (existingUser.email === data.email) {
          throw new Error('Este email ya está registrado');
        }
        if (existingUser.dni === data.dni) {
          throw new Error('Esta cédula ya está registrada');
        }
      }

      // 2. Obtener el rol de residente
      const { data: rolData, error: rolError } = await supabase
        .from('roles')
        .select('id')
        .eq('nombre', 'residente')
        .single();

      if (rolError) {
        throw new Error('Error al obtener el rol de residente');
      }

      try {
        // 3. Crear usuario en Auth
        const { data: authUser, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              nombre_completo: data.nombre_completo,
              rol: 'residente'
            }
          }
        });

        if (authError) throw authError;

        // 4. Crear el registro en la tabla usuarios
        const { error: dbError } = await supabase
          .from('usuarios')
          .insert({
            id: authUser.user?.id,
            email: data.email,
            nombre_completo: data.nombre_completo,
            dni: data.dni,
            telefono: data.telefono,
            etapa: data.etapa,
            manzana: data.manzana,
            unidad: data.unidad,
            tipo_residente: data.tipo_residente,
            id_rol: rolData.id,
            estado: 'pendiente',
            eliminado: false
          });

        if (dbError) {
          // Si hay error al crear en la tabla, eliminar el usuario de Auth
          await supabase.auth.admin.deleteUser(authUser.user!.id);
          throw new Error('Error al crear el usuario en la base de datos');
        }

        return authUser.user;
      } catch (error) {
        // Si ocurre cualquier error después de crear el usuario en Auth,
        // intentamos eliminarlo para mantener la consistencia
        if (error instanceof Error && error.message.includes('auth')) {
          // Si el error fue en la creación del usuario en la tabla,
          // el usuario de Auth ya fue eliminado arriba
          const authUserData = await supabase.auth.getUser();
          if (authUserData.data.user) {
            await supabase.auth.admin.deleteUser(authUserData.data.user.id);
          }
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success(
        'Registro exitoso! Tu cuenta será revisada por administración.',
        { duration: 5000 }
      );
      router.push('/auth/registro-pendiente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al procesar el registro');
    }
  });
}