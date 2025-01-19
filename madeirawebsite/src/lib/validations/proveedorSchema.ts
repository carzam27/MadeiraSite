// src/lib/validations/proveedorSchema.ts
import { z } from 'zod'

export const proveedorSchema = z.object({
  // Paso 1: Información Personal
  nombre_negocio: z.string().min(3, 'El nombre del negocio es requerido'),
  nombre_contacto: z.string().nullable(),
  id_categoria: z.string().uuid('Seleccione una categoría'),

  //telefono: z.string().nullable(), 
  whatsapp: z.string()
    .regex(/^09\d{8}$/, 'Formato válido: 09XXXXXXXX')
    .min(1, 'El celular es requerido'),
  email: z.string().email('Email inválido').nullable(),
  direccion: z.string().nullable(),

  sitio_web: z.string().nullable(),
  descripcion: z.string().nullable(),
  
  estado: z.enum(['activo', 'pendiente', 'rechazado']).default('pendiente'),
  eliminado: z.boolean().default(false),
  //creado_por: z.string().nullable(),
  //actualizado_por: z.string().nullable()
})

export type ProveedorFormData = z.infer<typeof proveedorSchema>