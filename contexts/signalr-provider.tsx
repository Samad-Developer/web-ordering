'use client';

import type { HubConnection } from '@microsoft/signalr';
import { SignalRContextType } from '@/lib/signalR/types';
import { fetchToken, clearStoredToken, getStoredToken } from '@/lib/signalR/auth';
import { createConnection, setupConnectionHandlers } from '@/lib/signalR/connection';
import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const SignalRContext = createContext<SignalRContextType | null>(null);

interface SignalRProviderProps {
  children: React.ReactNode;
  username: string;
  password: string;
  autoConnect?: boolean;
}

export function SignalRProvider({ 
  children, 
  username, 
  password,
  autoConnect = true 
}: SignalRProviderProps) {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tokenRef = useRef<string | null>(null);

  const disconnect = useCallback(async () => {
    if (connection) {
      try {
        await connection.stop();
        setConnection(null);
        setIsConnected(false);
        clearStoredToken();
        tokenRef.current = null;
      } catch (err) {
        console.error('Failed to disconnect:', err);
      }
    }
  }, [connection]);

  const connect = useCallback(async () => {
    if (isConnected || isConnecting) return;

    setIsConnecting(true);
    setError(null);

    try {
      // Get or fetch token
      let token = getStoredToken();
      if (!token) {
        token = await fetchToken(username, password);
      }
      tokenRef.current = token;

      // Create connection
      const newConnection = createConnection(token);

      // Setup handlers
      setupConnectionHandlers(
        newConnection,
        () => setIsConnecting(true),
        () => {
          setIsConnected(true);
          setIsConnecting(false);
        },
        () => {
          setIsConnected(false);
          clearStoredToken();
        }
      );

      // Start connection
      await newConnection.start();
      
      setConnection(newConnection);
      setIsConnected(true);
      console.log('SignalR Connected Successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect';
      setError(errorMessage);
      console.error('SignalR connection failed:', err);
    } finally {
      setIsConnecting(false);
    }
  }, [username, password, isConnected, isConnecting]);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      if (connection) {
        connection.stop().catch(console.error);
      }
    };
  }, [autoConnect]);

  return (
    <SignalRContext.Provider 
      value={{
        connection,
        isConnected,
        isConnecting,
        error,
        connect,
        disconnect,
      }}
    >
      {children}
    </SignalRContext.Provider>
  );
}

export function useSignalRContext() {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error('useSignalRContext must be used within SignalRProvider');
  }
  return context;
}
