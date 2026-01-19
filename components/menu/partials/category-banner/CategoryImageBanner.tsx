"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { toSlug } from "@/lib/address/slug";
import { useParams } from "next/navigation";
import { getImageUrl } from "@/lib/image/imageUtils";
import { CategoryInfo } from "@/types/menu.types";

interface CategoryBannerProps {
  categoryInfo: CategoryInfo;
}

const CategoryImageBanner: React.FC<CategoryBannerProps> = ({
  categoryInfo,
}) => {
  const { locale } = useParams();

  const imageSrc = getImageUrl(categoryInfo.Image, '/assets/images/banner/category-banner/new-arrivals.webp');

  const categorySlug = toSlug(categoryInfo.Image);

  return (
    <section id={categoryInfo.Id} className="text-center my-2 sm:my-4 rounded-2xl overflow-hidden">
      <Link href={`/${locale}/category/${categorySlug}`} prefetch={false}>
        <div className="relative w-full cursor-pointer">
          <Image
            src={imageSrc}
            alt={categoryInfo.Name || "Category Banner"}
            width={1200}
            height={0}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
            className="w-full h-auto object-contain"
            priority={true}
            quality={85}
          />
        </div>
      </Link>
    </section>
  );
};

export default CategoryImageBanner;
