// src/app/dashboard/proveedores/nuevo/components/StepContactInfo.tsx
import { Phone, Mail, MapPin } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import type { ProveedorFormData } from '@/lib/validations/proveedorSchema'

interface StepContactInfoProps {
  form: UseFormReturn<ProveedorFormData>
}

export function StepContactInfo({ form }: StepContactInfoProps) {
  const { register, formState: { errors } } = form

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-4">Información de Contacto</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono principal<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              {...register('telefono')}
              type="tel"
              placeholder="0999999999"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors
                ${errors.telefono 
                  ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
                } focus:ring-2 focus:border-transparent`}
            />
          </div>
          {errors.telefono && (
            <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            WhatsApp
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              {...register('whatsapp')}
              type="tel"
              placeholder="0999999999"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors
                ${errors.whatsapp 
                  ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
                } focus:ring-2 focus:border-transparent`}
            />
          </div>
          {errors.whatsapp && (
            <p className="mt-1 text-sm text-red-600">{errors.whatsapp.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              {...register('email')}
              type="email"
              placeholder="correo@ejemplo.com"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors
                ${errors.email 
                  ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
                } focus:ring-2 focus:border-transparent`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dirección
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              {...register('direccion')}
              type="text"
              placeholder="Dirección física"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors
                ${errors.direccion 
                  ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
                } focus:ring-2 focus:border-transparent`}
            />
          </div>
          {errors.direccion && (
            <p className="mt-1 text-sm text-red-600">{errors.direccion.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}