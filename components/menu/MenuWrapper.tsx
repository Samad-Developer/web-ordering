"use client";

import React from "react";
import { useMenu } from "@/contexts/MenuContext";
import BannerWrapper from "@/components/banner";
import CategoryBar from "./partials/category-bar";
import AnimatedSearch from "./partials/search-bar";
import { SearchProvider } from "@/contexts/SearchContext";
import CategorySection from "./partials/category-section/CategorySection";

const MenuWrapper = () => {
  const { menu } = useMenu();

  return (
    <div>
      <SearchProvider>
        <BannerWrapper />
        <CategoryBar />
        <AnimatedSearch />

        <div className="my-10">
          {menu?.map((category) => (
            <CategorySection key={category?.Id} category={category} />
          ))}
        </div>

        {/* create a divided betweeen menu and footer */}
        <div className="border border-gray-600 mt-20 max-w-4xl mx-auto"></div>
      </SearchProvider>
    </div>
  );
};

export default MenuWrapper;
