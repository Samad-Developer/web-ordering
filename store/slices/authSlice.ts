import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAuthToken } from '@/services/api/auth-api';

interface AuthState {
  token: string ;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: '',
  isLoading: false,
  error: null,
};

export const getToken = createAsyncThunk(
  'auth/getToken',
  async ({ username, password }: { username: string; password: string }) => {
    const token = await fetchAuthToken(username, password);
    return token;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload;
      })
      .addCase(getToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to get token';
      });
  },
});

export default authSlice.reducer;