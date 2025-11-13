import React from 'react';
import { Check } from 'lucide-react';
import { useProductModal } from '../../ProductModalContext';
import { cn } from '@/lib/utils';

interface SizeOptionProps {
  size: { id: number; name: string };
  isSelected: boolean;
}

export function SizeOption({ size, isSelected }: SizeOptionProps) {
  const { setSize } = useProductModal();

  return (
    <button
      onClick={() => setSize(size.id)}
      className={cn(
        "relative p-4 rounded-lg border-2 text-center transition-all font-medium",
        isSelected
          ? "border-red-500 bg-red-50 text-red-700"
          : "border-gray-200 hover:border-gray-300 bg-white text-gray-900"
      )}
    >
      {size.name}
      
      {isSelected && (
        <div className="absolute -top-2 -right-2">
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </button>
  );
}