import { ReactNode } from "react"

// src/types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          email: string
          password_hash: string
          nombre_completo: string
          telefono: string | null
          dni: string | null
          etapa: number | null
          manzana: string | null
          unidad: string
          tipo_residente: 'propietario' | 'inquilino' | 'familiar'
          id_rol: string
          estado: 'activo' | 'inactivo' | 'pendiente'
          fecha_creacion: string
          fecha_actualizacion: string
          creado_por: string | null
          actualizado_por: string | null
          eliminado: boolean
        }
        Insert: Omit<Database['public']['Tables']['usuarios']['Row'], 
          'id' | 'fecha_creacion' | 'fecha_actualizacion'>
        Update: Partial<Omit<Database['public']['Tables']['usuarios']['Row'], 'id'>>
      }
      roles: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          es_rol_sistema: boolean
          fecha_creacion: string
          eliminado: boolean
        }
        Insert: Omit<Database['public']['Tables']['roles']['Row'], 
          'id' | 'fecha_creacion'>
        Update: Partial<Omit<Database['public']['Tables']['roles']['Row'], 'id'>>
      }
      permisos: {
        Row: {
          id: string
          codigo: string
          nombre: string
          descripcion: string | null
          modulo: string
          eliminado: boolean
        }
        Insert: Omit<Database['public']['Tables']['permisos']['Row'], 'id'>
        Update: Partial<Omit<Database['public']['Tables']['permisos']['Row'], 'id'>>
      }
      roles_permisos: {
        Row: {
          id: string
          id_rol: string
          id_permiso: string
          fecha_creacion: string
          eliminado: boolean
        }
        Insert: Omit<Database['public']['Tables']['roles_permisos']['Row'], 
          'id' | 'fecha_creacion'>
        Update: Partial<Omit<Database['public']['Tables']['roles_permisos']['Row'], 'id'>>
      }
      categorias_servicios: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          icono: string | null
          orden_visualizacion: number
          estado: 'activo' | 'pendiente' | 'rechazado'
          fecha_creacion: string
          fecha_actualizacion: string
          creado_por: string | null
          actualizado_por: string | null
          eliminado: boolean
        }
        Insert: Omit<Database['public']['Tables']['categorias_servicios']['Row'], 
          'id' | 'fecha_creacion' | 'fecha_actualizacion'>
        Update: Partial<Omit<Database['public']['Tables']['categorias_servicios']['Row'], 'id'>>
      }
      proveedores_servicios: {
        Row: {
          categorias_servicios: any
          name: ReactNode
          business: ReactNode
          rating: ReactNode
          reviews: ReactNode
          category: ReactNode
          id: string
          id_categoria: string
          nombre_negocio: string
          nombre_contacto: string | null
          telefono: string
          whatsapp: string | null
          email: string | null
          direccion: string | null
          sitio_web: string | null
          descripcion: string | null
          promedio_calificacion: number
          total_resenas: number
          estado: 'activo' | 'pendiente' | 'rechazado'
          fecha_creacion: string
          fecha_actualizacion: string
          creado_por: string | null
          actualizado_por: string | null
          eliminado: boolean
        }
        Insert: Omit<Database['public']['Tables']['proveedores_servicios']['Row'], 
          'id' | 'fecha_creacion' | 'fecha_actualizacion' | 'promedio_calificacion' | 'total_resenas'>
        Update: Partial<Omit<Database['public']['Tables']['proveedores_servicios']['Row'], 'id'>>
      }
      resenas_proveedores: {
        Row: {
          id: string
          id_proveedor: string
          id_usuario: string
          calificacion: number
          comentario: string | null
          estado: 'activo' | 'pendiente' | 'rechazado'
          fecha_creacion: string
          fecha_actualizacion: string
          creado_por: string | null
          actualizado_por: string | null
          eliminado: boolean
        }
        Insert: Omit<Database['public']['Tables']['resenas_proveedores']['Row'],
          'id' | 'fecha_creacion' | 'fecha_actualizacion'>
        Update: Partial<Omit<Database['public']['Tables']['resenas_proveedores']['Row'], 'id'>>
      }
      favoritos_proveedores: {
        Row: {
          id: string
          id_proveedor: string
          id_usuario: string
          fecha_creacion: string
          creado_por: string | null
          eliminado: boolean
        }
        Insert: Omit<Database['public']['Tables']['favoritos_proveedores']['Row'],
          'id' | 'fecha_creacion'>
        Update: Partial<Omit<Database['public']['Tables']['favoritos_proveedores']['Row'], 'id'>>
      }
      menus: {
        Row: {
          id: string
          nombre: string
          ruta: string
          icono: string | null
          codigo_permiso: string
          orden_visualizacion: number
          id_padre: string | null
          visible: boolean
          eliminado: boolean
        }
        Insert: Omit<Database['public']['Tables']['menus']['Row'],
          'id'>
        Update: Partial<Omit<Database['public']['Tables']['menus']['Row'], 'id'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      tipo_residente: 'propietario' | 'inquilino' | 'familiar'
      estado_usuario: 'activo' | 'inactivo' | 'pendiente'
      estado_proveedor: 'activo' | 'pendiente' | 'rechazado'
    }
  }
}

// Helpers para acceder a los tipos
export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]

export type TableRow<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row']

export type TableInsert<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert']

export type TableUpdate<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update']

export type Enums<T extends keyof Database['public']['Enums']> = 
  Database['public']['Enums'][T]

// Tipos comunes
export type Usuario = TableRow<'usuarios'>
export type UsuarioInsert = TableInsert<'usuarios'>
export type UsuarioUpdate = TableUpdate<'usuarios'>

export type Proveedor = TableRow<'proveedores_servicios'>
//export type ProveedorInsert = TableInsert<'proveedores_servicios'>
export type ProveedorUpdate = TableUpdate<'proveedores_servicios'>

export type Categoria = TableRow<'categorias_servicios'>
export type CategoriaInsert = TableInsert<'categorias_servicios'>
export type CategoriaUpdate = TableUpdate<'categorias_servicios'>

export type Rol = TableRow<'roles'>
export type RolInsert = TableInsert<'roles'>
export type RolUpdate = TableUpdate<'roles'>

export type Permiso = TableRow<'permisos'>
export type PermisoInsert = TableInsert<'permisos'>
export type PermisoUpdate = TableUpdate<'permisos'>

export type RolPermiso = TableRow<'roles_permisos'>
export type RolPermisoInsert = TableInsert<'roles_permisos'>
export type RolPermisoUpdate = TableUpdate<'roles_permisos'>

// Tipos para relaciones comunes
export type RolConPermisos = Rol & {
  roles_permisos?: (RolPermiso & {
    permisos: Permiso
  })[]
}

export type UsuarioConRol = Usuario & {
  roles: Rol
}

export type Menu = TableRow<'menus'>
export type MenuInsert = TableInsert<'menus'>
export type MenuUpdate = TableUpdate<'menus'>

export type ProveedorResena = TableRow<'resenas_proveedores'>
export type ProveedorResenaInsert = TableInsert<'resenas_proveedores'>
export type ProveedorResenaUpdate = TableUpdate<'resenas_proveedores'>

export type ProveedorFavorito = TableRow<'favoritos_proveedores'>
export type ProveedorFavoritoInsert = TableInsert<'favoritos_proveedores'>
export type ProveedorFavoritoUpdate = TableUpdate<'favoritos_proveedores'>

// Tipos para relaciones comunes
export type MenuConPermiso = Menu & {
  permisos: Permiso
}

export type ProveedorConRelaciones = Proveedor & {
  categorias_servicios: Categoria
  resenas_proveedores?: ProveedorResena[]
  favoritos_proveedores?: ProveedorFavorito[]
}

export type ResenaConUsuario = ProveedorResena & {
  usuarios: Usuario
  proveedores_servicios: Proveedor
}


export type RegistroFormData = {
  email: string
  password: string
  nombre_completo: string
  telefono: string
  dni: string
  etapa: number
  manzana: string
  unidad: string
  tipo_residente: 'propietario' | 'inquilino'
  terminos: boolean
}

// Tipo para enviar a la API (sin terminos)
export type RegistroUsuario = Omit<RegistroFormData, 'terminos'>

export type ProveedorInsert = {
  id_categoria: string
  nombre_negocio: string
  nombre_contacto: string | null
  telefono: string
  whatsapp: string | null
  email: string | null
  direccion: string | null
  sitio_web: string | null
  descripcion: string | null
  estado: 'activo' | 'pendiente' | 'rechazado'
  creado_por: string | null
  actualizado_por: string | null
  eliminado: boolean
  // No incluimos los campos calculados/automáticos
  // categorias_servicios, promedio_calificacion, total_resenas
}