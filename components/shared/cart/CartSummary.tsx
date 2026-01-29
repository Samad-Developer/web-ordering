'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useBranchValidation } from '@/hooks/useBranchValidation';
import { useCartTotals } from '@/hooks/useCartTotals';
import { formatPrice } from '@/lib/product/productHelper';
import { 
  Receipt, 
  Tag, 
  Calculator, 
  Truck, 
  Wallet,
} from 'lucide-react';


interface CartSummaryProps {
  showDetails?: boolean;
}

export function CartSummary({ showDetails = true }: CartSummaryProps) {
  const t = useTranslations('cart');

  const branch = useBranchValidation();
  const totals = useCartTotals();



  const isFreeDelivery = branch.hasBranch && branch.isDeliveryMode
    ? branch.isFreeDelivery(totals.subtotal)
    : false;


  return (
    <div className="space-y-2 shadow-[0_4px_20px_rgba(0,0,0,0.08)]  p-3 rounded-lg">



      {/* Price Breakdown */}
      {showDetails && (
        <div className=" space-y-1">
          {/* Subtotal */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex gap-2 items-center"><Receipt className="w-4 h-4" /> {t('subtotal')}</span>
            <span className="font-medium text-gray-900">
              {formatPrice(totals.subtotal)}
            </span>
          </div>

          {/* ✅ Discount (NEW) */}
          {totals.totalDiscount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-600 font-medium flex gap-2 items-center"><Tag className="w-4 h-4" /> Discount</span>
              <span className="text-green-600 font-bold">
                - {formatPrice(totals.totalDiscount)}
              </span>
            </div>
          )}

          {/* Tax */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex gap-2 items-center">
              <Calculator className="w-4 h-4" /> {t('tax')} ({Math.round(totals.taxRate * 100)}%)
            </span>
            <span className="font-medium text-gray-900">
              {formatPrice(totals.tax)}
            </span>
          </div>

          {/* Delivery Fee */}
          {branch.isDeliveryMode && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{t('deliveryFee')}</span>
              {isFreeDelivery ? (
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <span className="line-through text-gray-400 text-xs">
                    {formatPrice(branch.deliveryCharges)}
                  </span>
                  <span className="font-semibold">FREE</span>
                </span>
              ) : (
                <span className="font-medium text-gray-900">
                  {formatPrice(totals.deliveryFee)}
                </span>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-200 my-2" />
        </div>
      )}

      {/* Grand Total */}
      <div className="flex items-center justify-between ">
        <span className="text-lg font-semibold text-gray-900 flex gap-2 items-center">
          <Wallet className="w-5 h-5" /> {t('grandTotal')}
        </span>
        <span className="text-2xl font-bold text-red-600">
          {formatPrice(totals.total)}
        </span>
      </div>
    </div>
  );
}