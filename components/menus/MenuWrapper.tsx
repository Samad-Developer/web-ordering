"use client";

import React from "react";
import CategoryBar from "./partials/category-bar";
import BannerWrapper from "@/components/banner";

const MenuWrapper = () => {
  return (
    <div>
      <BannerWrapper />
      <CategoryBar />
      {/* <Search/> */}
      {/* <PopularItems/> */}
      {/* <CategorySections/>  */}
    </div>
  );
};

export default MenuWrapper;
