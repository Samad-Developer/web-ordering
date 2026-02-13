'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PlaceOrderButtonProps {
  onPlaceOrder: () => void;
  isDisabled?: boolean;
  isSubmitting: boolean;
}

export function PlaceOrderButton({ 
  onPlaceOrder, 
  isDisabled = false,
  isSubmitting,
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
          <div className='flex items-center justify-center gap-2'>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t('processingOrder')}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <span className="flex items-center gap-2">
              {t('placeOrder')}
            </span>
            {/* <span className="font-bold">Rs. {totalAmount.toLocaleString()}</span> */}
          </div>
        )}
      </Button>
    </div>
  );
}