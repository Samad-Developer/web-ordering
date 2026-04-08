import { cva, type VariantProps } from "class-variance-authority";

// ============================================
// PRODUCT CARD CONTAINER VARIANTS
// ============================================
export const productCardVariants = cva(
  // Base styles (applied to ALL layouts)
  `
    relative bg-product-bg hover:bg-product-hover rounded-2xl 
    shadow-[0_4px_20px_rgba(0,0,0,0.08)] 
    hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] 
    overflow-hidden transition-all duration-300 
    transform hover:-translate-y-1
  `,
  {
    variants: {
      layout: {
        vertical: "flex flex-col",
        "horizontal-left": "p-1 flex flex-row items-stretch",
        "horizontal-right": "flex flex-row-reverse items-stretch",
      },
      clickable: {
        true: "cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      layout: "vertical",
      clickable: true,
    },
  }
);

// ============================================
// PRODUCT IMAGE VARIANTS
// ============================================
export const productImageVariants = cva(
  "relative overflow-hidden bg-gray-100 object-cover",
  {
    variants: {
      layout: {
        vertical: "w-full aspect-square rounded-t-2xl",
        "horizontal-left": "w-2/4 aspect-square rounded-l-xl",
        "horizontal-right": "w-1/3 aspect-square rounded-r-2xl",
      },
    },
    defaultVariants: {
      layout: "vertical",
    },
  }
);

// ============================================
// CONTENT SECTION VARIANTS
// ============================================
export const contentSectionVariants = cva(
  "space-y-4",
  {
    variants: {
      layout: {
        vertical: "p-3 sm:p-5",
        "horizontal-left": "flex-1 px-3 py-2 flex flex-col justify-between",
        "horizontal-right": "flex-1 p-4 flex flex-col justify-between",
      },
    },
    defaultVariants: {
      layout: "vertical",
    },
  }
);

// ============================================
// PRODUCT HEADER VARIANTS
// ============================================
export const productHeaderVariants = cva(
  "space-y-2",
  {
    variants: {
      layout: {
        vertical: "mb-2",
        "horizontal-left": "mb-1",
        "horizontal-right": "mb-1",
      },
    },
    defaultVariants: {
      layout: "vertical",
    },
  }
);

export const productNameVariants = cva(
  "font-bold text-product-name leading-tight",
  {
    variants: {
      layout: {
        vertical: "text-base sm:text-lg line-clamp-1",
        "horizontal-left": "text-sm sm:text-base line-clamp-2",
        "horizontal-right": "text-sm sm:text-base line-clamp-2",
      },
    },
    defaultVariants: {
      layout: "vertical",
    },
  }
);

export const productDescriptionVariants = cva(
  "text-muted-foreground",
  {
    variants: {
      layout: {
        vertical: "text-sm line-clamp-2 min-h-10",
        "horizontal-left": "text-xs line-clamp-1",
        "horizontal-right": "text-xs line-clamp-1",
      },
    },
    defaultVariants: {
      layout: "vertical",
    },
  }
);

// ============================================
// PRICE DISPLAY VARIANTS
// ============================================
export const priceContainerVariants = cva(
  "flex items-baseline gap-2",
  {
    variants: {
      layout: {
        vertical: "justify-start",
        "horizontal-left": "justify-start",
        "horizontal-right": "justify-start",
      },
    },
    defaultVariants: {
      layout: "vertical",
    },
  }
);

export const priceFinalVariants = cva(
  "font-bold text-primary",
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-base sm:text-lg",
        lg: "text-lg sm:text-xl",
      },
      layout: {
        vertical: "",
        "horizontal-left": "mb-0",
        "horizontal-right": "",
      },
    },
    defaultVariants: {
      size: "md",
      layout: "vertical",
    },
  }
);

// ============================================
// DISCOUNT BADGE VARIANTS
// ============================================
export const discountBadgePositionVariants = cva(
  "absolute z-10",
  {
    variants: {
      layout: {
        vertical: "top-2 left-2",
        "horizontal-left": "top-2 left-2",
        "horizontal-right": "top-2 right-2",
      },
    },
    defaultVariants: {
      layout: "vertical",
    },
  }
);

// ============================================
// LAYOUT CONTEXT TYPE
// ============================================
export type ProductCardLayout = "vertical" | "horizontal-left" | "horizontal-right";

export type ProductCardVariants = VariantProps<typeof productCardVariants>;