import { getSavedBranchId } from '@/lib/address/addressHelpers';
import { axiosClient } from './axios-client';

const USER_ID_KEY = 'app_user_id';

function createRandomUserId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let part1 = "";
  let part2 = "";

  for (let i = 0; i < 4; i++) {
    part1 += chars[Math.floor(Math.random() * chars.length)];
    part2 += chars[Math.floor(Math.random() * chars.length)];
  }

  return `${part1}-${part2}`;
}

function getUserId() {
  try {
    // Try to get from localStorage
    // const existingId = localStorage.getItem(USER_ID_KEY);
    // if (existingId) return existingId;

    // create new user id and save to localStorage
    const branchId = getSavedBranchId();
    const randomId = createRandomUserId();
    const fullId = `user:${branchId}:${randomId}`;
    localStorage.setItem(USER_ID_KEY, fullId);

    return fullId;
  } catch (error) {
    console.error('Failed to access localStorage:', error);
  }
}

/**
 * Fetch authentication token
 */
export async function fetchAuthToken(
  username: string,
  password: string
): Promise<string> {
  const userId = getUserId(); 

  const response = await axiosClient.post('/generate-token', {
    username,
    password,
    userId,
  });

  if (!response.data.token) {
    throw new Error('No token in response');
  }

  return response.data.token;
}

/**
 * Optional: Clear user ID (for logout, etc.)
 */
export function clearUserId(): void {
  try {
    localStorage.removeItem(USER_ID_KEY);
    console.log('🗑️ User ID cleared');
  } catch (error) {
    console.error('Failed to clear user ID:', error);
  }
}