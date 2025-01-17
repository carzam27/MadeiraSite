import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
})

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string(),
  nombre_completo: z.string().min(3, 'El nombre es muy corto'),
  unidad: z.string().min(1, 'La unidad es requerida'),
  tipo_residente: z.enum(['propietario', 'inquilino', 'familiar']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

export const proveedorSchema = z.object({
  nombre_negocio: z.string().min(3, 'El nombre es muy corto'),
  id_categoria: z.string().uuid('Categoría inválida'),
  nombre_contacto: z.string().optional(),
  telefono: z.string().min(9, 'Teléfono inválido'),
  whatsapp: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  direccion: z.string().optional(),
  sitio_web: z.string().url('URL inválida').optional().or(z.literal('')),
  descripcion: z.string().min(20, 'La descripción es muy corta'),
  estado: z.enum(['activo', 'pendiente', 'rechazado']).default('pendiente')
})

export const usuarioSchema = z.object({
  email: z.string().email('Email inválido'),
  nombre_completo: z.string().min(3, 'El nombre es muy corto'),
  telefono: z.string().optional(),
  dni: z.string().optional(),
  etapa: z.number().optional(),
  manzana: z.string().optional(),
  unidad: z.string().min(1, 'La unidad es requerida'),
  tipo_residente: z.enum(['propietario', 'inquilino', 'familiar']),
  id_rol: z.string().uuid('Rol inválido'),
  estado: z.enum(['activo', 'inactivo', 'pendiente']).default('pendiente')
})

export const categoriaSchema = z.object({
  nombre: z.string().min(3, 'El nombre es muy corto'),
  descripcion: z.string().optional(),
  icono: z.string().optional(),
  orden_visualizacion: z.number().default(0),
  estado: z.enum(['activo', 'pendiente', 'rechazado']).default('activo')
})