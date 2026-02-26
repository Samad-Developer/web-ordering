import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuCategory, MenuResponse } from '@/types/menu.types';

interface MenuState {
  data: MenuCategory[] | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  data: null,
  isLoading: true,
  error: null,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    // Called when we send MenuRequest
    menuRequested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    // Called when MenuResponse arrives from SignalR
    menuReceived: (state, action: PayloadAction<MenuCategory[]>) => {
      state.isLoading = false;
      state.data = action.payload;
    },
    // Called if error occurs
    menuError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { menuRequested, menuReceived, menuError } = menuSlice.actions;
export default menuSlice.reducer;