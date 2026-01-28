import React from 'react';
import { Discount } from '@/types/discount.types';
import { formatDiscountLabel } from '@/lib/discount/discountUtils';
import { Tag } from 'lucide-react';

interface DiscountBadgeProps {
  discount: Discount | null | undefined;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const DiscountBadge: React.FC<DiscountBadgeProps> = ({
  discount,
  className = '',
  size = 'md',
}) => {
  if (!discount) return null;

  const label = formatDiscountLabel(discount);

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <div
      className={`
        relative overflow-hidden
        inline-flex items-center gap-1 
        bg-red-500 text-white font-bold rounded 
        ${sizeClasses[size]} ${className}
       
      `}
    >
      {/* Shine overlay */}
      <div className="absolute inset-0 shimmer-overlay" />
      
      {/* Content */}
      <Tag className="w-3 h-3 relative z-10" />
      <span className="relative z-10">{label}</span>
    </div>
  );
};