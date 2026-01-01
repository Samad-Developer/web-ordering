import type { HubConnection } from '@microsoft/signalr';
import { MenuResponse, MenuCategory } from '@/types/menu.types';

export function requestMenu(connection: HubConnection): Promise<MenuCategory[]> {
    return new Promise(async (resolve, reject) => {
        
      const handler = (data: MenuCategory[]) => {
        connection.off("MenuResponse", handler);
        resolve(data);
      };
  
      connection.on("MenuResponse", handler);
  
      try {
        await connection.invoke("MenuRequest");
      } catch (err) {
        connection.off("MenuResponse", handler);
        reject(err);
      }
    });
  }