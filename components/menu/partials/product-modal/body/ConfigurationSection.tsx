import React, { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { useProductModal } from '../ProductModalContext';

interface ConfigurationSectionProps {
  title: string;
  subtitle?: string;
  required?: boolean;
  children: ReactNode;
  choiceId?: number; // For error display
}

export function ConfigurationSection({
  title,
  subtitle,
  required = false,
  children,
  choiceId,
}: ConfigurationSectionProps) {
  const { errors } = useProductModal();
  
  // Find error for this choice
  const error = choiceId 
    ? errors.find(e => e.groupId === choiceId) 
    : null;

  return (
    <div className="space-y-3 py-3">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-gray-900">
            {title}
          </h3>
          {required && (
            <span className="text-xs font-medium text-red-500">*</span>
          )}
        </div>
        
        {subtitle && (
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        )}
      </div>

      {/* Content */}
      <div>{children}</div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error.message}</span>
        </div>
      )}
    </div>
  );
}