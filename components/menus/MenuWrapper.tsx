"use client";

import React from "react";
import CategoryBar from "./partials/category-bar";
import BannerWrapper from "@/components/banner";
import AnimatedSearch from "./partials/search-bar";
import { SearchProvider } from "@/contexts/SearchContext";

const MenuWrapper = () => {
  return (
    <div>
      <SearchProvider>
        <BannerWrapper />
        <CategoryBar />
        <AnimatedSearch />

        {/* Create a dummy space in page */}
        <p className="py-96"></p>
        {/* <PopularItems/> */}
        {/* <CategorySections/>  */}
      </SearchProvider>
    </div>
  );
};

export default MenuWrapper;
