import React from 'react';
import { Discount } from '@/types/discount.types';
import { calculateDiscount } from '@/lib/discount/discountUtils';

interface PriceDisplayProps {
  price: number;
  discount: Discount | null | undefined;
  className?: string;
  showOriginalPrice?: boolean;
  showSavings?: boolean;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical';
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  discount,
  className = '',
  showOriginalPrice = true,
  showSavings = true,
  size = 'md',
  layout = 'horizontal',
}) => {
  const calculation = calculateDiscount(price, discount);

  const sizeClasses = {
    sm: {
      final: 'text-sm',
      original: 'text-xs',
      savings: 'text-[10px]',
    },
    md: {
      final: 'text-base',
      original: 'text-sm',
      savings: 'text-xs',
    },
    lg: {
      final: 'text-lg',
      original: 'text-base',
      savings: 'text-sm',
    },
  };

  // No discount - show normal price
  if (!calculation.hasDiscount) {
    return (
      <div className={`font-semibold ${sizeClasses[size].final} ${className}`}>
        Rs. {price}
      </div>
    );
  }

  // With discount
  if (layout === 'vertical') {
    return (
      <div className={`flex items-baseline justify-center gap-2 ${className}`}>
       
        {/* Final Price */}
        <span className={`font-semibold text-gray-700 ${sizeClasses[size].final}`}>
          Rs. {calculation.finalPrice.toFixed(0)}
        </span>

         {/* Original Price */}
         {showOriginalPrice && (
          <span className={`text-gray-400 line-through ${sizeClasses[size].original}`}>
            Rs. {calculation.originalPrice}
          </span>
        )}

 {showSavings && calculation.discountPercentage && (
        <span className={` text-xs font-semibold text-red-600 ${sizeClasses[size].savings}`}>
          (Save {calculation.discountPercentage.toFixed(0)}%)
        </span>
      )}
      </div>
    );
  }

  // Horizontal layout
  return (
    <div className={`flex items-baseline justify-start gap-2 ${className}`}>
      {/* Final Price */}
      <span className={`font-bold text-black ${sizeClasses[size].final}`}>
        Rs. {calculation.finalPrice.toFixed(0)}
      </span>

      {/* Original Price */}
      {showOriginalPrice && (
        <span className={`text-gray-400 line-through ${sizeClasses[size].original}`}>
          Rs. {calculation.originalPrice}
        </span>
      )}

      {/* Savings */}
      {/* {showSavings && calculation.discountPercentage && (
        <span className={`text-green-600 font-medium ${sizeClasses[size].savings}`}>
          (Save {calculation.discountPercentage.toFixed(0)}%)
        </span>
      )} */}
    </div>
  );
};