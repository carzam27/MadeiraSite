// /src/lib/validations/schema.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(32, 'La contraseña no debe exceder 32 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[@$!%*?&]/, 'Debe contener al menos un carácter especial (@$!%*?&)'),
  nombre_completo: z.string().min(3, 'El nombre es muy corto'),
  dni: z.string().length(10, 'La cédula debe tener 10 dígitos'),
  telefono: z.string().regex(/^09\d{8}$/, 'Formato inválido. Debe ser 09XXXXXXXX'),
  etapa: z.number({
    required_error: 'La etapa es requerida',
    invalid_type_error: 'Seleccione una etapa válida'
  }).min(1, 'Seleccione una etapa válida'),
  manzana: z.string().min(1, 'La manzana es requerida'),
  unidad: z.string().min(1, 'El número de villa es requerido'),
  tipo_residente: z.enum(['propietario', 'inquilino'], {
    errorMap: () => ({ message: 'Seleccione un tipo válido' })
  }),
  terminos: z.boolean().refine(val => val === true, {
    message: 'Debe aceptar los términos y condiciones'
  })
});