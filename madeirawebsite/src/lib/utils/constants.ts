export const APP_NAME = 'Portal de Servicios Residenciales'

export const ROLES = {
  ADMIN: 'admin',
  ADMIN_CONTENIDO: 'admin_contenido',
  RESIDENTE: 'residente'
} as const

export const PERMISOS = {
  GESTIONAR_USUARIOS: 'GESTIONAR_USUARIOS',
  APROBAR_USUARIOS: 'APROBAR_USUARIOS',
  GESTIONAR_PROVEEDORES: 'GESTIONAR_PROVEEDORES',
  APROBAR_PROVEEDORES: 'APROBAR_PROVEEDORES',
  GESTIONAR_CATEGORIAS: 'GESTIONAR_CATEGORIAS',
  VER_REPORTES: 'VER_REPORTES'
} as const

export const ESTADOS_USUARIO = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
  PENDIENTE: 'pendiente'
} as const

export const ESTADOS_PROVEEDOR = {
  ACTIVO: 'activo',
  PENDIENTE: 'pendiente',
  RECHAZADO: 'rechazado'
} as const

export const TIPOS_RESIDENTE = {
  PROPIETARIO: 'propietario',
  INQUILINO: 'inquilino',
  FAMILIAR: 'familiar'
} as const

