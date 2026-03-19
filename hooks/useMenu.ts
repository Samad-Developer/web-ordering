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
    if (!connection || !isConnected || !domain) return;

    dispatch(menuRequested());

    const handler = (response: MenuResponse) => {
      console.log("Checking Menu Response", response)
      dispatch(menuReceived(response.dataPayload));
    };

    connection.on('MenuResponse', handler);
    connection.on("Ack", (ack) => console.log("Ack: " + JSON.stringify(ack)));

    connection.invoke('MenuRequest', domain, branchId, 'MenuResponse')
      .catch((err) => {
        dispatch(menuError(err?.message ?? 'Error while requesting menu'));
        console.error('Issue while requesting menu data:', err);
      });

    return () => {
      connection.off('MenuResponse', handler);
    };
  }, [connection, isConnected, branchId, domain]);

  return {
    menuData: data,
    isLoading,
    error,
    branchId,
  };
}