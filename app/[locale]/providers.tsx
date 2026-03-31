'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { initializeCart } from '@/store/slices/cartSlice';
import { initializeAddress } from '@/store/slices/addressSlice';

function CartInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize user selected address and branch details from localStorage
    store.dispatch(initializeAddress());
    // Initialize cart from localStorage on mount
    store.dispatch(initializeCart());
    
  }, []);

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