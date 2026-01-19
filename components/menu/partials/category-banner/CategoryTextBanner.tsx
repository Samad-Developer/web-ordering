import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toSlug } from "@/lib/address/slug";
import { CategoryInfo } from "@/types/menu.types";

interface CategoryTextBannerProps {
  categoryInfo: CategoryInfo;
  alignment?: "left" | "center" | "right";
}

const CategoryTextBanner: React.FC<CategoryTextBannerProps> = ({
  categoryInfo,
  alignment = "center",
}) => {
  const { locale } = useParams();
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const categorySlug = toSlug(categoryInfo.Name);

  return (
    <section
      id={categoryInfo.Id}
      className={`${alignmentClasses[alignment]} my-2 sm:my-4 py-10 sm:py-10 md:py-12 lg:py-16 border bg-red-500 rounded-2xl px-4 sm:px-6 md:px-8 `}
    >
      <Link href={`/${locale}/category/${categorySlug}`}>
        <h2 className="text-2xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight cursor-pointer">
          {categoryInfo.Name}
        </h2>
      </Link>
      {/* <p className="text-white/90 mt-2 sm:mt-4 md:mt-5 text-base sm:text-lg md:text-xl lg:text-2xl">
        Discover our delicious {categoryName.toLowerCase()} selection
      </p> */}
    </section>
  );
};

export default CategoryTextBanner;
