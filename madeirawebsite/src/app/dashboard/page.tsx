// src/app/dashboard/page.tsx
'use client'

import { useState } from 'react'
import { Search, Star, Phone, MessageSquare, Plus, Filter,ChevronDown } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useProveedores } from '@/lib/hooks/queries/useProveedores'
import { useCategorias } from '@/lib/hooks/queries/useCategorias'
import { useToggleFavorito } from '@/lib/hooks/queries/useFavoritos'
import type { Proveedor } from '@/types/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
  const [searchTerm, setSearchTerm] = useState('')


  //const { data: session } = useSession()
  const { data: providers = [], isLoading: loadingProviders } = useProveedores()
  const { data: categories = [], isLoading: loadingCategories } = useCategorias()
  const { mutate: toggleFavorite } = useToggleFavorito()
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = '/auth/login'
    }
  })


  const [showAllCategories, setShowAllCategories] = useState(false)
  const router = useRouter()

  if (status === 'loading') {
    return <div>Cargando...</div>
  }

  if (!session) {
    return null
  }

  if (session) {
    console.log("Session: "+session?.user?.email);
  }


  // Filtrar proveedores
  const filteredProviders = providers.filter(provider => {
    const matchesCategory = selectedCategory === 'todos' || 
      provider.categorias_servicios?.id === selectedCategory
    const matchesSearch = searchTerm === '' || 
      provider.nombre_negocio.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleToggleFavorite = (providerId: string) => {
    if (session?.user?.id) {
      toggleFavorite({ 
        proveedorId: providerId, 
        userId: session.user.id 
      })
    }
  }

  const handleCreateProveedor = () => {
    router.push('/dashboard/providers/nuevo')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Search */}
      <div className="bg-white shadow-sm px-4 py-4">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="Buscar proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      <button 
        className="fixed bottom-6 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 z-50"
        onClick={handleCreateProveedor}
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Categories */}
{!loadingCategories && (
  <div className="px-4 py-3 bg-white border-t">
    <div className="grid grid-cols-4 gap-2">
      {/* Botón Todos siempre visible */}
      <button
        onClick={() => setSelectedCategory('todos')}
        className={`col-span-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
          ${selectedCategory === 'todos'
            ? 'bg-blue-100 text-blue-600' 
            : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}
      >
        Todos
      </button>

      {/* Mostrar primeras 6 categorías en mobile, 8 en tablet */}
      {categories.slice(0, showAllCategories ? undefined : 6).map((category) => (
        <button
          key={category.id}
          onClick={() => setSelectedCategory(category.id)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors
            ${selectedCategory === category.id
              ? 'bg-blue-100 text-blue-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}
        >
          {category.nombre}
        </button>
      ))}

      {/* Botón "Ver más" si hay más categorías */}
      {!showAllCategories && categories.length > 6 && (
        <button
          onClick={() => setShowAllCategories(true)}
          className="col-span-2 px-3 py-2 rounded-lg text-sm font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 flex items-center justify-center gap-1"
        >
          Ver más
          <ChevronDown className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
)}

      {/* Provider List */}
      <div className="p-4 space-y-4">
        {loadingProviders ? (
          <div>Cargando proveedores...</div>
        ) : filteredProviders.length > 0 ? (
          filteredProviders.map((provider) => (
            <div key={provider.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{provider.nombre_negocio}</h3>
                  <p className="text-sm text-gray-600">{provider.nombre_contacto}</p>
                  <div className="flex items-center mt-1">
                    <span className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1">{provider.promedio_calificacion}</span>
                    </span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-600">{provider.total_resenas} reseñas</span>
                  </div>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                  {provider.categorias_servicios?.nombre}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <a
                  href={`tel:${provider.telefono}`}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar
                </a>
                {provider.whatsapp && (
                  <a
                    href={`https://wa.me/${provider.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            No se encontraron proveedores
          </div>
        )}
      </div>

      {session?.user?.role === 'admin' && (
        <button 
          className="fixed bottom-6 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
          onClick={() => {/* Implementar navegación a crear proveedor */}}
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

      {/* Filter Modal */}
      {showFilters && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
    <div className="bg-white rounded-t-2xl p-6 w-full animate-slide-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Filtros</h2>
        <button onClick={() => setShowFilters(false)} className="text-gray-400">
          ×
        </button>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Categorías</h3>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <label 
                key={category.id} 
                className="flex items-center space-x-2"
              >
                <input 
                  type="checkbox"
                  className="rounded text-blue-600"
                  checked={selectedCategory === category.id}
                  onChange={() => setSelectedCategory(
                    selectedCategory === category.id ? 'todos' : category.id
                  )}
                />
                <span className="text-sm">{category.nombre}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Calificación mínima</h3>
          <input 
            type="range" 
            className="w-full" 
            min="1" 
            max="5" 
            step="0.5" 
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>1★</span>
            <span>5★</span>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => {
              setSelectedCategory('todos')
              setShowFilters(false)
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
          >
            Limpiar
          </button>
          <button
            onClick={() => setShowFilters(false)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  )
}