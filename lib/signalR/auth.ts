import { getTokenUrl } from './config';
import type { TokenResponse } from './types';

const USER_ID_KEY = 'signalr_user_id';
const TOKEN_KEY = 'signalr_token';

function generateUserId() {
  return `user_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
}

export function getUserId() {
  if (typeof window === 'undefined') return '';
  
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(TOKEN_KEY);
}

export async function fetchToken(username: string, password: string) {
  const userId = getUserId();
  
  try {
    const response = await fetch(getTokenUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, userId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch token: ${response.status}`);
    }

    const data: TokenResponse = await response.json();
    
    if (!data.token) {
      throw new Error('Token not found in response');
    }

    setStoredToken(data.token);
    return data.token;
  } catch (error) {
    console.error('Error fetching JWT token:', error);
    throw error;
  }
}
