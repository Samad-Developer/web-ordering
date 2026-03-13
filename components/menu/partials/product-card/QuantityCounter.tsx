// 'use client';

import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface QuantityCounterProps {
  quantity: number;
  onIncrease: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDecrease: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  min?: number;
  max?: number;
  className?: string;
  disabled?: boolean;
}

export const QuantityCounter: React.FC<QuantityCounterProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
  min = 1,
  max = 99,
  className = '',
  disabled = false,
}) => {
  const isAtMin = quantity <= min;
  const isAtMax = quantity >= max;
  const showTrash = isAtMin && onRemove;

  return (
    <div 
  className={`flex items-stretch w-full border rounded-lg overflow-hidden ${className}`}
  role="group"
  aria-label="Quantity controls"
>
  <button
    onClick={showTrash ? onRemove : onDecrease}
    disabled={disabled}
    className="flex-shrink-0 cursor-pointer px-2 py-1.5 text-white bg-popup-qty-btn hover:opacity-90  disabled:opacity-50 disabled:cursor-not-allowed"
    aria-label={showTrash ? 'Remove item' : 'Decrease quantity'}
    type="button"
  >
    {showTrash ? (
      <Trash2 className="w-5 h-5" />
    ) : (
      <Minus className="w-5 h-5" />
    )}
  </button>

  <div 
    className="flex-1 flex items-center justify-center py-1.5 text-popup-qty-fg font-bold text-lg bg-white select-none"
    role="status"
    aria-live="polite"
    aria-atomic="true"
  >
    {quantity}
  </div>

  <button
    onClick={onIncrease}
    disabled={disabled || isAtMax}
    className="flex-shrink-0 cursor-pointer px-2 py-1.5 text-white bg-popup-qty-btn hover:opacity-90  disabled:opacity-50 disabled:cursor-not-allowed"
    aria-label="Increase quantity"
    type="button"
  >
    <Plus className="w-5 h-5" />
  </button>
</div>
  );
};