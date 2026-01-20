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

function getUserId(): string {
  try {
    // Try to get from localStorage
    const existingId = localStorage.getItem(USER_ID_KEY);
    
    if (existingId) {
      console.log('📱 Using existing user ID:', existingId);
      return existingId;
    }

    // Create new ID
    const newId = createRandomUserId();
    localStorage.setItem(USER_ID_KEY, newId);
    console.log('✨ Created new user ID:', newId);
    
    return newId;
  } catch (error) {
    console.error('Failed to access localStorage:', error);
    // Fallback: generate temporary ID (won't persist)
    return createRandomUserId();
  }
}

/**
 * Fetch authentication token
 */
export async function fetchAuthToken(
  username: string, 
  password: string
): Promise<string> {
  const userId = getUserId(); // ✅ Get or create persistent ID
  
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