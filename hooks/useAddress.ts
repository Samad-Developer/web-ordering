'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useSignalR } from '@/contexts/signalr-provider';
import {
  addressDataRequested,
  addressDataReceived,
  addressDataError,
  selectAddressApiData,
  selectAddressLoading,
  selectAddressError,
  selectSelectedAddress,
  selectAvailableModes,
} from '@/store/slices/addressSlice';
import type { DeliveryPickupApiResponse } from '@/types/address.types';

export function useAddress() {
  const dispatch = useAppDispatch();
  const { connection, isConnected } = useSignalR();
  const apiData = useAppSelector(selectAddressApiData);
  const isLoading = useAppSelector(selectAddressLoading);
  const error = useAppSelector(selectAddressError);
  const selectedAddress = useAppSelector(selectSelectedAddress);
  const availableModes = useAppSelector(selectAvailableModes);

  // Auto-fetch address data when connection is ready
  useEffect(() => {
    if (!connection || !isConnected || apiData) return;

    const requestAddressData = async () => {
      dispatch(addressDataRequested());

      const handler = (payload: DeliveryPickupApiResponse) => {
        console.log("Address Data Arrived Now", payload)
        dispatch(addressDataReceived(payload))
      };

      connection.on('DAndPResponse', handler);

      connection
        .invoke('DataRequest', 'builderburger.co', 'DeliveryAndPickup', 'DAndPResponse')
        .catch((err) => {
          dispatch(addressDataError(err?.message ?? 'Error while requesting Delivery & Pickup data'));
        });

      return () => {
        connection.off('DAndPResponse', handler);
      };
    };

    requestAddressData();
  }, [connection, isConnected, apiData]);

  return {
    apiData,
    isLoading,
    error,
    selectedAddress,
    availableModes,
  };
}