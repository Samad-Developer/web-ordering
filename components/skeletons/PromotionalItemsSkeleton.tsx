"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function PromotionalItemsSkeleton() {
  return (
    <div className="my-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            🔥 Featured Items
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Handpicked items we recommend
          </p>
        </div>
      </div>

      {/* Skeleton Carousel */}
      <div className="flex gap-3 overflow-hidden">
        {[1, 2, 3].map((index) => (
          <div key={index} className="w-[170px] flex-shrink-0">
            <PromotionalCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}



export function PromotionalCardSkeleton() {
  return (
    <div className="w-full">
      <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full">
        {/* Badge Skeleton */}
        <div className="absolute top-2 left-2 z-10">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* Image Skeleton */}
        <Skeleton className="h-32 w-full rounded-t-2xl" />

        {/* Content */}
        <div className="p-3 space-y-2">
          {/* Item Name Skeleton */}
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Popular Badge Skeleton */}
          <Skeleton className="h-3 w-16" />

          {/* Price & Add Button */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
            
            {/* Add Button Skeleton */}
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>

          {/* Variations Count Skeleton */}
          <div className="pt-1 border-t border-gray-100">
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}