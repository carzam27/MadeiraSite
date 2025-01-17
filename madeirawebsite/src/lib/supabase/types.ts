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
export type ProveedorInsert = TableInsert<'proveedores_servicios'>
export type ProveedorUpdate = TableUpdate<'proveedores_servicios'>

export type Categoria = TableRow<'categorias_servicios'>
export type CategoriaInsert = TableInsert<'categorias_servicios'>
export type CategoriaUpdate = TableUpdate<'categorias_servicios'>