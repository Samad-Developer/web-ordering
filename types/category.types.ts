import { type VariantProps } from 'class-variance-authority';
import { categoryTabVariants } from '@/components/menu/partials/category-bar/category-tab.variants';

export interface CategoryData {
  categoryId: string;
  sortOrder: number;
  categoryName: string;
  categoryIcon: string;
  categoryActiveIcon: string;
}

export interface CategoryItemProps extends VariantProps<typeof categoryTabVariants> {
  category: CategoryData;
  isActive: boolean;
  onClick: () => void;
  layout?: 'default' | 'iconic';
  ref?: React.Ref<HTMLAnchorElement>;
}

export interface MenuAPIData {
  Order: number;
  Id: string;
  Name: string;
  Image?: string;
  Items?: any[];
}

export interface ScrollArrowsState {
  showLeftArrow: boolean;
  showRightArrow: boolean;
}