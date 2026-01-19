// components/category/CategoryTab.tsx

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { CategoryItemProps } from '@/types/category.types';
import { categoryTabVariants } from './category-tab.variants';
import Image from 'next/image';

const CategoryTab = forwardRef<HTMLButtonElement, CategoryItemProps>(
  ({ category, isActive, onClick, layout = 'default' }, ref) => {
    const iconSrc = isActive
      ? category.categoryActiveIcon
      : category.categoryIcon;

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault(); // ✅ Prevent default anchor behavior
      onClick?.();
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          categoryTabVariants({
            layout,
            state: isActive ? 'active' : 'default',
          })
        )}
        aria-current={isActive ? 'true' : 'false'}
      >
        {layout === 'iconic' ? (
          <>
            <div className="relative w-[74px] h-[74px] sm:w-[100px] sm:h-[100px] rounded-full overflow-hidden flex items-center justify-center">
              <Image
                src={iconSrc}
                alt={category.categoryName}
                fill
                sizes="(max-width: 640px) 74px, 100px"
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/assets/images/category-icons/placeholder-category-icon.png';
                }}
              />
            </div>

            <span className="line-clamp-2 px-1 text-center text-wrap w-16 sm:w-24 text-[10px] sm:text-[12px] font-bold">
              {category.categoryName}
            </span>
          </>
        ) : (
          <span>{category.categoryName}</span>
        )}
      </button>
    );
  }
);

CategoryTab.displayName = 'CategoryTab';

export default CategoryTab;