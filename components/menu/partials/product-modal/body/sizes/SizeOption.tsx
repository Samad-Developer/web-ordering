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
        "relative p-4 rounded-lg border-1 text-center transition-all font-medium",
        isSelected
          ? "border-red-500 bg-red-50 text-red-700"
          : "border-gray-200 hover:border-gray-300 bg-white text-gray-900"
      )}
    >
      {size.name}
      
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg z-10 border-2 border-white">
          <span className="text-white text-xs font-bold">✓</span>
        </div>
      )}
    </button>
  );
}