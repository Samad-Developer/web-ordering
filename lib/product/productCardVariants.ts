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
        "horizontal-left": "w-2/5 aspect-square rounded-xl",
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
        "horizontal-left": "text-sm sm:text-base line-clamp-1",
        "horizontal-right": "text-sm sm:text-base line-clamp-1",
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
        "horizontal-left": "text-xs line-clamp-2",
        "horizontal-right": "text-xs line-clamp-2",
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
// CART ACTION SECTION VARIANTS (wrapper for AddToCart / QuantityCounter)
// ============================================
export const cartActionVariants = cva(
  "flex",
  {
    variants: {
      layout: {
        vertical: "w-full",
        "horizontal-left": "w-full justify-end",
        "horizontal-right": "w-full justify-end",
      },
    },
    defaultVariants: {
      layout: "vertical",
    },
  }
);

// ============================================
// ADD TO CART BUTTON VARIANTS
// ============================================
export const addToCartButtonVariants = cva(
  `cursor-pointer font-semibold rounded-lg transition-all duration-200
   disabled:opacity-50 disabled:cursor-not-allowed
   flex items-center justify-center gap-2
   focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
   shadow-md hover:shadow-lg active:shadow-sm
   bg-popup-cart-bg text-popup-cart-fg`,
  {
    variants: {
      layout: {
        vertical: "w-full py-2 px-2 text-base",
        "horizontal-left": "w-auto p-1.5",
        "horizontal-right": "w-auto p-1.5",
      },
    },
    defaultVariants: {
      layout: "vertical",
    },
  }
);

// ============================================
// QUANTITY COUNTER VARIANTS
// ============================================
export const quantityCounterVariants = cva(
  "flex gap-2 items-stretch border rounded-lg overflow-hidden",
  {
    variants: {
      layout: {
        vertical: "w-full",
        "horizontal-left": "w-auto",
        "horizontal-right": "w-auto",
      },
    },
    defaultVariants: {
      layout: "vertical",
    },
  }
);


// ============================================
// CVA for grid variants
// ============================================
export const gridVariants = cva("grid mt-4", {
  variants: {
    layout: {
      vertical: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-6",
      "horizontal-left": "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-6",
      "horizontal-right": "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-6",
    },
  },
  defaultVariants: {
    layout: "vertical",
  },
});

// ============================================
// LAYOUT CONTEXT TYPE
// ============================================
export type ProductCardLayout = "vertical" | "horizontal-left" | "horizontal-right";

export type ProductCardVariants = VariantProps<typeof productCardVariants>;