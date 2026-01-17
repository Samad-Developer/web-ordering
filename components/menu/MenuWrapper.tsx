"use client";

import React, { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { openAddressModal } from "@/store/slices/addressSlice";
import { useAddress } from "@/hooks/useAddress";
import { hasSelectedBranch } from "@/lib/address/addressHelpers";
import BannerWrapper from "@/components/banner";
import CategoryBar from "./partials/category-bar";
import AnimatedSearch from "./partials/search-bar";
import { useMenu } from "@/hooks/useMenu";
import { useAppSelector } from "@/store/hooks";
import { selectCartItemCount } from "@/store/slices/cartSlice";
import { FloatingCartButton } from "../shared/cart/FloatingCartButton";
import CategorySection from "./partials/category-section/CategorySection";
import LoadingState from "../states/LoadingState";
import { useSearch } from "@/contexts/SearchContext";
import { useMenuSearch } from "@/hooks/useMenuSearch";
import ErrorState from "../states/ErrorState";

const MenuWrapper = () => {
  const { apiData } = useAddress();
  const dispatch = useAppDispatch();
  const { searchQuery } = useSearch();
  const { menuData, error } = useMenu();
  const itemCount = useAppSelector(selectCartItemCount);

  const {
    filteredMenu,
    totalResults,
    hasResults,
    isSearching,
    isLoading,
  } = useMenuSearch(searchQuery);

  // Auto-open modal for first-time users
  useEffect(() => {
    const shouldAutoOpen = !hasSelectedBranch() && apiData;

    if (shouldAutoOpen) {
      const timer = setTimeout(() => {
        dispatch(openAddressModal());
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [apiData, dispatch]);

  if (isLoading && !menuData) {
    return <LoadingState />
  }


  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div>
      <BannerWrapper />
      <CategoryBar />
      <AnimatedSearch />

      {/* Search Results Info */}
      {isSearching && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          {hasResults ? (
           <p className="text-gray-600">
           Found {totalResults} item{totalResults !== 1 ? "s" : ""} matching&nbsp;
           &quot;{searchQuery}&quot;
         </p>
         
          
          ) : (
            <div className="text-center py-10">
              <p className="text-xl text-gray-600 mb-2">
                No items found
              </p>
              <p className="text-sm text-gray-500">
                Try searching with different keywords
              </p>
            </div>
          )}
        </div>
      )}

      <div className="my-10">
        {filteredMenu?.map((category) => (
          <CategorySection key={category?.Id} category={category} />
        ))}
      </div>

      {itemCount > 0 && <FloatingCartButton />}
    </div>
  );
};

export default MenuWrapper;