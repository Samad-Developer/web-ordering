// components/checkout/OrderModeSelector.tsx

'use client';

import React from 'react';
import { Truck, Store } from 'lucide-react';
import { OrderMode } from '@/types/checkout.types';
import { cn } from '@/lib/utils';

interface OrderModeSelectorProps {
  value: OrderMode;
  onChange: (mode: OrderMode) => void;
}

export function OrderModeSelector({ value, onChange }: OrderModeSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-gray-900">
        Order Type <span className="text-red-500">*</span>
      </label>
      
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange('delivery')}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
            value === 'delivery'
              ? "border-red-500 bg-red-50"
              : "border-gray-200 hover:border-gray-300 bg-white"
          )}
        >
          <Truck className={cn(
            "w-6 h-6",
            value === 'delivery' ? "text-red-500" : "text-gray-400"
          )} />
          <span className={cn(
            "font-medium text-sm",
            value === 'delivery' ? "text-red-700" : "text-gray-700"
          )}>
            Delivery
          </span>
        </button>

        <button
          type="button"
          onClick={() => onChange('pickup')}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
            value === 'pickup'
              ? "border-red-500 bg-red-50"
              : "border-gray-200 hover:border-gray-300 bg-white"
          )}
        >
          <Store className={cn(
            "w-6 h-6",
            value === 'pickup' ? "text-red-500" : "text-gray-400"
          )} />
          <span className={cn(
            "font-medium text-sm",
            value === 'pickup' ? "text-red-700" : "text-gray-700"
          )}>
            Pickup
          </span>
        </button>
      </div>
    </div>
  );
}