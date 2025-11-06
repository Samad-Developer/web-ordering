import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/product/productHelper';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  onClick: () => void;
  disabled?: boolean;
  price: number;
  label?: string;
  icon?: ReactNode;
  className?: string;
}

export function AddToCartButton({
  onClick,
  disabled = false,
  price,
  label = 'Add to Cart',
  icon,
  className,
}: AddToCartButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size="lg"
      className={cn(
        "flex-1 h-12 text-base font-semibold",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="flex items-center justify-between w-full gap-3">
        <div className="flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </div>
        <span className="font-bold">{formatPrice(price)}</span>
      </div>
    </Button>
  );
}