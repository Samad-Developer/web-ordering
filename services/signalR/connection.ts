import * as signalR from '@microsoft/signalr';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ordering.eatx.pk';

let connection: signalR.HubConnection | null = null;

export async function createSignalRConnection(token: string): Promise<signalR.HubConnection> {
  // If already connected, return existing connection
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    return connection;
  }

  // Create new connection
  connection = new signalR.HubConnectionBuilder()
    .withUrl(
      `${API_BASE_URL}/gatewayHub`,
      {
        accessTokenFactory: () => token,
        withCredentials: false,
      }
    )
    .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
    .withKeepAliveInterval(15000)
    .configureLogging(signalR.LogLevel.Warning)
    .build();

  // Setup event handlers
  connection.onreconnecting(() => console.log('SignalR: Reconnecting...'));
  connection.onreconnected(() => console.log('SignalR: Reconnected'));
  connection.onclose(() => console.log('SignalR: Closed'));

  // Start connection
  await connection.start();

  return connection;
}

export function getSignalRConnection(): signalR.HubConnection | null {
  return connection;
}

export async function disconnectSignalR() {
  if (connection) {
    await connection.stop();
    connection = null;
  }
}