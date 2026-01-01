'use client';

import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useSignalR } from '@/contexts/signalr-provider';
import { menuRequested } from '@/store/slices/menuSlice';

export function useMenu() {
  const dispatch = useAppDispatch();
  const { connection, isConnected } = useSignalR();
  const { data, isLoading, error } = useAppSelector((state) => state.menu);

  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if (!connection || !isConnected || data) return;
    if (hasRequestedRef.current) return;

    hasRequestedRef.current = true;

    dispatch(menuRequested());

    try {
      console.log('Requesting menu...');
      connection.invoke('MenuRequest');
    } catch (err) {
      console.error('Failed to request menu:', err);
    }
  }, [connection, isConnected, dispatch]);

  return {
    menuData: data,
    isLoading,
    error,
  };
}
