// src/app/api/test/route.ts
import { supabase } from '@/lib/supabase/client'
import { NextResponse } from 'next/server'

export async function GET() {
  console.log('🚀 Iniciando prueba de conexión...')
  
  try {
    // Consultar roles con sus permisos
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select(`
        id,
        nombre,
        descripcion,
        roles_permisos (
          permisos (
            codigo,
            nombre,
            modulo
          )
        )
      `)
    
    if (rolesError) {
      console.error('❌ Error consultando roles:', rolesError)
      return NextResponse.json({ 
        success: false, 
        error: rolesError.message,
        details: rolesError
      }, { status: 500 })
    }

    // Consultar conteos de cada tabla principal
    const [
      { count: totalRoles },
      { count: totalPermisos },
      { count: totalRolesPermisos }
    ] = await Promise.all([
      supabase.from('roles').select('*', { count: 'exact', head: true }),
      supabase.from('permisos').select('*', { count: 'exact', head: true }),
      supabase.from('roles_permisos').select('*', { count: 'exact', head: true })
    ]);

    return NextResponse.json({ 
      success: true, 
      data: {
        message: 'Conexión exitosa',
        timestamp: new Date().toISOString(),
        estadisticas: {
          totalRoles,
          totalPermisos,
          totalRolesPermisos
        },
        roles
      }
    })

  } catch (error) {
    console.error('❌ Error inesperado:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido',
      details: error
    }, { status: 500 })
  }
}