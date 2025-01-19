import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
})

export const registerSchema = z.object({
  nombre_completo: z.string().min(3, 'El nombre es muy corto'),
  dni: z.string().length(10, 'La cédula debe tener 10 dígitos'),
  email: z.string().email('Email inválido'),
  telefono: z.string().regex(/^09\d{8}$/, 'Formato inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  etapa: z.number().min(1, 'Seleccione una etapa'),
  manzana: z.string().min(1, 'Ingrese la manzana'),
  unidad: z.string().min(1, 'Ingrese la villa'),
  tipo_residente: z.enum(['propietario', 'inquilino']),
  terminos: z.boolean().refine(val => val === true, {
    message: 'Debe aceptar los términos y condiciones'
  })
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

/**
 * Valida una cédula ecuatoriana
 * @param cedula - Número de cédula a validar
 * @returns boolean indicando si la cédula es válida
 */
export const validateCedula = (cedula: string): boolean => {
  // Validación básica de longitud y formato
  if (!/^\d{10}$/.test(cedula)) return false;

  // Validación de provincia (códigos del 01 al 24)
  const provincia = parseInt(cedula.substring(0, 2));
  if (provincia < 1 || provincia > 24) return false;

  // Algoritmo de validación del último dígito
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  const verificador = parseInt(cedula.charAt(9));
  
  let suma = 0;
  for (let i = 0; i < coeficientes.length; i++) {
    let valor = parseInt(cedula.charAt(i)) * coeficientes[i];
    suma += valor > 9 ? valor - 9 : valor;
  }

  const digitoVerificador = suma % 10 === 0 ? 0 : 10 - (suma % 10);
  return verificador === digitoVerificador;
};

/**
 * Valida un número de teléfono celular ecuatoriano
 * @param telefono - Número de teléfono a validar
 * @returns boolean indicando si el teléfono es válido
 */
export const validateTelefono = (telefono: string): boolean => {
  // Formato: 10 dígitos, comenzando con 09
  return /^09\d{8}$/.test(telefono);
};

/**
 * Valida la fortaleza de una contraseña
 * @param password - Contraseña a validar
 * @returns Objeto con el resultado de cada validación
 */
export interface PasswordValidation {
  hasMinLength: boolean;      // Mínimo 8 caracteres
  hasUppercase: boolean;      // Al menos una mayúscula
  hasLowercase: boolean;      // Al menos una minúscula
  hasNumber: boolean;         // Al menos un número
  hasSpecialChar: boolean;    // Al menos un carácter especial
  isValidLength: boolean;     // No excede 32 caracteres
}

export const validatePassword = (password: string): PasswordValidation => {
  return {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@$!%*?&]/.test(password),
    isValidLength: password.length <= 32
  };
};

/**
 * Calcula la fortaleza de la contraseña en porcentaje
 * @param validation - Resultado de validatePassword
 * @returns número entre 0 y 100
 */
export const calculatePasswordStrength = (validation: PasswordValidation): number => {
  const requirements = Object.values(validation);
  const validCount = requirements.filter(Boolean).length;
  return Math.round((validCount / requirements.length) * 100);
};

/**
 * Obtiene el color de la barra de fortaleza según el porcentaje
 * @param strength - Porcentaje de fortaleza
 * @returns string con el color en formato Tailwind
 */
export const getPasswordStrengthColor = (strength: number): string => {
  if (strength < 33) return 'bg-red-500';
  if (strength < 66) return 'bg-yellow-500';
  return 'bg-green-500';
};