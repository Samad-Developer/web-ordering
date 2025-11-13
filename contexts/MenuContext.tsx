'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import menuData from '@/data/menu.json';
import { MenuCategory } from '@/types/menu.types';

// Define the context type
interface MenuContextType {
  menu: MenuCategory[];
}

// Create context with proper typing
const MenuContext = createContext<MenuContextType | undefined>(undefined);

// Props for the provider
interface MenuProviderProps {
  children: ReactNode;
}

export function MenuProvider({ children }: MenuProviderProps) {
  // await conn.invoke("SendRequest", route, JSON.stringify(payload));
  // loading state can be handled here
  // connection.on("Response", (payload) => {});
  return (
    <MenuContext.Provider value={{ menu: menuData as MenuCategory[] }}>
      {children}
    </MenuContext.Provider>
  );
}

// Custom hook
export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
