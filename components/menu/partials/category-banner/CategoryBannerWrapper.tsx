import React from "react";
import CategoryImageBanner from "./CategoryImageBanner";
import CategoryTextBanner from "./CategoryTextBanner";
import CategoryVideoBanner from "./CategoryVideoBanner";
import { CategoryInfo } from "@/types/menu.types";

interface CategoryBannerProps {
  categoryInfo: CategoryInfo;
}
type BannerLayout = "image" | "video" | "text";

const CATEGORY_BANNER_CONFIG: { layout: BannerLayout } = {
  layout: "image",
};

const CategoryBannerWrapper: React.FC<CategoryBannerProps> = ({
  categoryInfo,
}) => {
  const { layout } = CATEGORY_BANNER_CONFIG;

  switch (layout) {
    case "image":
      return <CategoryImageBanner categoryInfo={categoryInfo}/>;
    case "text":
      return <CategoryTextBanner categoryInfo={categoryInfo} alignment="center" />;
    case "video":
      return <CategoryVideoBanner />;
    default:
      return null;
  }
};

export default CategoryBannerWrapper;
