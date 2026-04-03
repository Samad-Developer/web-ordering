import * as signalR from '@microsoft/signalr';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ordering.eatx.pk';

let connection: signalR.HubConnection | null = null;
let connectionToken: string | null = null;

export async function createSignalRConnection(token: string): Promise<signalR.HubConnection> {
  // CHANGE 1: Detect token changes and force recreation
  const tokenChanged = connectionToken && connectionToken !== token;
  
  if (tokenChanged && connection) {
    console.log('SignalR: Token changed, recreating connection');
    try {
      await connection.stop();
    } catch (error) {
      console.error('Error stopping old connection:', error);
    }
    connection = null;
  }

  connectionToken = token;

  // If connection exists and is connected, return it
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    return connection;
  }

  // If connection exists but not connected, try to start it
  if (connection && connection.state === signalR.HubConnectionState.Disconnected) {
    try {
      await connection.start();
      return connection;
    } catch (error) {
      console.error('Failed to restart existing connection:', error);
      connection = null; // CHANGE 3: Force recreation on failure
    }
  }

  // Create new connection
  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/gatewayHub`, {
      accessTokenFactory: () => connectionToken || token, // CHANGE 2: Use latest token
      withCredentials: false,
    })
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: (retryContext) => {
        // Custom retry strategy: 0ms, 2s, 5s, 10s, 30s, then 30s repeatedly
        const delays = [0, 2000, 5000, 10000, 30000];
        return delays[Math.min(retryContext.previousRetryCount, delays.length - 1)];
      }
    })
    .withKeepAliveInterval(15000)
    .withServerTimeout(30000)
    .configureLogging(signalR.LogLevel.Warning)
    .build();

  // Setup event handlers
  connection.onreconnecting((error) => {
    console.log('SignalR: Reconnecting...', error?.message);
  });

  connection.onreconnected((connectionId) => {
    console.log('SignalR: Reconnected with ID:', connectionId);
  });

  connection.onclose(async (error) => {
    console.log('SignalR: Connection closed', error?.message);
    // Attempt to reconnect after a delay
    setTimeout(() => {
      if (connectionToken) {
        reconnectSignalR().catch(console.error);
      }
    }, 5000);
  });

  // Start connection
  try {
    await connection.start();
    console.log('SignalR: Connected successfully');
  } catch (error) {
    console.error('SignalR: Failed to start connection:', error);
    throw error;
  }

  return connection;
}

export function getSignalRConnection(): signalR.HubConnection | null {
  return connection;
}

export function getConnectionState(): signalR.HubConnectionState | null {
  return connection?.state ?? null;
}

export function isConnectionActive(): boolean {
  return connection?.state === signalR.HubConnectionState.Connected;
}

/**
 * Ensures connection is active, waits for reconnection if needed
 * Returns true if connection is ready, false if failed
 */
export async function ensureConnection(maxWaitMs: number = 10000): Promise<boolean> {
  // Already connected
  if (isConnectionActive()) {
    return true;
  }

  // No connection instance, try to create one
  if (!connection && connectionToken) {
    try {
      await createSignalRConnection(connectionToken);
      return true;
    } catch (error) {
      console.error('Failed to create connection:', error);
      return false;
    }
  }

  // Connection exists but not connected, try to start it
  if (connection && connection.state === signalR.HubConnectionState.Disconnected) {
    try {
      await connection.start();
      return true;
    } catch (error) {
      console.error('Failed to start connection:', error);
      return false;
    }
  }

  // Connection is reconnecting, wait for it
  if (connection && connection.state === signalR.HubConnectionState.Reconnecting) {
    return waitForConnection(maxWaitMs);
  }

  return false;
}

/**
 * Waits for connection to become active
 */
function waitForConnection(maxWaitMs: number): Promise<boolean> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      if (isConnectionActive()) {
        clearInterval(interval);
        resolve(true);
      } else if (Date.now() - startTime > maxWaitMs) {
        clearInterval(interval);
        resolve(false);
      }
    }, 100);
  });
}

/**
 * Manually trigger reconnection
 */
async function reconnectSignalR(): Promise<void> {
  if (!connectionToken) {
    console.error('No token available for reconnection');
    return;
  }

  try {
    await createSignalRConnection(connectionToken);
  } catch (error) {
    console.error('Reconnection failed:', error);
  }
}

export async function disconnectSignalR(): Promise<void> {
  if (connection) {
    try {
      await connection.stop();
    } catch (error) {
      console.error('Error stopping connection:', error);
    }
    connection = null;
    connectionToken = null;
  }
}