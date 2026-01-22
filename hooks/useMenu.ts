'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useSignalR } from '@/contexts/signalr-provider';
import { MenuResponse } from '@/types/menu.types';
import { menuReceived, menuError } from '@/store/slices/menuSlice';
import { getSavedBranchId } from '@/lib/address/addressHelpers';

export function useMenu() {
  const dispatch = useAppDispatch();
  const { connection, isConnected } = useSignalR();
  const { data, isLoading, error } = useAppSelector((state) => state.menu);

  useEffect(() => {
    if (!connection || !isConnected || data) return;

    // Get saved branch ID from localStorage
    const branchId = getSavedBranchId();

    const handler = (response: MenuResponse) => {
      console.log("Menu Response", response)
      dispatch(menuReceived(response.dataPayload));
    };
    connection.on('MenuResponse', handler);

    connection.invoke('DataRequest', 'rollinnbbq.pk', 'Menu', branchId, 'MenuResponse')
      .catch((err) => {
        dispatch(menuError(err?.message ?? 'Error while requesting menu'));
      });

    return () => {
      connection.off('MenuResponse', handler);
    };
  }, [connection, isConnected, data, dispatch]);

  return {
    menuData: data,
    isLoading,
    error,
  };
}
