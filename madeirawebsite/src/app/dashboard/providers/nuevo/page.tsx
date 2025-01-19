// src/app/dashboard/proveedores/nuevo/page.tsx
'use client'

import { SetStateAction, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, User, Briefcase, Phone, Mail, MapPin, Globe } from 'lucide-react'
import { useProveedorForm } from '@/hooks/useProveedorForm'
import { useCategorias } from '@/lib/hooks/queries/useCategorias'
import { Combobox } from '@headlessui/react'

export default function NuevoProveedorPage() {
  const router = useRouter()
  const { data: categorias = [] } = useCategorias()
  const { form, onSubmit, isPending } = useProveedorForm()
  const [query, setQuery] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = form
  

  // Filtrar categorías para el autocompletado
  const filteredCategorias = query === ''
    ? categorias
    : categorias.filter((categoria) =>
        categoria.nombre
          .toLowerCase()
          .includes(query.toLowerCase())
      )

  const handleCancel = () => {
    if (window.confirm('¿Está seguro de cancelar? Se perderán los datos ingresados.')) {
      router.back()
    }
  }

  const handleFormSubmit = form.handleSubmit(
    (data) => {
      //console.log('DEBUG: Datos del formulario válidos:', data);
      onSubmit(data);
    }/*, 
    (errors) => {
      console.error('DEBUG: Errores de validación:', errors);
    }*/
  );



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center h-16">
            <button 
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="ml-2 text-xl font-semibold text-gray-900">
              Nuevo Proveedor
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit();
        }}     className="space-y-8">
          {/* Campos Requeridos */}
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Información Principal
              <span className="text-sm font-normal text-red-500 ml-1">
                * Campos requeridos
              </span>
            </h2>

            {/* Nombre del Negocio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Negocio<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('nombre_negocio')}
                  type="text"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors
                    ${errors.nombre_negocio ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                  placeholder="Nombre del negocio"
                />
              </div>
              {errors.nombre_negocio && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre_negocio.message}</p>
              )}
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría<span className="text-red-500 ml-1">*</span>
              </label>
              <Combobox
                value={watch('id_categoria')}
                onChange={(value: string) => setValue('id_categoria', value)}
              >
                <div className="relative">
                  <Combobox.Input
                    className={`w-full pl-4 pr-10 py-3 border rounded-lg transition-colors
                      ${errors.id_categoria ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                    onChange={(event: { target: { value: SetStateAction<string> } }) => setQuery(event.target.value)}
                    displayValue={(id: string) => 
                      categorias.find(cat => cat.id === id)?.nombre || ''
                    }
                    placeholder="Seleccione una categoría"
                  />
                  <Combobox.Options className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
                    {filteredCategorias.map((categoria) => (
                      <Combobox.Option
                        key={categoria.id}
                        value={categoria.id}
                        className={({ active }: { active: boolean }) =>
                            `py-2 px-4 cursor-pointer ${
                              active ? 'bg-blue-600 text-white' : 'text-gray-900'
                            }`
                          }
                      >
                        {categoria.nombre}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </div>
              </Combobox>
              {errors.id_categoria && (
                <p className="mt-1 text-sm text-red-600">{errors.id_categoria.message}</p>
              )}
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('whatsapp')}
                  type="tel"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors
                    ${errors.whatsapp ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                  placeholder="09XXXXXXXX"
                />
              </div>
              {errors.whatsapp && (
                <p className="mt-1 text-sm text-red-600">{errors.whatsapp.message}</p>
              )}
            </div>
          </div>

          {/* Campos Opcionales */}
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Información Adicional
              <span className="text-sm font-normal text-gray-500 ml-2">
                (Opcional)
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre de Contacto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de Contacto
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('nombre_contacto')}
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="Nombre del contacto"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('direccion')}
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="Dirección física"
                  />
                </div>
              </div>

              {/* Sitio Web */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sitio Web
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('sitio_web')}
                    type="url"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="www.ejemplo.com"
                  />
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                {...register('descripcion')}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Describe los servicios ofrecidos..."
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit" 
              disabled={isPending}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? 'Guardando...' : 'Guardar Proveedor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}