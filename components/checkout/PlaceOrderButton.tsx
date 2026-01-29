'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PlaceOrderButtonProps {
  onPlaceOrder: () => void;
  isSubmitting: boolean;
  isDisabled?: boolean;
}

export function PlaceOrderButton({ 
  onPlaceOrder, 
  isSubmitting,
  isDisabled = false
}: PlaceOrderButtonProps) {
  const t = useTranslations("checkout")
  return (
    <div className="space-y-3 ">
      <Button
        type="button"
        onClick={onPlaceOrder}
        className="w-full cursor-pointer rounded-lg h-14 bg-red-600 hover:bg-red-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        disabled={isSubmitting || isDisabled}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            {t('processingOrder')}
          </>
        ) : (
          <div className="flex items-center justify-center w-full">
            <span className="flex items-center gap-2">
              {t('placeOrder')}
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