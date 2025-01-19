'use client';

import { Check, X } from 'lucide-react';
import { 
  validatePassword, 
  calculatePasswordStrength, 
  getPasswordStrengthColor,
  type PasswordValidation 
} from '@/lib/utils/validation';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  const validation = validatePassword(password);
  const strength = calculatePasswordStrength(validation);
  const strengthColor = getPasswordStrengthColor(strength);

  return (
    <div className="mt-2 space-y-3">
      {/* Barra de progreso */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${strengthColor} transition-all duration-300 ease-out`}
          style={{ width: `${strength}%` }}
        />
      </div>

      {/* Lista de requisitos */}
      <div className="space-y-2 text-sm">
        <RequirementItem
          isValid={validation.hasMinLength}
          text="Mínimo 8 caracteres"
        />
        <RequirementItem
          isValid={validation.hasUppercase}
          text="Al menos una mayúscula"
        />
        <RequirementItem
          isValid={validation.hasLowercase}
          text="Al menos una minúscula"
        />
        <RequirementItem
          isValid={validation.hasNumber}
          text="Al menos un número"
        />
        <RequirementItem
          isValid={validation.hasSpecialChar}
          text="Al menos un carácter especial (@$!%*?&)"
        />
        <RequirementItem
          isValid={validation.isValidLength}
          text="Máximo 32 caracteres"
        />
      </div>
    </div>
  );
};

interface RequirementItemProps {
  isValid: boolean;
  text: string;
}

const RequirementItem = ({ isValid, text }: RequirementItemProps) => (
  <div className="flex items-center space-x-2">
    {isValid ? (
      <Check className="w-4 h-4 text-green-500" />
    ) : (
      <X className="w-4 h-4 text-red-500" />
    )}
    <span className={isValid ? 'text-gray-600' : 'text-gray-400'}>
      {text}
    </span>
  </div>
);