// src/hooks/useProveedorForm.ts
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { useEffect } from 'react'
import { proveedorSchema, type ProveedorFormData } from '@/lib/validations/proveedorSchema'
import { useCreateProveedor } from '@/lib/hooks/queries/useProveedores'
import type { ProveedorInsert } from '@/types/supabase'
import { useSession } from 'next-auth/react'

export function useProveedorForm() {
  const router = useRouter()
  const { mutate: createProveedor, isPending } = useCreateProveedor()
  const { data: session } = useSession()

  const form = useForm<ProveedorFormData>({
    resolver: zodResolver(proveedorSchema),
    defaultValues: {
      nombre_negocio: '',
      nombre_contacto: '',
      id_categoria: '',
      whatsapp: '',  // Requerido
      email: null,
      direccion: null,
      sitio_web: null,
      descripcion: null,
      estado: 'activo',
      eliminado: false
    }
  })

  // Watch nombre_negocio para actualizar nombre_contacto
  const nombreNegocio = form.watch('nombre_negocio')
  useEffect(() => {
    const nombreContactoField = form.getFieldState('nombre_contacto')
    if (!nombreContactoField.isDirty) {
      form.setValue('nombre_contacto', nombreNegocio)
    }
  }, [nombreNegocio, form])

  const onSubmit = async (formData: ProveedorFormData) => {
    try {
        console.log('DEBUG: Iniciando onSubmit con datos:', formData)
        console.log('Iniciando onSubmit con datos:', formData)
      // Convertir los datos del formulario al formato esperado por la BD
      const proveedorData: ProveedorInsert = {
          nombre_negocio: formData.nombre_negocio,
          nombre_contacto: formData.nombre_contacto || null,
          id_categoria: formData.id_categoria,
          whatsapp: formData.whatsapp,
          email: formData.email || null,
          direccion: formData.direccion || null,
          sitio_web: formData.sitio_web || null,
          descripcion: formData.descripcion || null,
          estado: 'activo',
          eliminado: false,
          creado_por: session?.user?.id || null, // Usa el ID del usuario de la sesión
          actualizado_por: session?.user?.id || null, // Usa el ID del usuario de la sesión
          telefono: formData.whatsapp,
      }

      console.log('Datos convertidos:', proveedorData)

      createProveedor(proveedorData, {
        onSuccess: () => {
            console.log('Proveedor creado exitosamente')
          toast.success('Proveedor registrado exitosamente')
          router.push('/dashboard')
        },
        onError: (error) => {
            console.error('Error en createProveedor:', error)
          toast.error(
            error instanceof Error 
              ? error.message 
              : 'Error al registrar el proveedor'
          )
        }
      })
    } catch (error) {
      console.error('Error en submit:', error)
      toast.error('Error al procesar el formulario')
    }
  }

  return {
    form,
    onSubmit,
    isPending
  }
}