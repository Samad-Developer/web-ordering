'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import {
  selectSelectedBranchDetails,
  selectSelectedAddress
} from '@/store/slices/addressSlice';

export function useBranchValidation() {
  const branchDetails = useAppSelector(selectSelectedBranchDetails);
  const selectedAddress = useAppSelector(selectSelectedAddress);

  return useMemo(() => {

    const defaultReturn = {
      hasBranch: false,
      isDeliveryMode: false,
      isPickupMode: false,
      branchName: null,
      branchId: null,
      isBranchOpen: false,
      businessHours: null,
      businessStartTime: null,
      businessEndTime: null,
      minimumOrderAmount: 0,
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

    // Minimum order - Branch level only
    const minimumOrderAmount = hasBranch ? branchDetails.MinimumOrder : 0;

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

      // Minimum order
      minimumOrderAmount,
    };
  }, [branchDetails, selectedAddress]);
}