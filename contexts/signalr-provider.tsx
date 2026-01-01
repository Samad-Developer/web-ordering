'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getToken } from '@/store/slices/authSlice';
import { menuReceived, menuError } from '@/store/slices/menuSlice';
import { createSignalRConnection } from '@/services/signalR/connection';
import type { HubConnection } from '@microsoft/signalr';
import { MenuResponse } from '@/types/menu.types';

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

  const handlersRegisteredRef = useRef(false);

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
        const conn = await createSignalRConnection(token);
        if (cancelled) return;

        // Prevent duplicate handlers (Strict Mode safe)
        if (!handlersRegisteredRef.current) {
          conn.on('MenuResponse', (data: MenuResponse) => {
            dispatch(menuReceived(data.menu));
          });

          handlersRegisteredRef.current = true;
        }

        setConnection(conn);
        setIsConnected(true);
      } catch (err) {
        dispatch(
          menuError(err instanceof Error ? err.message : 'SignalR connection failed')
        );
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
