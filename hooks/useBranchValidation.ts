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
import { BranchValidationData } from '@/types/validation.types';


export function useBranchValidation(): BranchValidationData {
  const branchDetails = useAppSelector(selectSelectedBranchDetails);
  const selectedAddress = useAppSelector(selectSelectedAddress);

  return useMemo(() => {

    const defaultReturn: BranchValidationData = {
      hasBranch: false,
      isDeliveryMode: false,
      isPickupMode: false,
      branchName: null,
      branchId: null,
      isBranchOpen: false,
      businessHours: null,
      businessStartTime: null,
      businessEndTime: null,
      deliveryCharges: 0,
      deliveryChargesWaiveOffLimit: 0,
      deliveryTime: null,
      deliveryTimeRange: null,
      minimumOrderAmount: 0,
      meetsMinimumOrder: () => true,
      getAmountToMinimum: () => 0,
      hasDeliveryChargesWaiveOff: false,
      calculateDeliveryFee: () => 0,
      getAmountToFreeDelivery: () => 0,
      getFreeDeliveryProgress: () => 0,
      isFreeDelivery: () => false,
      canPlaceOrder: () => false,
    };

    if (!branchDetails) return defaultReturn;
    

    // Branch availability
    const hasBranch = !!branchDetails;
    const branchId = selectedAddress?.branchId || null;
    const isPickupMode = selectedAddress?.orderMode === 'pickup';
    const isDeliveryMode = selectedAddress?.orderMode === 'delivery';
    const branchName = isDeliveryMode ? selectedAddress?.areaName || null : selectedAddress?.branchName || null;

    const businessEndTime = hasBranch ? branchDetails.BusinessEndTime : null;
    const businessStartTime = hasBranch ? branchDetails.BusinessStartTime : null;
    const businessHours = hasBranch ? `${branchDetails.BusinessStartTime} - ${branchDetails.BusinessEndTime}` : null;

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
        // branchDetails.IsBranchOpen &&
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