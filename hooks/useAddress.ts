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
  
  // Selectors
  const apiData = useAppSelector(selectAddressApiData);
  const isLoading = useAppSelector(selectAddressLoading);
  const error = useAppSelector(selectAddressError);
  const selectedAddress = useAppSelector(selectSelectedAddress);
  const availableModes = useAppSelector(selectAvailableModes);

  // Fetch address data from SignalR
  useEffect(() => {
    if (!connection || !isConnected || apiData) return;

    const fetchAddressData = async () => {
      dispatch(addressDataRequested());

      const handler = (payload: DeliveryPickupApiResponse) => {
        console.log('Address Data Received:', payload);
        dispatch(addressDataReceived(payload));
      };

      connection.on('DAndPResponse', handler);

      try {
        await connection.invoke('DataRequest', 'rollinnbbq.pk', 'DeliveryAndPickup', 0, 'DAndPResponse');
      } catch (err: any) {
        dispatch(
          addressDataError(
            err?.message ?? 'Failed to load address data'
          )
        );
      }

      return () => {
        connection.off('DAndPResponse', handler);
      };
    };

    fetchAddressData();
  }, [connection, isConnected, apiData, dispatch]);

  return {
    apiData,
    isLoading,
    error,
    selectedAddress,
    availableModes,
  };
}