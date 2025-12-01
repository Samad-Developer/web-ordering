'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ShoppingCart } from 'lucide-react';

interface PlaceOrderButtonProps {
  onPlaceOrder: () => void;
  isSubmitting: boolean;
  totalAmount: number; // Optional: show total on button
  isDisabled?: boolean;
}

export function PlaceOrderButton({ 
  onPlaceOrder, 
  isSubmitting,
  totalAmount,
  isDisabled = false
}: PlaceOrderButtonProps) {
  return (
    <div className="space-y-3 ">
      <Button
        type="button"
        onClick={onPlaceOrder}
        className="w-full rounded-lg h-14 bg-red-600 hover:bg-red-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        disabled={isSubmitting || isDisabled}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing Order...
          </>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Place Order
            </span>
            {/* <span className="font-bold">Rs. {totalAmount.toLocaleString()}</span> */}
          </div>
        )}
      </Button>
      
      <p className="text-xs text-center text-gray-500">
        Your order will be confirmed shortly
      </p>
    </div>
  );
}