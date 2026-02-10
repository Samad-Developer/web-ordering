'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useSignalR } from '@/contexts/signalr-provider';
import { MenuResponse } from '@/types/menu.types';
import { menuReceived, menuError, menuRequested } from '@/store/slices/menuSlice';
import { selectSelectedAddress } from '@/store/slices/addressSlice';

export function useMenu() {
  const dispatch = useAppDispatch();
  const { connection, isConnected } = useSignalR();
  const { data, isLoading, error } = useAppSelector((state) => state.menu);
  const selectedAddress = useAppSelector(selectSelectedAddress);
  const branchId = selectedAddress?.branchId || 0;

  useEffect(() => {
    if (!connection || !isConnected) return;

    dispatch(menuRequested());

    const handler = (response: MenuResponse) => {
      console.log("Menu Response for branch:", branchId, response);
      dispatch(menuReceived(response.dataPayload));
    };

    connection.on('MenuResponse', handler);
    connection.on("Ack", (ack) => console.log("Ack: " + JSON.stringify(ack)));

    connection.invoke('DataRequest', 'rollinnbbq.pk', 'Menu', branchId, 'MenuResponse')
      .catch((err) => {
        console.error('Menu fetch error:', err);
        dispatch(menuError(err?.message ?? 'Error while requesting menu'));
      });

    return () => {
      connection.off('MenuResponse', handler);
    };
  }, [connection, isConnected, branchId, dispatch]);

  return {
    menuData: data,
    isLoading,
    error,
    branchId,
  };
}