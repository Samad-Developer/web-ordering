import React from 'react';
import { Check } from 'lucide-react';
import { ProductVariation } from '@/types/product.types';
import { useProductModal } from '../../ProductModalContext';
import { formatPrice } from '@/lib/product/productHelper';
import { cn } from '@/lib/utils';

interface SizeOptionProps {
  variation: ProductVariation;
  isSelected: boolean;
}

export function SizeOption({ variation, isSelected }: SizeOptionProps) {
  const { setVariation } = useProductModal();

  return (
    <button
      onClick={() => setVariation(variation.Id)}
      className={cn(
        "relative w-full px-4 py-3 rounded-lg border-2 text-left transition-all cursor-pointer",
        isSelected
          ? "border-red-500 bg-red-50"
          : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-1 justify-between items-center">
          <div className="font-medium text-gray-900">
            {variation.Size.Name} - {variation.Flavour.Name}
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            {formatPrice(variation.Price)}
          </div>
        </div>

        {/* Checkmark */}
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