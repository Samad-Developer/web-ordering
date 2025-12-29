export const SIGNALR_CONFIG = {
    SERVER_URL: process.env.NEXT_PUBLIC_SIGNALR_URL || "http://85.190.242.39",
    SERVER_PORT: process.env.NEXT_PUBLIC_SIGNALR_PORT || "8090",
    HUB_PATH: "/gatewayHub",
    TOKEN_ENDPOINT: "/generate-token",
  } as const;
  
  export function getHubUrl(token?: string) {
    const baseUrl = `${SIGNALR_CONFIG.SERVER_URL}:${SIGNALR_CONFIG.SERVER_PORT}${SIGNALR_CONFIG.HUB_PATH}`;
    return token ? `${baseUrl}?access_token=${encodeURIComponent(token)}` : baseUrl;
  }
  
  export function getTokenUrl() {
    return `${SIGNALR_CONFIG.SERVER_URL}:${SIGNALR_CONFIG.SERVER_PORT}${SIGNALR_CONFIG.TOKEN_ENDPOINT}`;
  }
  