'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSignalRContext } from '@/contexts/signalr-provider';
import { MenuCategory, MenuResponse } from '@/types/menu.types';

export function useMenu() {
  const { connection, isConnected } = useSignalRContext();
  const [menuData, setMenuData] = useState<MenuCategory[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = useCallback(async () => {
    if (!connection || !isConnected) {
      setError('Not connected to server');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call the MenuRequest method on the server
       await connection.invoke<MenuCategory[]>('MenuRequest');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch menu';
      setError(errorMessage);
      console.error('Menu fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [connection, isConnected]);

  useEffect(() => {
    if (!connection || !isConnected) return;

    // Listen for real-time menu updates from server
    const handleMenuResponse = (data: MenuResponse) => {
      console.log('Menu Response:', data);
      setMenuData(data?.menu);
    };

    connection.on('MenuResponse', handleMenuResponse);

    // Fetch initial menu data
    fetchMenu();

    // Cleanup listener
    return () => {
      connection.off('MenuResponse', handleMenuResponse);
    };
  }, [connection, isConnected, fetchMenu]);

  return {
    menuData,
    isLoading,
    error,
    refetch: fetchMenu,
  };
}