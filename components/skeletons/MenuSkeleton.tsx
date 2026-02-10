import React from 'react';

// Shimmer Animation Component
const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
);

// Search Box Skeleton
const SearchSkeleton = () => (
  <div className="w-full max-w-2xl mx-auto mb-8 px-4">
    <div className="relative h-12 bg-gray-200 rounded-full overflow-hidden">
      <Shimmer />
    </div>
  </div>
);

// Category Banner Skeleton
const CategoryBannerSkeleton = () => (
  <div className="mb-6 px-4">
    <div className="relative h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl overflow-hidden shadow-lg">
      <Shimmer />
      {/* Category Title Area */}
      {/* <div className="absolute bottom-6 left-6 space-y-3">
        <div className="h-8 w-48 bg-white/30 rounded-lg backdrop-blur-sm" />
        <div className="h-4 w-32 bg-white/20 rounded-md backdrop-blur-sm" />
      </div> */}
    </div>
  </div>
);

// Product Card Skeleton
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden transition-shadow duration-300 border border-gray-100">
    {/* Square Image */}
    <div className="relative aspect-square bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
      <Shimmer />
      {/* Decorative circles for visual interest */}
      {/* <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 rounded-full" />
      <div className="absolute bottom-4 left-4 w-8 h-8 bg-white/20 rounded-full" /> */}
    </div>

    {/* Card Content */}
    <div className="p-4 space-y-3">
      {/* Item Name */}
      <div className="space-y-2">
        <div className="relative h-5 bg-gray-200 rounded-md overflow-hidden w-3/4">
          <Shimmer />
        </div>
        <div className="relative h-4 bg-gray-200 rounded-md overflow-hidden w-1/2">
          <Shimmer />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <div className="relative h-3 bg-gray-100 rounded-md overflow-hidden w-full">
          <Shimmer />
        </div>
        <div className="relative h-3 bg-gray-100 rounded-md overflow-hidden w-5/6">
          <Shimmer />
        </div>
        <div className="relative h-3 bg-gray-100 rounded-md overflow-hidden w-2/3">
          <Shimmer />
        </div>
      </div>

      {/* Price & Button Section */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">


        {/* Add to Cart Button */}
        <div className="relative h-10 w-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg overflow-hidden">
          <Shimmer />
        </div>
      </div>
    </div>
  </div>
);

// Products Grid Skeleton
const ProductsGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-8 px-4 mb-8">
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

// Main Menu Skeleton Component
const MenuSkeleton = () => {
  return (
    <div className="my-10 max-w-7xl mx-auto px-2 sm:px-0 min-h-screen py-8">
      {/* Search Box */}
      <SearchSkeleton />

      {/* First Category Section */}
      <div className="mb-12">
        <CategoryBannerSkeleton />
        <ProductsGridSkeleton count={4} />
      </div>

      {/* Second Category Section */}
      <div className="mb-12">
        <CategoryBannerSkeleton />
        <ProductsGridSkeleton count={6} />
      </div>

      {/* Third Category Section */}
      <div className="mb-12">
        <CategoryBannerSkeleton />
        <ProductsGridSkeleton count={4} />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default MenuSkeleton;