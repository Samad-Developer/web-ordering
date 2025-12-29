"use client";

import React from "react";
import BannerWrapper from "@/components/banner";
import CategoryBar from "./partials/category-bar";
import AnimatedSearch from "./partials/search-bar";
import { SearchProvider } from "@/contexts/SearchContext";
import CategorySection from "./partials/category-section/CategorySection";
import { FloatingCartButton } from "../shared/cart/FloatingCartButton";
import { useAppSelector } from "@/store/hooks";
import { selectCartItemCount } from "@/store/slices/cartSlice";
import { useMenu } from "@/lib/signalR/hooks/useMenu";

const MenuWrapper = () => {
  const { menuData, isLoading, error, refetch } = useMenu();
  const itemCount = useAppSelector(selectCartItemCount);


  return (
    <div>
      <SearchProvider>
        <BannerWrapper />
        <CategoryBar />
        <AnimatedSearch />

        {
          isLoading ?
            <div className="w-full h-screen flex items-center justify-center">
              <p>Loading Menu Plz wait...</p>
            </div>
            :
            <div className="my-10">
              {menuData?.map((category) => (
                <CategorySection key={category?.Id} category={category} />
              ))}
            </div>
        }
        {itemCount > 0 && <FloatingCartButton />}

        {/* create a divided betweeen menu and footer */}
        <div className="border border-gray-600 mt-20 max-w-4xl mx-auto"></div>
      </SearchProvider>
    </div>
  );
};

export default MenuWrapper;
