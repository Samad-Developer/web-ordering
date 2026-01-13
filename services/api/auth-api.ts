import { axiosClient } from './axios-client';

function createRandomUserId() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let part1 = "";
  let part2 = "";

  for (let i = 0; i < 4; i++) {
    part1 += chars[Math.floor(Math.random() * chars.length)];
    part2 += chars[Math.floor(Math.random() * chars.length)];
  }

  return part1 + "-" + part2;
}

export async function fetchAuthToken(username: string, password: string): Promise<string> {
  const userId = createRandomUserId();
  
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