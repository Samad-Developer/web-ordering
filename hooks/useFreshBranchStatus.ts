'use client';

import { useEffect, useMemo, useState } from 'react';
import { loadUserAddress } from '@/lib/address/addressHelpers';
import { useAppSelector } from '@/store/hooks';
import { selectAddressApiData } from '@/store/slices/addressSlice';

export function useFreshBranchStatus() {
  const addressAndThemeData = useAppSelector(selectAddressApiData);

  const [savedAddress, setSavedAddress] = useState<any>(null);

  useEffect(() => {
    const data = loadUserAddress();
    setSavedAddress(data);
  }, []);

  const branch = useMemo(() => {
    if (!savedAddress || !addressAndThemeData) return null;

    const { cityId, branchId } = savedAddress;

    const pickupData = addressAndThemeData?.dataPayload?.Pickup;

    if (!pickupData || !cityId) return null;

    const city = pickupData[cityId];

    if (!city?.Branches) return null;

    const foundBranch = city.Branches.find(
      (b: any) => b.BranchId === branchId
    );

    return foundBranch || null;
  }, [savedAddress, addressAndThemeData]);

  return {
    branch,
    isBranchOpen: branch?.IsBranchOpen ?? false,
    businessStartTime: branch?.BusinessStartTime || null,
    businessEndTime: branch?.BusinessEndTime || null,
  };
}