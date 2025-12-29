import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeColors } from '@/types/theme.types';
import { defaultThemeColors } from '@/data/themeColors';

interface ThemeState {
  colors: ThemeColors;
  isLoading: boolean;
  isInitialized: boolean;
}

const initialState: ThemeState = {
  colors: defaultThemeColors,
  isLoading: false,
  isInitialized: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeColors: (state, action: PayloadAction<ThemeColors>) => {
      state.colors = action.payload;
      state.isInitialized = true;
    },
    
    setThemeLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    resetTheme: (state) => {
      state.colors = defaultThemeColors;
      state.isInitialized = false;
    },
  },
});

export const { setThemeColors, setThemeLoading, resetTheme } = themeSlice.actions;

export default themeSlice.reducer;

// Selectors
export const selectThemeColors = (state: { theme: ThemeState }) => state.theme.colors;
export const selectIsThemeLoading = (state: { theme: ThemeState }) => state.theme.isLoading;
export const selectIsThemeInitialized = (state: { theme: ThemeState }) => state.theme.isInitialized;