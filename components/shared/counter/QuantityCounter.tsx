// 'use client';

import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface QuantityCounterProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove?: () => void;
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
      className={`flex items-center bg-red-600 rounded-lg overflow-hidden shadow-md ${className}`}
      role="group"
      aria-label="Quantity controls"
    >
      <button
        onClick={showTrash ? onRemove : onDecrease}
        disabled={disabled}
        className="p-3 text-white hover:bg-red-700 active:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        className="px-6 py-3 bg-white text-gray-900 font-semibold min-w-[70px] text-center select-none"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {quantity}
      </div>

      <button
        onClick={onIncrease}
        disabled={disabled || isAtMax}
        className="p-3 text-white hover:bg-red-700 active:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
        type="button"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
};