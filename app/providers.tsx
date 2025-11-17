'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { initializeCart } from '@/store/slices/cartSlice';

function CartInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
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