// hooks/useBranchValidation.ts

'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { 
  selectSelectedBranchDetails, 
  selectSelectedAddress 
} from '@/store/slices/addressSlice';
import {
  calculateDeliveryCharges,
  meetsMinimumOrder,
  getAmountToMinimum,
  getAmountToFreeDelivery,
  getDeliveryTimeRange,
} from '@/lib/branch/branchUtils';

export interface BranchValidationData {
  // Branch availability
  hasBranch: boolean;
  isDeliveryMode: boolean;
  isPickupMode: boolean;
  branchName: string | null;
  branchId: number | null;

  // Business hours
  isBranchOpen: boolean;
  businessHours: string | null;
  businessStartTime: string | null;
  businessEndTime: string | null;

  // Delivery settings
  deliveryCharges: number;
  deliveryChargesWaiveOffLimit: number;
  deliveryTime: number | null;
  deliveryTimeRange: string | null;

  // Minimum order
  minimumOrderAmount: number;
  meetsMinimumOrder: (cartTotal: number) => boolean;
  getAmountToMinimum: (cartTotal: number) => number;

  // Free delivery
  hasDeliveryChargesWaiveOff: boolean;
  calculateDeliveryFee: (cartTotal: number) => number;
  getAmountToFreeDelivery: (cartTotal: number) => number;
  getFreeDeliveryProgress: (cartTotal: number) => number;
  isFreeDelivery: (cartTotal: number) => boolean;

  // Overall validation
  canPlaceOrder: (cartTotal: number, hasItems: boolean) => boolean;
}

export function useBranchValidation(): BranchValidationData {
  const branchDetails = useAppSelector(selectSelectedBranchDetails);
  const selectedAddress = useAppSelector(selectSelectedAddress);

  return useMemo(() => {
    // Branch availability
    const hasBranch = !!branchDetails;
    const isDeliveryMode = selectedAddress?.orderMode === 'delivery';
    const isPickupMode = selectedAddress?.orderMode === 'pickup';
    const branchName = isDeliveryMode
      ? selectedAddress?.areaName || null
      : selectedAddress?.branchName || null;
    const branchId = selectedAddress?.branchId || 
                     selectedAddress?.areaId || 
                     null;

    const businessHours = hasBranch
      ? `${branchDetails.BusinessStartTime} - ${branchDetails.BusinessEndTime}`
      : null;
    const businessStartTime = hasBranch ? branchDetails.BusinessStartTime : null;
    const businessEndTime = hasBranch ? branchDetails.BusinessEndTime : null;

    // Delivery settings
    const deliveryCharges = hasBranch ? branchDetails.DeliveryCharges : 0;
    const deliveryChargesWaiveOffLimit = hasBranch 
      ? branchDetails.DeliveryChargesWaiveOffLimit 
      : 0;
    const deliveryTime = hasBranch ? branchDetails.DeliveryTime : null;
    const deliveryTimeRange = hasBranch && isDeliveryMode
      ? getDeliveryTimeRange(branchDetails)
      : null;

    // Minimum order
    const minimumOrderAmount = hasBranch ? branchDetails.MinimumOrder : 0;

    // Free delivery
    const hasDeliveryChargesWaiveOff = deliveryChargesWaiveOffLimit > 0;

    // Functions that depend on cart total
    const meetsMinimumOrderFn = (cartTotal: number): boolean => {
      return hasBranch ? meetsMinimumOrder(branchDetails, cartTotal) : true;
    };

    const getAmountToMinimumFn = (cartTotal: number): number => {
      return hasBranch ? getAmountToMinimum(branchDetails, cartTotal) : 0;
    };

    const calculateDeliveryFeeFn = (cartTotal: number): number => {
      if (!hasBranch || !isDeliveryMode) return 0;
      return calculateDeliveryCharges(branchDetails, cartTotal);
    };

    const getAmountToFreeDeliveryFn = (cartTotal: number): number => {
      if (!hasBranch || !isDeliveryMode) return 0;
      return getAmountToFreeDelivery(branchDetails, cartTotal);
    };

    const getFreeDeliveryProgressFn = (cartTotal: number): number => {
      if (!hasBranch || !hasDeliveryChargesWaiveOff) return 0;
      return Math.min(
        (cartTotal / deliveryChargesWaiveOffLimit) * 100,
        100
      );
    };

    const isFreeDeliveryFn = (cartTotal: number): boolean => {
      if (!hasBranch || !isDeliveryMode || !hasDeliveryChargesWaiveOff) {
        return false;
      }
      return calculateDeliveryFeeFn(cartTotal) === 0;
    };

    const canPlaceOrderFn = (cartTotal: number, hasItems: boolean): boolean => {
      return (
        hasBranch &&
        branchDetails.IsBranchOpen &&
        hasItems &&
        meetsMinimumOrderFn(cartTotal)
      );
    };

    return {
      // Branch availability
      hasBranch,
      isDeliveryMode,
      isPickupMode,
      branchName,
      branchId,

      // Business hours
      isBranchOpen: hasBranch && branchDetails.IsBranchOpen,
      businessHours,
      businessStartTime,
      businessEndTime,

      // Delivery settings
      deliveryCharges,
      deliveryChargesWaiveOffLimit,
      deliveryTime,
      deliveryTimeRange,

      // Minimum order
      minimumOrderAmount,
      meetsMinimumOrder: meetsMinimumOrderFn,
      getAmountToMinimum: getAmountToMinimumFn,

      // Free delivery
      hasDeliveryChargesWaiveOff,
      calculateDeliveryFee: calculateDeliveryFeeFn,
      getAmountToFreeDelivery: getAmountToFreeDeliveryFn,
      getFreeDeliveryProgress: getFreeDeliveryProgressFn,
      isFreeDelivery: isFreeDeliveryFn,

      // Overall validation
      canPlaceOrder: canPlaceOrderFn,
    };
  }, [branchDetails, selectedAddress]);
}