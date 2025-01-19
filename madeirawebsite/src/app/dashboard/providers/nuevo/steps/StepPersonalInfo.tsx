// src/app/dashboard/proveedores/nuevo/steps/StepPersonalInfo.tsx
import { User, Briefcase } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import type { ProveedorFormData } from '@/lib/validations/proveedorSchema'
import { useCategorias } from '@/lib/hooks/queries/useCategorias'

interface StepPersonalInfoProps {
  form: UseFormReturn<ProveedorFormData>
}

export function StepPersonalInfo({ form }: StepPersonalInfoProps) {
  const { data: categorias = [], isLoading } = useCategorias()
  const { register, formState: { errors } } = form

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-4">Información Personal</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              {...register('nombre_contacto')}
              type="text"
              placeholder="Nombre del proveedor"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors
                ${errors.nombre_contacto 
                  ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
                } focus:ring-2 focus:border-transparent`}
            />
          </div>
          {errors.nombre_contacto && (
            <p className="mt-1 text-sm text-red-600">{errors.nombre_contacto.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la empresa<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              {...register('nombre_negocio')}
              type="text"
              placeholder="Nombre de la empresa"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors
                ${errors.nombre_negocio 
                  ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
                } focus:ring-2 focus:border-transparent`}
            />
          </div>
          {errors.nombre_negocio && (
            <p className="mt-1 text-sm text-red-600">{errors.nombre_negocio.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría de servicio<span className="text-red-500 ml-1">*</span>
          </label>
          <select
            {...register('id_categoria')}
            className={`w-full px-4 py-3 border rounded-lg transition-colors
              ${errors.id_categoria 
                ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
              } focus:ring-2 focus:border-transparent`}
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
          {errors.id_categoria && (
            <p className="mt-1 text-sm text-red-600">{errors.id_categoria.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}