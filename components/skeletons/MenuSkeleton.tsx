import React from 'react';

// Shimmer Animation Component
const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
);

// Top Banner Skeleton
const BannerSkeleton = () => (
  <div className="relative w-full p-2 sm:p-10">
    {/* Slider Skeleton */}
    <div className="w-full h-[20vh] sm:h-[30vh] lg:h-[50vh] bg-gray-200 rounded-xl overflow-hidden animate-pulse flex items-center justify-center">
      {/* Mountain & sun placeholder */}
      <svg
        className="w-12 h-12 sm:w-20 sm:h-20 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" ry="2" strokeWidth={2} />
        <circle cx="8" cy="8" r="2" strokeWidth={2} />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 20l-5-7-4 5-3-4-4 6"
        />
      </svg>
    </div>

    {/* Left Arrow */}
    <div className="absolute left-4 sm:left-16 top-1/2 transform -translate-y-1/2 bg-gray-300 rounded-full w-6 sm:w-10 h-6 sm:h-10 flex items-center justify-center cursor-pointer">
      <svg
        className="w-4 sm:w-6 h-4 sm:h-6 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </div>

    {/* Right Arrow */}
    <div className="absolute right-4 sm:right-16 top-1/2 transform -translate-y-1/2 bg-gray-300 rounded-full w-6 sm:w-10 h-6 sm:h-10 flex items-center justify-center cursor-pointer">
      <svg
        className="w-4 sm:w-6 h-4 sm:h-6 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
);

// Category Navigation Skeleton
const CategoryNavSkeleton = () => {
  const categories = Array.from({ length: 10 }); // Simulate many categories

  return (
    <div className="bg-gray-100 shadow-sm sticky top-0 z-10">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-center justify-center gap-3 px-2 py-3 min-w-max">
          {categories.map((_, index) => (
            <div
              key={index}
              className="relative px-4 py-2 bg-gray-200 rounded-md overflow-hidden whitespace-nowrap"
              style={{ minWidth: index % 3 === 0 ? '100px' : index % 2 === 0 ? '120px' : '90px' }}
            >
              <Shimmer />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Search Box Skeleton
const SearchSkeleton = () => (
  <div className="bg-white py-6 px-4">
    <div className="max-w-3xl mx-auto">
      <div className="relative h-12 bg-gray-100 rounded-full overflow-hidden border border-gray-200 flex items-center px-4 gap-3">
        {/* Search Icon */}
        <div className="relative w-5 h-5 bg-gray-300 rounded-full overflow-hidden flex-shrink-0">
          <Shimmer />
        </div>
        {/* Search Text */}
        <div className="relative h-4 flex-1 bg-gray-200 rounded overflow-hidden">
          <Shimmer />
        </div>
      </div>
    </div>
  </div>
);

// Category Banner Skeleton
const CategoryBannerSkeleton = () => (
  <div className="mb-6 px-4">
    <div className="relative h-36 md:h-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl overflow-hidden shadow-lg">
      <Shimmer />
    </div>
  </div>
);

// Product Card Skeleton
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm sm:shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden transition-shadow duration-300 border border-gray-100">
    {/* Square Image */}
    <div className="relative aspect-square bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
      <Shimmer />
    </div>

    {/* Card Content */}
    <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
      {/* Item Name */}
      <div className="space-y-1.5 sm:space-y-2">
        <div className="relative h-4 sm:h-5 bg-gray-200 rounded-md overflow-hidden w-3/4">
          <Shimmer />
        </div>
        <div className="relative h-3 sm:h-4 bg-gray-200 rounded-md overflow-hidden w-1/2">
          <Shimmer />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5 sm:space-y-2">
        <div className="relative h-2.5 sm:h-3 bg-gray-100 rounded-md overflow-hidden w-full">
          <Shimmer />
        </div>
        <div className="relative h-2.5 sm:h-3 bg-gray-100 rounded-md overflow-hidden w-5/6">
          <Shimmer />
        </div>
        <div className="relative h-2.5 sm:h-3 bg-gray-100 rounded-md overflow-hidden w-2/3 hidden sm:block">
          <Shimmer />
        </div>
      </div>

      {/* Price & Button Section */}
      <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100">
        {/* Add to Cart Button */}
        <div className="relative h-9 sm:h-10 w-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg overflow-hidden">
          <Shimmer />
        </div>
      </div>
    </div>
  </div>
);

// Products Grid Skeleton
const ProductsGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 px-4 mb-8">
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

// Main Complete Menu Skeleton Component
const CompleteMenuSkeleton = () => {
  return (
    <div className="min-h-screen">
      {/* Top Banner */}
      <BannerSkeleton />

      {/* Category Navigation Bar */}
      <CategoryNavSkeleton />

      {/* Search Box */}
      <SearchSkeleton />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto pb-8">
        {/* First Category Section */}
        <div className="mb-8 sm:mb-12">
          <CategoryBannerSkeleton />
          <ProductsGridSkeleton count={4} />
        </div>

        {/* Second Category Section */}
        <div className="mb-8 sm:mb-12">
          <CategoryBannerSkeleton />
          <ProductsGridSkeleton count={6} />
        </div>

        {/* Third Category Section */}
        <div className="mb-8 sm:mb-12">
          <CategoryBannerSkeleton />
          <ProductsGridSkeleton count={4} />
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        
        /* Hide scrollbar for category nav */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CompleteMenuSkeleton;