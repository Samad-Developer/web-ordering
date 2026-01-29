import React from 'react';
import { cn } from '@/lib/utils';
import { Discount } from '@/types/discount.types';
import { useProductModal } from '../../ProductModalContext';
import { PriceDisplay } from '../../../product-card/PriceDisplay';
import { calculateDiscount } from '@/lib/discount/discountUtils';

interface SizeOptionProps {
  size: {
    id: number;
    name: string;
    price: number;
    discount?: Discount | null;
  };
  isSelected: boolean;
}

export function SizeOption({ size, isSelected }: SizeOptionProps) {
  const { setSize } = useProductModal();
  const discountCalc = calculateDiscount(size.price, size.discount)

  return (
    <button
      onClick={() => setSize(size.id)}
      className={cn(
        "relative p-3 rounded-lg border-1 text-center transition-all flex flex-col items-center justify-center",
        isSelected
          ? "border-red-500 bg-red-50 text-red-700"
          : "border-gray-200 hover:border-gray-300 bg-white text-gray-900"
      )}
    >
      <p className=' text-xs font-semibold text-red-600'>Save {discountCalc.discountPercentage}%</p>

      <h1 className='font-semibold text-base'>{size.name}</h1>

      {/* ✅ Show price with discount */}
      <PriceDisplay
        price={size.price}
        discount={size.discount}
        size="sm"
        showSavings={false}
        layout="vertical"
      />

      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg z-10 border-2 border-white">
          <span className="text-white text-xs font-bold">✓</span>
        </div>
      )}
    </button>
  );
}