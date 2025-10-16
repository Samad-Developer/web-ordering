import { useMenu } from '@/contexts/MenuContext';
import { useMemo, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoryTab from './CategoryTab';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import { CategoryData, MenuAPIData } from '@/types/category.types';
import { toTitleCase } from '@/lib/string/toTitleCase';

const CategoryBar = () => {
  const { menu } = useMenu();
  const [activeCategory, setActiveCategory] = useState<string>('');
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});

  // Use the custom scroll hook
  const {
    scrollContainerRef,
    showLeftArrow,
    showRightArrow,
    scroll,
    checkScroll
  } = useHorizontalScroll({ scrollAmount: 300, threshold: 10 });

  // Transform menu data to category data
  const categories: CategoryData[] = useMemo(() => {
    if (!menu || !Array.isArray(menu)) return [];

    const menuData = menu as MenuAPIData[];

    return menuData.map((item) => {
      return {
        categoryId: item.Id,
        sortOrder: item.Order,
        categoryName: toTitleCase(item.Name),
        categoryIcon: `/assets/images/category-icons/category-icon.webp`,
        categoryActiveIcon: `/assets/images/category-icons/category-icon.webp`,
      };
    }).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [menu]);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);

    const element = categoryRefs.current[categoryId];
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  };

  if (!categories.length) {
    return (
      <div className="w-full p-4 text-center text-muted-foreground">
        No categories available
      </div>
    );
  }

  return (
    <div className="relative w-full md:max-w-7xl mx-auto py-4 sm:py-6">
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
        className="overflow-x-auto scrollbar-hide px-10 sm:px-12 "
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex items-start gap-1 sm:gap-4 md:gap-4 w-max">
          {categories.map((category) => (
            <CategoryTab
              key={category.categoryId}
              ref={(el) => { categoryRefs.current[category.categoryId] = el; }}
              category={category}
              isActive={activeCategory === category.categoryId}
              onClick={() => handleCategoryClick(category.categoryId)}
              layout="iconic"
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

