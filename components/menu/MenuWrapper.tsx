"use client";

import React from "react";
import { useAppSelector } from "@/store/hooks";
import BannerWrapper from "@/components/banner";
import CategoryBar from "./partials/category-bar";
import AnimatedSearch from "./partials/search-bar";
import { useMenu } from "@/hooks/useMenu";
import { SearchProvider } from "@/contexts/SearchContext";
import { selectCartItemCount } from "@/store/slices/cartSlice";
import { FloatingCartButton } from "../shared/cart/FloatingCartButton";
import CategorySection from "./partials/category-section/CategorySection";
import { Spinner } from "../ui/spinner";

const MenuWrapper = () => {
  const { menuData, isLoading, error } = useMenu();
  const {token} = useAppSelector((state) => state.auth);
  console.log('token', token);
  const itemCount = useAppSelector(selectCartItemCount);
  console.log('menuData', menuData);
  console.log('isLoading', isLoading);
  console.log('error', error);

  return (
    <div>
      <SearchProvider>
        <BannerWrapper />
        <CategoryBar />
        <AnimatedSearch />

        {
          ( isLoading && !menuData ) ?
            <div className="w-full h-screen flex items-center justify-center">
              <Spinner/>
            </div>
            :
            <div className="my-10">
              {menuData?.map((category) => (
                <CategorySection key={category?.Id} category={category} />
              ))}
            </div>
        }
        {itemCount > 0 && <FloatingCartButton />}

      </SearchProvider>
    </div>
  );
};

export default MenuWrapper;
