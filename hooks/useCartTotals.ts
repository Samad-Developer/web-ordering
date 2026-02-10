'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectCartItems } from '@/store/slices/cartSlice';
import { 
  selectAddressApiData,
  selectSelectedAddress, 
  selectSelectedBranchDetails 
} from '@/store/slices/addressSlice';

export function useCartTotals() {

  const cartItems = useAppSelector(selectCartItems);
  const selectedAddress = useAppSelector(selectSelectedAddress);
  const branchDetails = useAppSelector(selectSelectedBranchDetails);
  const addressData = useAppSelector(selectAddressApiData);

  return useMemo(() => {
    
    const itemCount = cartItems.reduce((sum, item) => sum + item.customization.quantity, 0);
    const hasItems = itemCount > 0;

    // Calculate subtotal based on ORIGINAL prices
    const subtotal = cartItems.reduce((sum, item) => {
      const originalPrice = item.priceBreakdown.originalBasePrice;
      const addonsTotal = item.priceBreakdown.addonsTotal || 0;
      const itemTotal = (originalPrice + addonsTotal) * item.customization.quantity;
      return sum + itemTotal;
    }, 0);

    // Calculate total discount amount
    const totalDiscount = cartItems.reduce((sum, item) => {
      const originalPrice = item.priceBreakdown.originalBasePrice;
      const discountedPrice = item.priceBreakdown.basePrice;
      const discountPerItem = originalPrice - discountedPrice;
      return sum + (discountPerItem * item.customization.quantity);
    }, 0);

    // Subtotal after discount
    const subtotalAfterDiscount = subtotal - totalDiscount;

    const getTaxRate = () => {
      if (!addressData || !selectedAddress?.cityId) return 0;

      const cityId = selectedAddress.cityId;
      const pickupData = addressData.dataPayload.Pickup[cityId];

      if (pickupData && typeof pickupData.Tax === 'number') {
        return pickupData.Tax / 100; // Convert to decimal (e.g., 16 -> 0.16)
      }

      return 0; // Default to 0 if no tax found
    };

    const taxRate = getTaxRate();

    // Extract delivery-related info from selectedAddress
    const isDeliveryMode = selectedAddress?.orderMode === 'delivery';
    const deliveryCharges = isDeliveryMode ? (selectedAddress?.deliveryCharges || 0) : 0;
    const deliveryChargesWaiveOffLimit = isDeliveryMode ? (selectedAddress?.deliveryChargesWaiveOffLimit || 0) : 0;
    const deliveryTime = isDeliveryMode ? (selectedAddress?.deliveryTime || null) : null;
    const hasDeliveryChargesWaiveOff = deliveryChargesWaiveOffLimit > 0;

    // Calculate delivery time range
    const deliveryTimeRange = isDeliveryMode && deliveryTime ? `${deliveryTime - 5}-${deliveryTime + 5} mins` : null;

    // Calculate delivery fee
    const deliveryFee = (() => {
      if (!isDeliveryMode) return 0;
      
      // Check if free delivery threshold is met
      if (hasDeliveryChargesWaiveOff && 
          subtotalAfterDiscount >= deliveryChargesWaiveOffLimit) {
        return 0; // Free delivery
      }
      
      return deliveryCharges;
    })();

    // Check if free delivery is active
    const isFreeDelivery = isDeliveryMode && hasDeliveryChargesWaiveOff && deliveryFee === 0 && deliveryCharges > 0;

    // Calculate amount needed for free delivery
    const amountToFreeDelivery = (() => {
      if (!isDeliveryMode || !hasDeliveryChargesWaiveOff) return 0;
      return Math.max(0, deliveryChargesWaiveOffLimit - subtotalAfterDiscount);
    })();

    // Calculate free delivery progress percentage
    const freeDeliveryProgress = (() => {
      if (!isDeliveryMode || !hasDeliveryChargesWaiveOff) return 0;
      return Math.min(100, (subtotalAfterDiscount / deliveryChargesWaiveOffLimit) * 100);
    })();

    // Tax calculation on discounted amount
    const rawTax = subtotalAfterDiscount * taxRate;
    const tax = Math.round(rawTax);

    const beforeTax = subtotalAfterDiscount + deliveryFee;
    const total = subtotalAfterDiscount + tax + deliveryFee;

    // Read minimum order from branchDetails directly
    const minimumOrder = branchDetails?.MinimumOrder || 0;
    const meetsMinimumOrder = minimumOrder === 0 || subtotalAfterDiscount >= minimumOrder;

    // Calculate amount to minimum order
    const amountToMinimum = meetsMinimumOrder ? 0 : minimumOrder - subtotalAfterDiscount;

    // Calculate checkout validation
    const hasBranch = !!branchDetails;
    const canCheckout = hasBranch && hasItems && meetsMinimumOrder;

    return {
      subtotal,
      totalDiscount,
      itemCount,
      hasItems,
      tax,
      taxRate,
      deliveryFee,
      deliveryCharges,             
      deliveryTimeRange,           
      isFreeDelivery,
      amountToFreeDelivery,
      freeDeliveryProgress,
      total,
      beforeTax,
      meetsMinimumOrder,
      amountToMinimum,
      canCheckout,
    };
  }, [cartItems, selectedAddress, branchDetails]); 
}