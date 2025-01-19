// /app/auth/registro-pendiente/page.tsx
'use client';

import Link from 'next/link';
import { ChevronLeft, CheckCircle2, Clock } from 'lucide-react';

export default function RegistroPendientePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white">
        <div className="p-4 flex items-center">
          <Link href="/auth/login" className="p-1">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="ml-4 text-lg font-semibold">Registro Pendiente</h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-md mx-auto p-6 space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <CheckCircle2 className="h-20 w-20 text-blue-600" />
            <Clock className="h-8 w-8 text-blue-400 absolute bottom-0 right-0" />
          </div>
        </div>

        {/* Message */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            ¡Registro Completado!
          </h2>
          
          <div className="space-y-4 text-gray-600">
            <p>
              Tu solicitud de registro ha sido recibida exitosamente y está pendiente
              de aprobación por parte de la administración.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-blue-900 mb-2">Próximos pasos:</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  La administración revisará tus datos proporcionados
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  Recibirás un correo electrónico cuando tu cuenta sea aprobada
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  Una vez aprobada, podrás acceder a tu cuenta
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6">
          <Link
            href="/auth/login"
            className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Volver al inicio de sesión
          </Link>
          
          <p className="mt-4 text-center text-sm text-gray-600">
            ¿Tienes alguna pregunta? Contacta a{' '}
            <a href="mailto:soporte@ejemplo.com" className="text-blue-600 hover:text-blue-800">
              soporte@ejemplo.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}