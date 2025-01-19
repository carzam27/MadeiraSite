// /src/hooks/useRegister.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { type RegisterFormData } from '@/lib/validations/schema';
import { createClient } from '@/lib/supabase/client'

export const useRegister = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const register = async (data: RegisterFormData) => {
    setIsLoading(true);
    
    try {
      // 1. Verificar si el email o cédula ya existen
      const { data: existingUser } = await supabase
        .from('usuarios')
        .select('id, email, cedula')
        .or(`email.eq.${data.email},cedula.eq.${data.cedula}`)
        .maybeSingle();

      if (existingUser) {
        if (existingUser.email === data.email) {
          throw new Error('Este email ya está registrado');
        }
        if (existingUser.cedula === data.cedula) {
          throw new Error('Esta cédula ya está registrada');
        }
      }

      // 2. Crear el usuario en Auth
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            nombres_completos: data.nombres_completos,
            rol: 'residente'
          }
        }
      });

      if (authError) throw authError;

      // 3. Crear el registro en la tabla usuarios
      const { error: dbError } = await supabase
        .from('usuarios')
        .insert({
          id: authUser.user?.id,
          email: data.email,
          nombres_completos: data.nombres_completos,
          cedula: data.cedula,
          telefono: data.telefono,
          etapa: data.etapa,
          manzana: data.manzana,
          villa: data.villa,
          tipo_residente: data.tipo_residente,
          estado: 'pendiente'
        });

      if (dbError) throw dbError;

      // 4. Notificar éxito
      toast.success(
        'Registro exitoso! Tu cuenta será revisada por administración.',
        { duration: 5000 }
      );

      // TODO: Enviar email de notificación al admin
      // await sendAdminNotification(data);

      // TODO: Enviar email de confirmación al usuario
      // await sendUserConfirmation(data);

      // 5. Redirigir a página de confirmación
      router.push('/auth/registro-pendiente');

    } catch (error) {
      console.error('Error en registro:', error);
      toast.error(
        error instanceof Error ? error.message : 'Error al procesar el registro'
      );
      
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading
  };
};