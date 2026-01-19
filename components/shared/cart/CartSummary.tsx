'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useBranchValidation } from '@/hooks/useBranchValidation';
import { useCartTotals } from '@/hooks/useCartTotals';
import { formatPrice } from '@/lib/product/productHelper';
import { 
  BranchNotSelectedAlert,
  MinimumOrderAlert,
  FreeDeliveryProgress,
  FreeDeliveryBadge,
  DeliveryTimeInfo,
} from './CartSummaryAlerts';

interface CartSummaryProps {
  showDetails?: boolean;
}

export function CartSummary({ showDetails = true }: CartSummaryProps) {
  const t = useTranslations('cart');
  
  const branch = useBranchValidation();
  const totals = useCartTotals();

  const amountToMinimum = branch.hasBranch 
    ? branch.getAmountToMinimum(totals.subtotal)
    : 0;

  const amountToFreeDelivery = branch.hasBranch && branch.isDeliveryMode
    ? branch.getAmountToFreeDelivery(totals.subtotal)
    : 0;

  const freeDeliveryProgress = branch.hasBranch
    ? branch.getFreeDeliveryProgress(totals.subtotal)
    : 0;

  const isFreeDelivery = branch.hasBranch && branch.isDeliveryMode
    ? branch.isFreeDelivery(totals.subtotal)
    : false;


  return (
    <div className="space-y-4">
      {/* Alerts & Notifications */}
      {!branch.hasBranch && <BranchNotSelectedAlert />}
      
      {branch.hasBranch && !totals.meetsMinimumOrder && (
        <MinimumOrderAlert amount={amountToMinimum} />
      )}
      
      {branch.hasBranch && 
       totals.meetsMinimumOrder && 
       amountToFreeDelivery > 0 && 
       branch.isDeliveryMode && (
        <FreeDeliveryProgress
          amount={amountToFreeDelivery}
          progress={freeDeliveryProgress}
        />
      )}
      
      {isFreeDelivery && branch.isDeliveryMode && (
        <FreeDeliveryBadge />
      )}
      
      {branch.deliveryTimeRange && branch.isDeliveryMode && (
        <DeliveryTimeInfo timeRange={branch.deliveryTimeRange} />
      )}

      {/* Price Breakdown */}
      {showDetails && (
        <div className="space-y-2 pt-2">
          {/* Subtotal */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{t('subtotal')}</span>
            <span className="font-medium text-gray-900">
              {formatPrice(totals.subtotal)}
            </span>
          </div>

          {/* Tax */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {t('tax')} ({Math.round(totals.taxRate * 100)}%)
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
      <div className="flex items-center justify-between pt-2">
        <span className="text-lg font-semibold text-gray-900">
          {t('grandTotal')}
        </span>
        <span className="text-2xl font-bold text-red-600">
          {formatPrice(totals.total)}
        </span>
      </div>
    </div>
  );
}