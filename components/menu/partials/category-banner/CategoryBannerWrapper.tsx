import React from "react";
import CategoryImageBanner from "./CategoryImageBanner";
import CategoryTextBanner from "./CategoryTextBanner";
import CategoryVideoBanner from "./CategoryVideoBanner";
import { CategoryInfo } from "@/types/menu.types";

interface CategoryBannerProps {
  categoryInfo: CategoryInfo;
}

const CategoryBannerWrapper: React.FC<CategoryBannerProps> = ({
  categoryInfo,
}) => {

  const hasImage = Boolean(categoryInfo.Image) && categoryInfo.Image !== "N/A";

  if (hasImage) {
    return <CategoryImageBanner categoryInfo={categoryInfo} />;
  } else {
    return <CategoryTextBanner categoryInfo={categoryInfo} alignment="center" />;
  }
};

export default CategoryBannerWrapper;
