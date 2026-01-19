'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectCartItems, selectCartSubtotal } from '@/store/slices/cartSlice';
import { useBranchValidation } from './useBranchValidation';

export interface CartTotalsData {
  // Cart basics
  subtotal: number;
  itemCount: number;
  hasItems: boolean;

  // Calculations
  tax: number;
  taxRate: number;
  deliveryFee: number;
  total: number;

  // Formatted totals
  beforeTax: number; // subtotal + delivery
  
  // Validations
  meetsMinimumOrder: boolean;
  canCheckout: boolean;
}

const TAX_RATE = 0.16; // 16% tax - centralized configuration

export function useCartTotals(): CartTotalsData {
  const cartItems = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const branch = useBranchValidation();

  return useMemo(() => {
    // Cart basics
    const itemCount = cartItems.reduce(
      (sum, item) => sum + item.customization.quantity,
      0
    );
    const hasItems = itemCount > 0;

    // Tax calculation
    const rawTax = subtotal * TAX_RATE;
    const tax = Math.round(rawTax);

   const deliveryFee = branch.hasBranch ? branch.calculateDeliveryFee(subtotal) : 0;

    // Totals
    const beforeTax = subtotal + deliveryFee;
    const total = subtotal + tax + deliveryFee;

    // Validations
      const meetsMinimumOrder = branch.hasBranch ? branch.meetsMinimumOrder(subtotal) : true;
      const canCheckout = branch.hasBranch ? branch.canPlaceOrder(subtotal, hasItems) : hasItems;

    return {
      // Cart basics
      subtotal,
      itemCount,
      hasItems,

      // Calculations
      tax,
      taxRate: TAX_RATE,
      deliveryFee,
      total,

      // Formatted totals
      beforeTax,

      // Validations
      meetsMinimumOrder,
      canCheckout,
    };
  }, [cartItems, subtotal, branch]);
}