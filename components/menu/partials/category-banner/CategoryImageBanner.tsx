"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { toSlug } from "@/lib/address/slug";

interface CategoryImageBannerProps {
  categoryImage: string;
  categoryName: string;
  priority?: boolean;
}

const CategoryImageBanner: React.FC<CategoryImageBannerProps> = ({
  categoryImage,
  categoryName,
  priority = false,
}) => {
  const imageSrc = categoryImage && categoryImage.trim() !== "" ? categoryImage : "/assets/images/banner/category-banner/new-arrivals.webp";
  const categorySlug = toSlug(categoryName);

  return (
    <div className="text-center my-2 sm:my-4 border rounded-2xl overflow-hidden">
      <Link href={`/category/${categorySlug}`} prefetch={false}>
        <div className="relative w-full cursor-pointer">
          <Image
            src={imageSrc}
            alt={categoryName || "Category Banner"}
            width={1200}
            height={0}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
            className="w-full h-auto object-contain"
            priority={priority}
            quality={85}
          />
        </div>
      </Link>
    </div>
  );
};

export default CategoryImageBanner;
