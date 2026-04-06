'use client';

import { store } from '@/store/store';
import { Provider } from 'react-redux';
import React, { useEffect } from 'react';
import { initializeCart } from '@/store/slices/cartSlice';
import { initializeAddress } from '@/store/slices/addressSlice';
import { useWebsiteVersionSync } from '@/hooks/useWebsiteVersionSync';

function CartInitializer({ children }: { children: React.ReactNode }) {
  const { isReady } = useWebsiteVersionSync();

  useEffect(() => {
    if (!isReady) return; 

    store.dispatch(initializeAddress()); // Initialize user selected address and branch details from localStorage
    store.dispatch(initializeCart()); // Initialize cart from localStorage on mount
    
  }, [isReady]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <CartInitializer>
        {children}
      </CartInitializer>
    </Provider>
  );
}