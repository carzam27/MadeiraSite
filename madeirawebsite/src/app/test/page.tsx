// src/app/test/page.tsx
'use client'

import { useState } from 'react'

export default function TestPage() {
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testConnection = async () => {
    setLoading(true)
    setStatus('')
    setError(null)
    
    try {
      // Usar la ruta correcta de la API
      const response = await fetch('/api/test')
      
      if (!response.ok) {
        const text = await response.text()
        console.error('Error Response:', text)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Respuesta:', data)
      
      if (data.success) {
        setStatus(`✅ Conexión exitosa!\n${JSON.stringify(data.data, null, 2)}`)
      } else {
        setError(data.error)
      }
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Test de Conexión a Supabase</h1>
        
        <button
          onClick={testConnection}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Probando conexión...' : 'Probar Conexión'}
        </button>

        {status && (
          <div className="mt-6 p-4 rounded-lg border bg-green-50 border-green-200">
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {status}
            </pre>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 rounded-lg border bg-red-50 border-red-200 text-red-700">
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {error}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}