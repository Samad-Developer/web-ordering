import { axiosClient } from './axios-client';

function getUserId(): string {
  if (typeof window === 'undefined') return '';
  
  let userId = localStorage.getItem('user_id');
  if (!userId) {
    userId = `user_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
    localStorage.setItem('user_id', userId);
  }
  return userId;
}

export async function fetchAuthToken(username: string, password: string): Promise<string> {
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