'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useSignalR } from '@/contexts/signalr-provider';
import { MenuResponse } from '@/types/menu.types';
import { menuReceived, menuError, menuRequested } from '@/store/slices/menuSlice';
import { selectSelectedAddress } from '@/store/slices/addressSlice';
import useDomain from './useDomain';

export function useMenu() {
  const dispatch = useAppDispatch();
  const domain = useDomain();
  const { connection, isConnected } = useSignalR();
  const { data, isLoading, error } = useAppSelector((state) => state.menu);
  const selectedAddress = useAppSelector(selectSelectedAddress);
  const branchId = selectedAddress?.branchId || 0;

  useEffect(() => {
    if (!connection || !isConnected || !domain || !branchId) return;

    dispatch(menuRequested());

    // Handler for receiving menu data
    const handler = (response: MenuResponse) => {
      console.log("Checking Menu Response", response)
      dispatch(menuReceived(response.dataPayload));
    };
    connection.on('MenuResponse', handler);

    // Optional: Handler for acknowledgments (if your backend sends them)
    const ackHandler = (ack: any) => {
    };
    connection.on("Ack", ackHandler);

    // Request menu data for the current branch
    connection
    .invoke('MenuRequest', 'pathan.eatx.pk', branchId, 'MenuResponse')
    .catch((err) => { dispatch(menuError(err?.message ?? 'Error while requesting menu'));});

    return () => {
      connection.off('MenuResponse', handler);
      connection.off('Ack', ackHandler); 
    };
  }, [connection, isConnected, branchId, domain]);

  return {
    menuData: data,
    isLoading,
    error,
    branchId,
  };
}