import React from "react";
import ItemsList from "./ItemsList";
import { MenuCategory } from "@/types/menu.types";
import CategoryBannerWrapper from "../category-banner";

interface CategorySectionProps {
    category: MenuCategory;
}

const CategorySection: React.FC<CategorySectionProps> = ({ category }) => {

    const { Items, ...categoryInfo } = category;

    return (
        <section id={categoryInfo.Id} className="max-w-7xl mx-auto px-2 sm:px-0">

            <CategoryBannerWrapper categoryInfo={categoryInfo}/>
            <ItemsList itemsList={Items}/> 

        </section>
    );
};

export default CategorySection;
