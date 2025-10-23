import React from "react";
import CategoryImageBanner from "./CategoryImageBanner";
import CategoryTextBanner from "./CategoryTextBanner";
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
  const { Name, Image } = categoryInfo;

  switch (layout) {
    case "image":
      return <CategoryImageBanner categoryImage={Image} alt={Name} />;
    case "text":
      return <CategoryTextBanner categorName={Name} />;
    // case "video":
    // return <CategoryVideoBanner videoUrl={categoryInfo} />;
    default:
      return null;
  }
};

export default CategoryBannerWrapper;
