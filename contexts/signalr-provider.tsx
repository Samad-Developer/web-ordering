'use client';

import { getToken } from '@/store/slices/authSlice';
import type { HubConnection } from '@microsoft/signalr';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createSignalRConnection } from '@/services/signalR/connection';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { menuRequested } from '@/store/slices/menuSlice';

interface SignalRContextType {
  connection: HubConnection | null;
  isConnected: boolean;
}

const SignalRContext = createContext<SignalRContextType>({
  connection: null,
  isConnected: false,
});

export function SignalRProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);



  useEffect(() => {
    if (token) return;

    dispatch(
      getToken({
        username: process.env.NEXT_PUBLIC_USERNAME || '',
        password: process.env.NEXT_PUBLIC_PASSWORD || '',
      })
    );
  }, [token, dispatch]);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const connect = async () => {
      try {
        dispatch(menuRequested());
        const conn = await createSignalRConnection(token);
        if (cancelled) return;
        setConnection(conn);
        setIsConnected(true);
      } catch (err) { 
        console.error('SignalR connection failed:', err); 
      }
    };

    connect();

    return () => {
      cancelled = true;
    };
  }, [token, dispatch]);

  return (
    <SignalRContext.Provider value={{ connection, isConnected }}>
      {children}
    </SignalRContext.Provider>
  );
}

export function useSignalR() {
  return useContext(SignalRContext);
}
