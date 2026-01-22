'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectAddressApiData } from '@/store/slices/addressSlice';
import { initializeTheme } from '@/lib/theme/themeManager';

export function useTheme() {
  const addressAndThemeData = useAppSelector(selectAddressApiData);

  useEffect(() => {
    const themeColors = addressAndThemeData?.dataPayload.Theme.Colors;
    
    if (!themeColors) {
      initializeTheme();
      return;
    }

    initializeTheme(themeColors);
  }, [addressAndThemeData]);
}