import type { HubConnection } from '@microsoft/signalr';

export interface TokenResponse {
  token: string;
  expiresIn?: number;
}

export interface SignalRContextType {
  connection: HubConnection | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}