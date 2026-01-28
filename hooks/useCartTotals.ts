'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectCartItems } from '@/store/slices/cartSlice';
import { useBranchValidation } from './useBranchValidation';
import { CartTotalsData } from '@/types/validation.types';

const TAX_RATE = 0.16;

export function useCartTotals(): CartTotalsData {
  const cartItems = useAppSelector(selectCartItems);
  const branch = useBranchValidation();

  return useMemo(() => {
    const itemCount = cartItems.reduce(
      (sum, item) => sum + item.customization.quantity,
      0
    );
    const hasItems = itemCount > 0;

    // ✅ Calculate subtotal based on ORIGINAL prices
    const subtotal = cartItems.reduce((sum, item) => {
      const originalPrice = item.priceBreakdown.originalBasePrice;
      const addonsTotal = item.priceBreakdown.addonsTotal || 0;
      const itemTotal = (originalPrice + addonsTotal) * item.customization.quantity;
      return sum + itemTotal;
    }, 0);

    // ✅ Calculate total discount amount
    const totalDiscount = cartItems.reduce((sum, item) => {
      const originalPrice = item.priceBreakdown.originalBasePrice;
      const discountedPrice = item.priceBreakdown.basePrice;
      const discountPerItem = originalPrice - discountedPrice;
      return sum + (discountPerItem * item.customization.quantity);
    }, 0);

    // ✅ Subtotal after discount
    const subtotalAfterDiscount = subtotal - totalDiscount;

    // Tax calculation on discounted amount
    const rawTax = subtotalAfterDiscount * TAX_RATE;
    const tax = Math.round(rawTax);

    const deliveryFee = branch.hasBranch 
      ? branch.calculateDeliveryFee(subtotalAfterDiscount) 
      : 0;

    const beforeTax = subtotalAfterDiscount + deliveryFee;
    const total = subtotalAfterDiscount + tax + deliveryFee;

    const meetsMinimumOrder = branch.hasBranch 
      ? branch.meetsMinimumOrder(subtotalAfterDiscount) 
      : true;
      
    const canCheckout = branch.hasBranch 
      ? branch.canPlaceOrder(subtotalAfterDiscount, hasItems) 
      : hasItems;

    return {
      subtotal,
      totalDiscount,
      itemCount,
      hasItems,
      tax,
      taxRate: TAX_RATE,
      deliveryFee,
      total,
      beforeTax,
      meetsMinimumOrder,
      canCheckout,
    };
  }, [cartItems, branch]);
}