// components/cart/CartSummary.tsx

'use client';

import React from 'react';
import { CartSummary as CartSummaryType } from '@/types/cart.types';
import { formatPrice } from '@/lib/product/productHelper';

interface CartSummaryProps {
  summary: CartSummaryType;
  showDetails?: boolean;
}

export function CartSummary({ summary, showDetails = true }: CartSummaryProps) {
  return (
    <div className="space-y-2">
      {showDetails && (
        <>
          {/* Subtotal */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">
              {formatPrice(summary.subtotal)}
            </span>
          </div>

          {/* Delivery Fee */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="font-medium text-gray-900">
              {formatPrice(summary.deliveryFee)}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-2" />
        </>
      )}

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-900">Total</span>
        <span className="text-2xl font-bold text-gray-900">
          {formatPrice(summary.total)}
        </span>
      </div>

      {/* Item Count */}
      <p className="text-xs text-gray-500 text-center">
        {summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'} in cart
      </p>
    </div>
  );
}