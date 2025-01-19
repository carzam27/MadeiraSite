// src/app/dashboard/proveedores/nuevo/components/StepAdditionalInfo.tsx
import { Globe, Facebook, Instagram, Twitter } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import type { ProveedorFormData } from '@/lib/validations/proveedorSchema'

interface StepAdditionalInfoProps {
  form: UseFormReturn<ProveedorFormData>
}

export function StepAdditionalInfo({ form }: StepAdditionalInfoProps) {
  const { register, formState: { errors } } = form

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-4">Información Adicional</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sitio web
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              {...register('sitio_web')}
              type="url"
              placeholder="www.ejemplo.com"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors
                ${errors.sitio_web 
                  ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
                } focus:ring-2 focus:border-transparent`}
            />
          </div>
          {errors.sitio_web && (
            <p className="mt-1 text-sm text-red-600">{errors.sitio_web.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción del servicio<span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            {...register('descripcion')}
            rows={4}
            placeholder="Describe los servicios ofrecidos..."
            className={`w-full px-4 py-3 border rounded-lg transition-colors
              ${errors.descripcion 
                ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
              } focus:ring-2 focus:border-transparent`}
          />
          {errors.descripcion && (
            <p className="mt-1 text-sm text-red-600">{errors.descripcion.message}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Describe detalladamente los servicios que ofreces, experiencia, y cualquier información relevante para los clientes.
          </p>
        </div>

        {/* Nota: Las redes sociales no están en el schema original,
            se podrían agregar como campos adicionales si son necesarios */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Información importante</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• La información proporcionada será revisada antes de su publicación</li>
            <li>• Asegúrate de que los datos de contacto sean correctos</li>
            <li>• Mantén la descripción clara y profesional</li>
          </ul>
        </div>
      </div>
    </div>
  )
}