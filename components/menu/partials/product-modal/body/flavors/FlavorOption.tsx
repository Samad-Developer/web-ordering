import React from 'react';
import { Check } from 'lucide-react';
import { useProductModal } from '../../ProductModalContext';
import { cn } from '@/lib/utils';

interface FlavorOptionProps {
  flavor: { id: number; name: string };
  isSelected: boolean;
}

export function FlavorOption({ flavor, isSelected }: FlavorOptionProps) {
  const { setFlavor } = useProductModal();

  return (
    <button
      onClick={() => setFlavor(flavor.id)}
      className={cn(
        "relative w-full p-4 rounded-lg border-1 text-left transition-all",
        isSelected
          ? "border-red-500 bg-red-50"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 bg-white"
      )}
    >
      <div className="flex items-center justify-between">
        <div className={cn(
          "flex-1 font-medium",
          isSelected ? "text-red-700" : "text-gray-900"
        )}>
          {flavor.name}
        </div>

        {isSelected && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg z-10 border-2 border-white">
          <span className="text-white text-xs font-bold">✓</span>
        </div>
        )}
      </div>
    </button>
  );
}