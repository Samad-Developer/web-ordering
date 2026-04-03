"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import * as signalR from "@microsoft/signalr";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getToken } from "@/store/slices/authSlice";
import { menuRequested } from "@/store/slices/menuSlice";
import { 
  createSignalRConnection, 
  getSignalRConnection, 
  disconnectSignalR,
  ensureConnection,
} from "@/services/signalR/connection";

interface SignalRContextType {
  connection: signalR.HubConnection | null;
  isConnected: boolean;
  isReconnecting: boolean;
  connectionState: signalR.HubConnectionState | null;
  ensureConnected: () => Promise<boolean>;
}

const SignalRContext = createContext<SignalRContextType>({
  connection: null,
  isConnected: false,
  isReconnecting: false,
  connectionState: null,
  ensureConnected: async () => false,
});

export function SignalRProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [connectionState, setConnectionState] = useState<signalR.HubConnectionState | null>(null);

  const updateConnectionState = useCallback((conn: signalR.HubConnection | null) => {
    const state = conn?.state ?? null;
    setConnectionState(state);
    setIsConnected(state === signalR.HubConnectionState.Connected);
    setIsReconnecting(state === signalR.HubConnectionState.Reconnecting);
  }, []);

  const ensureConnected = useCallback(async (): Promise<boolean> => {
    try {
      const success = await ensureConnection(10000);
      if (success) {
        const conn = getSignalRConnection();
        setConnection(conn);
        updateConnectionState(conn);
      }
      return success;
    } catch (error) {
      console.error("Failed to ensure connection:", error);
      return false;
    }
  }, [updateConnectionState]);

  // Get token if not available
  useEffect(() => {
    if (token) return;

    dispatch(
      getToken({
        username: process.env.NEXT_PUBLIC_USERNAME || '',
        password: process.env.NEXT_PUBLIC_PASSWORD || '',
      })
    );
  }, [token, dispatch]);

  // Initialize connection when token is available
  useEffect(() => {
    if (!token) return;

    let mounted = true;
    let stateCheckInterval: NodeJS.Timeout;

    const initConnection = async () => {
      try {
        // Request menu data
        dispatch(menuRequested());

        const conn = await createSignalRConnection(token);
        
        if (!mounted) return;

        setConnection(conn);
        updateConnectionState(conn);

        // Setup state change handlers
        conn.onreconnecting(() => {
          if (mounted) {
            setIsReconnecting(true);
            setIsConnected(false);
            setConnectionState(signalR.HubConnectionState.Reconnecting);
          }
        });

        conn.onreconnected(() => {
          if (mounted) {
            setIsReconnecting(false);
            setIsConnected(true);
            setConnectionState(signalR.HubConnectionState.Connected);
          }
        });

        conn.onclose(() => {
          if (mounted) {
            setIsConnected(false);
            setIsReconnecting(false);
            setConnectionState(signalR.HubConnectionState.Disconnected);
          }
        });

        // Periodic state check (backup mechanism)
        stateCheckInterval = setInterval(() => {
          if (mounted && conn) {
            updateConnectionState(conn);
          }
        }, 2000);

      } catch (error) {
        console.error("Failed to initialize SignalR:", error);
        if (mounted) {
          setConnection(null);
          updateConnectionState(null);
        }
      }
    };

    initConnection();

    return () => {
      mounted = false;
      clearInterval(stateCheckInterval);
      disconnectSignalR();
    };
  }, [token, dispatch, updateConnectionState]);

  return (
    <SignalRContext.Provider 
      value={{ 
        connection, 
        isConnected, 
        isReconnecting,
        connectionState,
        ensureConnected
      }}
    >
      {children}
    </SignalRContext.Provider>
  );
}

export function useSignalR() {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error("useSignalR must be used within SignalRProvider");
  }
  return context;
}