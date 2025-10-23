import React from "react";
import CategoryBannerWrapper from "../category-banner";
import { MenuCategory } from "@/types/menu.types";

interface CategorySectionProps {
    category: MenuCategory;
}

const CategorySection: React.FC<CategorySectionProps> = ({ category }) => {

    const { Items, ...categoryInfo } = category;

    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-0">
            <CategoryBannerWrapper categoryInfo={categoryInfo}/>

            {/* 
                <ItemsList/> will be contain grid classes to show items in grid format and will map through items of the category
                the ItemsList will be contain ItemCard component to show each item details
            */}
        </div>
    );
};

export default CategorySection;
