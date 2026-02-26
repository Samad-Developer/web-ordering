import { cva } from "class-variance-authority";

export const categoryTabVariants = cva(
  "flex items-center justify-center font-poppins transition-all duration-200 cursor-pointer select-none rounded-md whitespace-nowrap",
  {
    variants: {
      layout: {
        default: "px-3 py-1 sm:py-2 font-semibold text-[14px] sm:text-[16px]",
        iconic: "flex-col justify-center gap-2 px-3 py-2 text-[13px] sm:text-[15px] text-center font-medium",
      },
      state: {
        default: "bg-transparent text-category-fg hover:bg-category-active hover:text-category-hover",
        active: "bg-category-active text-category-hover",
      },
    },
    defaultVariants: {
      layout: "default",
      state: "default",
    },
  }
);

