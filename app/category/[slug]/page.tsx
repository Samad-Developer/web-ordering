"use client";

import React from "react";
import { useParams } from "next/navigation";
import { fromSlug } from "@/lib/address/slug";
import { useMenu } from "@/lib/signalR/hooks/useMenu";
import CategorySection from "@/components/menu/partials/category-section";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const CategoryPage = () => {
  const { slug } = useParams();
  const { menuData } = useMenu();
  const router = useRouter();


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
  const category = menuData?.find(
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
            {"The category you're looking for doesn't exist."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-0 py-8">
      <div className="flex items-center justify-start">
        <Button variant='outline' onClick={() => router.push('/')} className="rounded-md cursor-pointer">
          <ArrowLeft/>
          Back to Menu
        </Button>
      </div>
      <CategorySection key={category.Id} category={category} />
    </div>
  );
};

export default CategoryPage;
