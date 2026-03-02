'use client';

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
  CheckCircle2,
} from 'lucide-react';

interface OrderSummaryProps {
  variant?: 'cart' | 'checkout' | 'success';
}

export function PriceSummary({ variant = 'cart' }: OrderSummaryProps) {
  const t = useTranslations('cart');

  const branch = useBranchValidation();
  const totals = useCartTotals();

  const isFreeDelivery = totals.isFreeDelivery;

  const containerStyles = {
    cart: "space-y-2 shadow-sm p-3 rounded-lg bg-white",
    checkout: "space-y-3",
    success: "space-y-3" // Same as checkout but without header
  };

  const detailsContainerStyles = {
    cart: "space-y-2",
    checkout: "space-y-2 bg-white mb-0 p-4 rounded-lg",
    success: "space-y-2 bg-white p-4 rounded-lg" // Same as checkout
  };

  const textSizeStyles = {
    cart: {
      detail: "text-sm",
      label: "text-gray-600",
      value: "font-medium text-gray-900",
      totalLabel: "text-lg font-semibold text-gray-900",
      totalValue: "text-2xl font-bold text-red-600"
    },
    checkout: {
      detail: "text-base",
      label: "text-gray-700 font-medium",
      value: "font-semibold text-gray-900",
      totalLabel: "text-xl font-bold text-gray-900",
      totalValue: "text-3xl font-bold text-red-600"
    },
    success: {
      detail: "text-base",
      label: "text-gray-700 font-medium",
      value: "font-semibold text-gray-900",
      totalLabel: "text-xl font-bold text-gray-900",
      totalValue: "text-3xl font-bold text-red-600"
    }
  };

  const iconStyles = {
    cart: "w-4 h-4",
    checkout: "w-5 h-5",
    success: "w-5 h-5"
  };


  const styles = textSizeStyles[variant];

  return (
    <div className={containerStyles[variant]}>

      <div className={detailsContainerStyles[variant]}>
        {/* Subtotal */}
        <div className={`flex items-center justify-between ${styles.detail}`}>
          <span className={`${styles.label} flex gap-2 items-center`}>
            <Receipt className={iconStyles[variant]} /> {t('subtotal')}
          </span>
          <span className={styles.value}>
            {formatPrice(totals.subtotal)}
          </span>
        </div>

        {/* ✅ Discount */}
        {totals.totalDiscount > 0 && (
          <div className={`flex items-center justify-between ${styles.detail}`}>
            <span className="text-green-600 font-medium flex gap-2 items-center">
              <Tag className={iconStyles[variant]} /> Discount
            </span>
            <span className="text-green-600 font-bold">
              - {formatPrice(totals.totalDiscount)}
            </span>
          </div>
        )}

        {/* Tax */}
        {
          totals.tax > 0 && (
            <div className={`flex items-center justify-between ${styles.detail}`}>
              <span className={`${styles.label} flex gap-2 items-center`}>
                <Calculator className={iconStyles[variant]} /> {t('tax')} ({Math.round(totals.taxRate * 100)}%)
              </span>
              <span className={styles.value}>
                {formatPrice(totals.tax)}
              </span>
            </div>
          )
        }

        {/* Delivery Fee */}
        {branch.isDeliveryMode && (
          <div className={`flex items-center justify-between ${styles.detail}`}>
            <span className={`${styles.label} flex gap-2 items-center`}>
              <Truck className={iconStyles[variant]} /> {t('deliveryFee')}
            </span>
            {isFreeDelivery ? (
              <span className="flex items-center gap-2">
                <span className={`line-through text-gray-400 ${variant === 'cart' ? 'text-xs' : 'text-sm'}`}>
                  {formatPrice(totals.deliveryCharges)}
                </span>
                <span className={`font-semibold text-green-600 ${variant === 'checkout' || variant === 'success' ? 'text-base' : 'text-sm'}`}>
                  FREE
                </span>
              </span>
            ) : (
              <span className={styles.value}>
                {formatPrice(totals.deliveryFee)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Grand Total */}
      <div className={`flex items-center justify-between ${variant === 'checkout' || variant === 'success' ? 'bg-red-50 border border-red-200 p-4 rounded-lg' : ''}`}>
        <span className={`${styles.totalLabel} flex gap-2 items-center`}>
          {/* <Wallet className={variant === 'cart' ? 'w-5 h-5' : 'w-6 h-6'} />  */}
          {t('grandTotal')}
        </span>
        <span className={styles.totalValue}>
          {formatPrice(totals.total)}
        </span>
      </div>

      {/* 🎯 Checkout & Success: Savings Message */}
      {(variant === 'checkout' || variant === 'success') && totals.totalDiscount > 0 && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-medium text-center">
            🎉 You saved {formatPrice(totals.totalDiscount)} on this order!
          </p>
        </div>
      )}
    </div>
  );
}