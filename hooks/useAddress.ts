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
import useDomain from './useDomain';

export function useAddress() {
  const dispatch = useAppDispatch();
  const domain = useDomain();
  const { connection, isConnected } = useSignalR();

  // Selectors
  const apiData = useAppSelector(selectAddressApiData);
  const isLoading = useAppSelector(selectAddressLoading);
  const error = useAppSelector(selectAddressError);
  const selectedAddress = useAppSelector(selectSelectedAddress);
  const availableModes = useAppSelector(selectAvailableModes);

  useEffect(() => {
    if (!connection || !isConnected || apiData || !domain) return;

    const handler = (payload: DeliveryPickupApiResponse) => {
      console.log("Received address data:", payload);
      dispatch(addressDataReceived(payload));
    };

    connection.on('DAndPResponse', handler);

    dispatch(addressDataRequested());

    connection
      .invoke('DeliveryAndPickupRequest', domain, 0, 'DAndPResponse')
      .catch((err: any) => {
        dispatch(addressDataError(err?.message ?? 'Failed to load address data'));
      });

    return () => {
      connection.off('DAndPResponse', handler);
    };
  }, [connection, isConnected, apiData, dispatch, domain]);

  return {
    apiData,
    isLoading,
    error,
    selectedAddress,
    availableModes,
  };
}