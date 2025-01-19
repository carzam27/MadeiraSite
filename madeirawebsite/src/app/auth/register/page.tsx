'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, User, Mail, Phone, Lock, Home, AlertCircle, Loader2 } from 'lucide-react';
import { useCreateUsuario } from '@/hooks/useUsuario';
import { RegistroFormData, type RegistroUsuario } from '@/types/supabase';
import { registerSchema } from '@/lib/validations/schema';
import { PasswordStrength } from '@/components/ui/password-strength';
import Link from 'next/link';
import toast from 'react-hot-toast';

const RegistrationScreen = () => {
    const [step, setStep] = useState(1);
    const { mutate: createUsuario, isPending } = useCreateUsuario();

    const {
        register,
        handleSubmit,
        watch,
        trigger,
        setError,
        formState: { errors }
      } = useForm<RegistroFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onChange',
        criteriaMode: 'all',
        defaultValues: {
          nombre_completo: '',
          dni: '',
          email: '',
          telefono: '',
          password: '',
          etapa: undefined,
          manzana: '',
          unidad: '',
          tipo_residente: 'propietario',
          terminos: false
        }
      });


    const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {children}
            <span className="text-red-500 ml-1">*</span>
        </label>
    );

    const handleNextOrSubmit = async () => {
        if (step === 1) {
          const firstStepFields = [
            'nombre_completo',
            'dni',
            'email',
            'telefono',
            'password'
          ] as const;
          
          const firstStepValid = await trigger(firstStepFields);
          console.log('Validación primer paso:', firstStepValid);
          
          if (firstStepValid) {
            setStep(2);
          } else {
            const errorFields = firstStepFields.filter(field => errors[field]);
            const fieldNames = {
              nombre_completo: 'Nombres Completos',
              dni: 'Cédula de Identidad',
              email: 'Correo Electrónico',
              telefono: 'Teléfono',
              password: 'Contraseña'
            };
            
            const errorMessage = errorFields
              .map(field => fieldNames[field])
              .join(', ');
              
            toast.error(
              `Por favor, revise los siguientes campos: ${errorMessage}`, 
              { duration: 4000 }
            );
          }
        } else {
          const secondStepFields = [
            'etapa',
            'tipo_residente',
            'manzana',
            'unidad',
            'terminos'
          ] as const;
      
          const isValid = await trigger(secondStepFields);
          
          if (isValid) {
            try {
              const formData = watch();
              console.log('Datos a enviar:', formData);
              await handleSubmit((data) => {
                const { terminos, ...dataToSend } = formData;
        createUsuario(dataToSend);
              })();
            } catch (error) {
              console.error('Error al enviar formulario:', error);
              toast.error('Error al procesar el registro. Por favor, intente nuevamente.');
            }
          } else {
            const errorFields = secondStepFields.filter(field => errors[field]);
            const fieldNames = {
              etapa: 'Etapa',
              tipo_residente: 'Tipo de Residente',
              manzana: 'Manzana',
              unidad: 'Villa',
              terminos: 'Términos y Condiciones'
            };
            
            const errorMessage = errorFields
              .map(field => fieldNames[field])
              .join(', ');
              
            toast.error(
              `Por favor, revise los siguientes campos: ${errorMessage}`,
              { duration: 4000 }
            );
          }
        }
      };

    const watchPassword = watch('password');

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <header className="bg-blue-600 text-white">
                <div className="p-4 flex items-center">
                    <Link href="/auth/login" className="p-1">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                    <h1 className="ml-4 text-lg font-semibold">Registro</h1>
                </div>
            </header>

            {/* Progress Steps */}
            <div className="px-6 pt-6">
                <div className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-blue-600'
                        }`}>
                        <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 h-1 mx-2 bg-gray-200">
                        <div className={`h-full bg-blue-600 transition-all duration-300 ${step === 1 ? 'w-0' : 'w-full'
                            }`} />
                    </div>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-gray-200'
                        }`}>
                        <Home className={`h-5 w-5 ${step === 2 ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                </div>
                <div className="flex justify-between mt-2 text-sm">
                    <span className="text-blue-600 font-medium">Información Personal</span>
                    <span className={step === 2 ? 'text-blue-600 font-medium' : 'text-gray-400'}>
                        Información Residencial
                    </span>
                </div>
            </div>

            {/* Form */}
            <form className="p-6">
                {step === 1 ? (
                    <div className="space-y-4">
                        {/* Nombres Completos */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombres Completos
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 
      ${errors.nombre_completo ? 'text-red-400' : 'text-gray-400'}`}
                                />
                                <input
                                    type="text"
                                    {...register('nombre_completo', {
                                        onChange: (e) => {
                                            // Validación en tiempo real para nombre
                                            if (e.target.value.length > 0 && e.target.value.length < 3) {
                                                setError('nombre_completo', {
                                                    type: 'manual',
                                                    message: 'El nombre debe tener al menos 3 caracteres'
                                                });
                                            }
                                            // Validar que no contenga números
                                            if (/\d/.test(e.target.value)) {
                                                setError('nombre_completo', {
                                                    type: 'manual',
                                                    message: 'El nombre no debe contener números'
                                                });
                                            }
                                            // Validar que no tenga caracteres especiales
                                            if (/[!@#$%^&*(),.?":{}|<>]/.test(e.target.value)) {
                                                setError('nombre_completo', {
                                                    type: 'manual',
                                                    message: 'El nombre no debe contener caracteres especiales'
                                                });
                                            }
                                        }
                                    })}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
        ${errors.nombre_completo ?
                                            'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500' :
                                            'border-gray-300'
                                        }`}
                                    placeholder="Ingrese sus nombres completos"
                                />
                                {errors.nombre_completo && (
                                    <div className="mt-1 flex items-center space-x-1">
                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                        <p className="text-sm text-red-600">{errors.nombre_completo.message}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* DNI */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cédula de Identidad
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    {...register('dni', {
                                        onChange: (e) => {
                                            // Validación en tiempo real para cédula
                                            if (e.target.value.length > 0 && e.target.value.length !== 10) {
                                                setError('dni', {
                                                    type: 'manual',
                                                    message: 'La cédula debe tener 10 dígitos'
                                                });
                                            }
                                        }
                                    })}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
        ${errors.dni ?
                                            'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500' :
                                            'border-gray-300'
                                        }`}
                                    placeholder="Ingrese su número de cédula"
                                />
                                {errors.dni && (
                                    <div className="mt-1 flex items-center space-x-1">
                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                        <p className="text-sm text-red-600">{errors.dni.message}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Correo Electrónico
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 
      ${errors.email ? 'text-red-400' : 'text-gray-400'}`}
                                />
                                <input
                                    type="email"
                                    {...register('email')}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
        ${errors.email ?
                                            'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500' :
                                            'border-gray-300'
                                        }`}
                                    placeholder="correo@ejemplo.com"
                                />
                                {errors.email && (
                                    <div className="mt-1 flex items-center space-x-1">
                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                        <p className="text-sm text-red-600">{errors.email.message}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Teléfono
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="tel"
                                    {...register('telefono')}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0999999999"
                                />
                            </div>
                            {errors.telefono && (
                                <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
                            )}
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    {...register('password')}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ingrese su contraseña"
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                            <PasswordStrength password={watchPassword || ''} />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Etapa y Tipo */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Etapa
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <select
                                    {...register('etapa', {
                                        valueAsNumber: true, // Esto convierte automáticamente el valor a número
                                        required: 'La etapa es requerida'
                                    })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="1">Etapa 1</option>
                                    <option value="2">Etapa 2</option>
                                </select>
                                {errors.etapa && (
                                    <p className="mt-1 text-sm text-red-600">{errors.etapa.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo
                                </label>
                                <select
                                    {...register('tipo_residente')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="propietario">Propietario</option>
                                    <option value="inquilino">Inquilino</option>
                                </select>
                                {errors.tipo_residente && (
                                    <p className="mt-1 text-sm text-red-600">{errors.tipo_residente.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Manzana y Villa */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Manzana
                                </label>
                                <input
                                    type="text"
                                    {...register('manzana')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ej: 5"
                                />
                                {errors.manzana && (
                                    <p className="mt-1 text-sm text-red-600">{errors.manzana.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Villa
                                </label>
                                <input
                                    type="text"
                                    {...register('unidad')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ej: 123"
                                />
                                {errors.unidad && (
                                    <p className="mt-1 text-sm text-red-600">{errors.unidad.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Notice Box */}
                        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex">
                                <AlertCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium">Proceso de verificación</p>
                                    <p className="mt-1">Su registro será revisado por la administración para verificar los datos proporcionados. Recibirá un correo electrónico cuando su cuenta sea aprobada.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    {...register('terminos')}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    Acepto los términos y condiciones
                                </span>
                            </label>
                            {errors.terminos && (
                                <p className="mt-1 text-sm text-red-600">{errors.terminos.message}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="fixed bottom-0 inset-x-0 bg-white border-t p-4">
                    <div className="flex space-x-4">
                        {step === 2 && (
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium"
                            >
                                Anterior
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleNextOrSubmit}
                            disabled={isPending}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            ) : (
                                step === 1 ? 'Siguiente' : 'Completar Registro'
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RegistrationScreen;