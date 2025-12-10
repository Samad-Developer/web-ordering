"use client";

import React from "react";
import { useParams } from "next/navigation";
import { fromSlug } from "@/lib/address/slug";
import { useMenu } from "@/contexts/MenuContext";
import CategorySection from "@/components/menu/partials/category-section";

const CategoryPage = () => {
  const { slug } = useParams();
  const { menu } = useMenu();


  if (!slug || Array.isArray(slug)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Invalid Category URL
          </h2>
          <p className="text-gray-600">
            The URL is not correctly formatted.
          </p>
        </div>
      </div>
    );
  }

  const categoryName = fromSlug(slug);
  const category = menu.find(
    (cat) => cat.Name.toLowerCase() === categoryName.toLowerCase()
  );

  if (!category) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Category Not Found
          </h2>
          <p className="text-gray-600">
            The category you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CategorySection key={category.Id} category={category} />
    </div>
  );
};

export default CategoryPage;
