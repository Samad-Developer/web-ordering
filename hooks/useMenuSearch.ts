'use client';

import { useMemo } from 'react';
import { useMenu } from './useMenu';
import { searchMenuItems, getTotalSearchResults } from '../lib/search-bar/utils'

export function useMenuSearch(searchQuery: string) {
  const { menuData, isLoading, error } = useMenu();

  const filteredMenu = useMemo(() => {
    if (!menuData) return null;
    return searchMenuItems(menuData, searchQuery);
  }, [menuData, searchQuery]);

  const totalResults = useMemo(() => {
    if (!filteredMenu) return 0;
    return getTotalSearchResults(filteredMenu);
  }, [filteredMenu]);

  const hasResults = filteredMenu && filteredMenu.length > 0;
  const isSearching = searchQuery.trim() !== '';

  return {
    filteredMenu,
    totalResults,
    hasResults,
    isSearching,
    isLoading,
    error,
  };
}