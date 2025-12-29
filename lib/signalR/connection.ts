

import * as signalR from '@microsoft/signalr';
import { getHubUrl } from './config';

export function createConnection(token: string) {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(getHubUrl(token), {
      accessTokenFactory: () => token,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: (retryContext) => {
        // Exponential backoff: 2s, 4s, 8s, 16s, 32s
        if (retryContext.previousRetryCount >= 5) {
          return null; // Stop reconnecting
        }
        return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 32000);
      },
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

  return connection;
}

export function setupConnectionHandlers(
  connection: signalR.HubConnection,
  onReconnecting?: () => void,
  onReconnected?: () => void,
  onClose?: () => void
) {
  connection.onreconnecting((error) => {
    console.warn('SignalR Reconnecting...', error);
    onReconnecting?.();
  });

  connection.onreconnected((connectionId) => {
    console.log('SignalR Reconnected:', connectionId);
    onReconnected?.();
  });

  connection.onclose((error) => {
    console.error('SignalR Connection Closed:', error);
    onClose?.();
  });
}