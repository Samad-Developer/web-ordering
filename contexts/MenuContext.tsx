'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import { MenuCategory } from '@/types/menu.types';

// Define the context type
interface MenuContextType {
  menu: MenuCategory[];
  loading: boolean;
  error: string | null;
  refetchMenu: () => Promise<void>;
}

// Create context with proper typing
const MenuContext = createContext<MenuContextType | undefined>(undefined);

// Props for the provider
interface MenuProviderProps {
  children: ReactNode;
}

const SERVER_URL = "http://85.190.242.39";
const SERVER_PORT = 8090;

export function MenuProvider({ children }: MenuProviderProps) {
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

  // Parse JWT token
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        Array.prototype.map
          .call(atob(base64), function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  // Store token in localStorage
  const setStoredToken = (token: string | null, refreshToken?: string | null) => {
    if (token) {
      localStorage.setItem('jwt_token', token);
      const payload = parseJwt(token);
      if (payload && payload.exp) {
        localStorage.setItem('jwt_exp', String(payload.exp * 1000));
      }
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
    } else {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('jwt_exp');
      if (refreshToken === null) {
        localStorage.removeItem('refresh_token');
      }
    }
  };

  // Get stored token
  const getStoredToken = () => {
    try {
      return localStorage.getItem('jwt_token');
    } catch (e) {
      return null;
    }
  };

  // Get stored token expiry
  const getStoredTokenExpiry = () => {
    try {
      const v = localStorage.getItem('jwt_exp');
      return v ? parseInt(v, 10) : null;
    } catch (e) {
      return null;
    }
  };

  // Get refresh token
  const getStoredRefreshToken = () => {
    try {
      return localStorage.getItem('refresh_token');
    } catch (e) {
      return null;
    }
  };

  // Fetch JWT token from server
  const fetchJwtToken = async (username: string, password: string): Promise<string> => {
    const response = await fetch(`${SERVER_URL}:${SERVER_PORT}/generate-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const token = data.token;
    const refreshToken = data.refreshToken || data.refresh_token || null;
    if (token) setStoredToken(token, refreshToken);
    return token;
  };

  // Refresh token
  const fetchRefreshToken = async (oldToken: string): Promise<string> => {
    const refreshToken = getStoredRefreshToken();
    const opts: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${oldToken}`,
      },
    };

    if (refreshToken) {
      opts.body = JSON.stringify({ refreshToken });
    }

    const response = await fetch(`${SERVER_URL}:${SERVER_PORT}/refresh-token`, opts);
    if (!response.ok) {
      throw new Error(`Refresh failed: ${response.status}`);
    }

    const data = await response.json();
    const token = data.token;
    const rt = data.refreshToken || data.refresh_token || null;
    if (token) setStoredToken(token, rt);
    return token;
  };

  // Build SignalR connection
  const buildConnection = (token: string): signalR.HubConnection => {
    const urlWithToken = `${SERVER_URL}:${SERVER_PORT}/gatewayHub?access_token=${encodeURIComponent(token)}`;
    
    return new signalR.HubConnectionBuilder()
      .withUrl(urlWithToken, {
        accessTokenFactory: () => token,
        headers: { Authorization: `Bearer ${token}` },
      })
      .withAutomaticReconnect()
      .build();
  };

  // Send request via SignalR
  const sendRequest = async (conn: signalR.HubConnection, route: string, payload: any): Promise<void> => {
    try {
      await conn.invoke('SendRequest', route, JSON.stringify(payload));
    } catch (err: any) {
      const msg = err?.toString() || String(err);
      if (msg.includes('401') || /unauthor/i.test(msg)) {
        // Token expired, refresh and retry
        const newToken = await fetchRefreshToken(currentToken!);
        setCurrentToken(newToken);
        
        // Reconnect with new token
        await conn.stop();
        const newConn = buildConnection(newToken);
        setupConnectionHandlers(newConn);
        await newConn.start();
        setConnection(newConn);
        
        // Retry request
        await newConn.invoke('SendRequest', route, JSON.stringify(payload));
      } else {
        throw err;
      }
    }
  };

  // Setup connection handlers
  const setupConnectionHandlers = (conn: signalR.HubConnection) => {
    conn.on('Response', (payload) => {
      try {
        const data = typeof payload === 'string' ? JSON.parse(payload) : payload;
        
        // Assuming the response contains menu data
        // Adjust based on actual API response structure
        if (data && (data.menu || Array.isArray(data))) {
          setMenu(Array.isArray(data) ? data : data.menu);
          setLoading(false);
          setError(null);
        }
      } catch (e) {
        console.error('Error parsing menu response:', e);
        setError('Failed to parse menu data');
        setLoading(false);
      }
    });

    conn.on('Ack', (ack) => {
      console.log('Acknowledgment received:', ack);
    });

    conn.onclose(() => {
      console.log('SignalR connection closed');
    });

    conn.onreconnecting(() => {
      console.log('SignalR reconnecting...');
    });

    conn.onreconnected(() => {
      console.log('SignalR reconnected');
    });
  };

  // Initialize connection and fetch menu
  const initializeAndFetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get or fetch token
      let token = getStoredToken();
      
      if (token) {
        // Check if token is expiring soon
        const exp = getStoredTokenExpiry();
        if (exp && exp - Date.now() < 60 * 1000) {
          token = await fetchRefreshToken(token);
        }
      } else {
        token = await fetchJwtToken('admin', 'password');
      }

      setCurrentToken(token);

      // Build and start connection
      const conn = buildConnection(token);
      setupConnectionHandlers(conn);
      
      try {
        await conn.start();
        console.log('Connected to SignalR hub');
      } catch (startErr: any) {
        const msg = startErr?.toString() || String(startErr);
        if (msg.includes('401') || /unauthor/i.test(msg)) {
          // Refresh token and retry
          token = await fetchRefreshToken(token);
          setCurrentToken(token);
          const newConn = buildConnection(token);
          setupConnectionHandlers(newConn);
          await newConn.start();
          setConnection(newConn);
          
          // Send menu request
          await sendRequest(newConn, 'menu.get', { category: 'all' });
          return;
        } else {
          throw startErr;
        }
      }

      setConnection(conn);

      // Send menu request
      await sendRequest(conn, 'menu.get', { category: 'all' });
      
    } catch (err: any) {
      console.error('Failed to fetch menu:', err);
      setError(err?.message || 'Failed to load menu');
      setLoading(false);
    }
  };

  // Refetch menu function
  const refetchMenu = async () => {
    if (connection && connection.state === signalR.HubConnectionState.Connected) {
      setLoading(true);
      await sendRequest(connection, 'menu.get', { category: 'all' });
    } else {
      await initializeAndFetchMenu();
    }
  };

  // Initialize on mount
  useEffect(() => {
    initializeAndFetchMenu();

    // Cleanup on unmount
    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  return (
    <MenuContext.Provider value={{ menu, loading, error, refetchMenu }}>
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