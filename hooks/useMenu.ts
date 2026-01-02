'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useSignalR } from '@/contexts/signalr-provider';
import { menuRequested } from '@/store/slices/menuSlice';
import { MenuResponse } from '@/types/menu.types';
import { menuReceived, menuError } from '@/store/slices/menuSlice';

export function useMenu() {
  const dispatch = useAppDispatch();
  const { connection, isConnected } = useSignalR();
  const { data, isLoading, error } = useAppSelector((state) => state.menu);

  useEffect(() => {
    if (!connection || !isConnected || data) return;
    dispatch(menuRequested());

    try {
      console.log('Requesting menu...');
      connection.invoke('MenuRequest');

      connection.on('MenuResponse', (data: MenuResponse) => {
        dispatch(menuReceived(data.menu));
      });

    } catch (err) {
      dispatch(
        menuError(err instanceof Error ? err.message : 'Error while requesting menu')
      );
    }
  }, [connection, isConnected, dispatch]);

  return {
    menuData: data,
    isLoading,
    error,
  };
}

