// src/app/api/public/test-connection/route.ts
import { supabase } from '@/lib/supabase/client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Primero intentamos una consulta simple
    const { data, error } = await supabase
      .from('roles')
      .select('count(*)', { count: 'exact', head: true })
    
    if (error) {
      console.error('Error Supabase:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: {
          hint: error.hint,
          code: error.code
        }
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        connection: 'success',
        timestamp: new Date().toISOString(),
        details: data
      }
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido',
      details: { error }
    }, { status: 500 })
  }
}