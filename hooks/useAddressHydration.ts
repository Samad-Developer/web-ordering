'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  selectSelectedAddress,
  setDeliveryAddress,
  setPickupBranch,
} from '@/store/slices/addressSlice';
import { loadUserAddress } from '@/lib/address/addressHelpers';

/**
 * Hydrates Redux from localStorage on mount
 * Call this once in your root layout or main component
 */
export function useAddressHydration() {
  const dispatch = useAppDispatch();
  const selectedAddress = useAppSelector(selectSelectedAddress);

  useEffect(() => {
    // Only run if Redux is empty
    if (selectedAddress) return;

    // Load from localStorage
    const savedAddress = loadUserAddress();
    if (!savedAddress || !savedAddress.branchDetails) return;

    console.log('🔄 Hydrating from localStorage');

    // Dispatch to Redux
    if (savedAddress.orderMode === 'delivery') {
      dispatch(
        setDeliveryAddress({
          cityId: savedAddress.cityId,
          cityName: savedAddress.cityName,
          areaId: savedAddress.areaId!,
          areaName: savedAddress.areaName!,
          branchDetails: savedAddress.branchDetails,
        })
      );
    } else {
      dispatch(
        setPickupBranch({
          cityId: savedAddress.cityId,
          cityName: savedAddress.cityName,
          branch: savedAddress.branchDetails,
        })
      );
    }
  }, []); // Empty deps - only run once on mount
}