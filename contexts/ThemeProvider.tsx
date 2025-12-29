'use client';

import { useEffect, ReactNode } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setThemeColors } from '@/store/slices/themeSlice';
import { applyThemeToDocument } from '@/lib/theme/themeUtils';
import { ThemeColors } from '@/types/theme.types';
import { defaultThemeColors } from '@/data/themeColors';


interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function initTheme() {
      dispatch(setThemeColors(defaultThemeColors));
      applyThemeToDocument(defaultThemeColors);
    }

    initTheme();
  }, [dispatch]);

  return children;
}
