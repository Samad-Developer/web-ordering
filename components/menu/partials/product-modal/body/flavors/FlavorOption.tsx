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
        "relative w-full p-4 rounded-lg border-2 text-left transition-all",
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
          <div className="flex-shrink-0 ml-3">
            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>
    </button>
  );
}