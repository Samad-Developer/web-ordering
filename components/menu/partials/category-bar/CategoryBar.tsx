'use client';

import { useMenu } from '@/hooks/useMenu';
import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoryTab from './CategoryTab';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import { CategoryData, MenuAPIData } from '@/types/category.types';
import { toTitleCase } from '@/lib/string/toTitleCase';

const CategoryBar = () => {
  const { menuData } = useMenu();
  const [activeCategory, setActiveCategory] = useState<string>('');
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});
  const isClickScrolling = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    scrollContainerRef,
    showLeftArrow,
    showRightArrow,
    scroll,
    checkScroll
  } = useHorizontalScroll({ scrollAmount: 300, threshold: 10 });

  // Transform menu data to category data
  const categories: CategoryData[] = useMemo(() => {
    if (!menuData || !Array.isArray(menuData)) return [];

    const menuDataResponse = menuData as MenuAPIData[];

    return menuDataResponse.map((item) => ({
      categoryId: item.Id,
      sortOrder: item.Order,
      categoryName: toTitleCase(item.Name),
      categoryIcon: `/assets/images/category-icons/category-icon.webp`,
      categoryActiveIcon: `/assets/images/category-icons/category-icon.webp`,
    })).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [menuData]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50% 0px', // Simple: trigger when category is in top half
      threshold: 0.1,
    };
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isClickScrolling.current) {
        return;
      }

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const categoryId = entry.target.id;
          setActiveCategory(categoryId);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Wait for DOM
    setTimeout(() => {
      categories.forEach((category) => {
        const element = document.getElementById(category.categoryId);
        if (element) {
          observer.observe(element);
        }
      });
    }, 200);

    return () => {
      observer.disconnect();
    };
  }, [categories]);


  const handleCategoryClick = useCallback((categoryId: string) => {
    // Mark that user clicked (prevent auto-activation during scroll)
    isClickScrolling.current = true;
    setActiveCategory(categoryId);

    // Scroll to category section
    const element = document.getElementById(categoryId);
    if (element) {
      const yOffset = -100; // Offset for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: 'smooth',
      });
    }

    // Scroll category tab into view
    const tabElement = categoryRefs.current[categoryId];
    if (tabElement) {
      tabElement.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }

    // ✅ Re-enable auto-activation after scroll completes
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 1000); // Wait 1 second after scroll starts

  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  if (!categories.length) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 w-full py-2 shadow-lg bg-category-bg text-category-fg">
      {/* Left Arrow */}
      {showLeftArrow && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll('left')}
          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full hover:bg-gray-50 h-8 w-8 sm:h-10 sm:w-10"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700" />
        </Button>
      )}

      {/* Categories Container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="overflow-x-auto scrollbar-hide px-2 sm:px-12"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div
          className={`flex items-center gap-1 sm:gap-4 md:gap-4 justify-start 
          ${categories.length <= 10 ? 'sm:justify-center' : ''
            }`}
        >
          {categories.map((category) => (
            <CategoryTab
              key={category.categoryId}
              ref={(el) => { categoryRefs.current[category.categoryId] = el; }}
              category={category}
              isActive={activeCategory === category.categoryId}
              onClick={() => handleCategoryClick(category.categoryId)}
              layout="default"
            />
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll('right')}
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full hover:bg-gray-50 h-8 w-8 sm:h-10 sm:w-10"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700" />
        </Button>
      )}
    </div>
  );
};

export default CategoryBar;