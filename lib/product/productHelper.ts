import { Discount } from '@/types/discount.types';
import { calculateDiscount } from '../discount/discountUtils';
import { ProductVariation, ProductItem } from '@/types/product.types';
import { 
  ProductCustomization,       
  PriceBreakdown,
  CustomizationError           
} from '@/types/customization.types';


// ============================================================================
// PRICE CALCULATION
// ============================================================================

export function calculatePrice(
  variation: ProductVariation | null,
  customization: ProductCustomization    
): PriceBreakdown {
  if (!variation) {
    return {
      basePrice: 0,  
      originalBasePrice: 0,           
      addonsTotal: 0,            
      subtotal: 0,
      total: 0,
    };
  }

  const originalBasePrice = variation.Price;
  const priceCalc = calculateDiscount(variation.Price, variation.Discount);
  const basePrice = priceCalc.finalPrice;    

  // Calculate total from all addon upgrades (where price > 0)
  const addonsTotal = Object.values(customization.selectedAddons).reduce( 
    (total, group) => {         
      return total + group.selectedOptions.reduce(
        (groupTotal, option) => groupTotal + (option.price * option.quantity),
        0
      );
    },
    0
  );

  const subtotal = basePrice + addonsTotal;
  const total = subtotal * customization.quantity;

  return {
    basePrice,   
    originalBasePrice,               
    addonsTotal,                 
    subtotal,
    total,
  };
}

// ============================================================================
// VALIDATION
// ============================================================================

// lib/product/productHelper.ts

export function validateCustomization(
  variation: ProductVariation | null,
  customization: ProductCustomization
): { errors: CustomizationError[]; isValid: boolean } {
  const errors: CustomizationError[] = [];

  // Check size selection
  if (!customization.selectedSizeId) {
    errors.push({
      groupId: -1,
      message: 'Please select a size',
    });
    return { errors, isValid: false };
  }

  // Check flavor selection
  if (!customization.selectedFlavorId) {
    errors.push({
      groupId: -2,
      message: 'Please select a flavor',
    });
    return { errors, isValid: false };
  }

  if (!variation) {
    errors.push({
      groupId: -1,
      message: 'Selected combination is not available',
    });
    return { errors, isValid: false };
  }

  // Validate addon groups - ONLY CHECK MaxChoice
  if (variation.ItemChoices) {
    for (const group of variation.ItemChoices) {
      const selectedGroup = customization.selectedAddons[group.Id];
      
      // MaxChoice = 0 → Optional (skip validation)
      if (group.MaxChoice === 0) {
        continue;
      }
      
      // MaxChoice > 0 → Required selection
      if (group.MaxChoice >= 1 && !selectedGroup) {
        errors.push({
          groupId: group.Id,
          message: `Please select ${group.Name}`,
        });
        continue;
      }

      // Count how many DIFFERENT options are selected
      const totalSelectedOptions = selectedGroup.selectedOptions.reduce(
          (total, option) => total + option.quantity, 0
        ) || 0;


      // Validate against MaxChoice
      if (group.MaxChoice == 1 && totalSelectedOptions < 1) {
        errors.push({
          groupId: group.Id,
          message: `Please select at least 1 ${group.Name}`,
        });
      }

       if (totalSelectedOptions < group.MaxChoice) {
        errors.push({
          groupId: group.Id,
          message: `Plz select maximum ${group.MaxChoice} ${group.Name}`,
        });
      }

      if (totalSelectedOptions > group.MaxChoice) {
        errors.push({
          groupId: group.Id,
          message: `You can select maximum ${group.MaxChoice} ${group.Name}`,
        });
      }
    }
  }

  return {
    errors,
    isValid: errors.length === 0,
  };
}
// ============================================================================
// DISPLAY & FORMATTING
// ============================================================================

export function getVariationDisplayName(variation: ProductVariation): string {
  return `${variation.Size.Name} - ${variation.Flavour.Name}`;
}

export function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString()}`;
}

// ============================================================================
// SIZE MANAGEMENT
// ============================================================================

/**
 * Extract unique sizes from all variations
 * Returns array of unique sizes sorted by ID
 */
export function getUniqueSizes(product: ProductItem) {
  const sizesMap = new Map<number, { id: number; name: string; price: number, discount: Discount | null; }>();
  
  product.Variations.forEach(variation => {
    if (!sizesMap.has(variation.Size.Id)) {
      sizesMap.set(variation.Size.Id, {
        id: variation.Size.Id,
        name: variation.Size.Name,
        price: variation.Price,
        discount: variation.Discount
      });
    }
  });
  
  return Array.from(sizesMap.values());
  // .sort((a, b) => a.id - b.id);
}

/**
 * Get default size (first available)
 */
// export function getDefaultSize(product: ProductItem): number | null {
//   if (product.Variations.length === 0) return null;
//   return product.Variations[0].Size.Id;
// }

export function getDefaultSize(product: ProductItem): number | null {
  if (product.Variations.length === 0) return null;
  const sorted = [...product.Variations].sort((a, b) => a.Price - b.Price);
  return sorted[0].Size.Id;
}

// ============================================================================
// FLAVOR MANAGEMENT
// ============================================================================

/**
 * Extract unique flavors from all variations
 * Returns array of unique flavors sorted by ID
 */
export function getUniqueFlavors(product: ProductItem) {
  const flavorsMap = new Map<number, { id: number; name: string }>();
  
  product.Variations.forEach(variation => {
    if (!flavorsMap.has(variation.Flavour.Id)) {
      flavorsMap.set(variation.Flavour.Id, {
        id: variation.Flavour.Id,
        name: variation.Flavour.Name,
      });
    }
  });
  
  return Array.from(flavorsMap.values()).sort((a, b) => a.id - b.id);
}

/**
 * Get default flavor for a specific size
 * Used when size is selected but flavor isn't
 */
export function getDefaultFlavor(product: ProductItem, sizeId: number): number | null {
  const variation = product.Variations.find(v => v.Size.Id === sizeId);
  return variation ? variation.Flavour.Id : null;
}

/**
 * Get available flavors for a specific size
 * Useful for filtering when size is selected first
 */
export function getAvailableFlavorsForSize(
  product: ProductItem,
  sizeId: number
) {
  const flavorsMap = new Map<number, { id: number; name: string }>();
  
  product.Variations
    .filter(v => v.Size.Id === sizeId)
    .forEach(variation => {
      if (!flavorsMap.has(variation.Flavour.Id)) {
        flavorsMap.set(variation.Flavour.Id, {
          id: variation.Flavour.Id,
          name: variation.Flavour.Name,
        });
      }
    });
  
  return Array.from(flavorsMap.values()).sort((a, b) => a.id - b.id);
}

// ============================================================================
// VARIATION LOOKUP
// ============================================================================

/**
 * Find variation by size and flavor combination
 * Returns null if combination doesn't exist
 */
export function findVariationByCombo(
  product: ProductItem,
  sizeId: number | null,
  flavorId: number | null
): ProductVariation | null {
  if (sizeId === null || flavorId === null) return null;
  
  return product.Variations.find(
    v => v.Size.Id === sizeId && v.Flavour.Id === flavorId
  ) || null;
}

/**
 * Check if a size-flavor combination is valid
 */
export function isValidCombo(
  product: ProductItem,
  sizeId: number,
  flavorId: number
): boolean {
  return findVariationByCombo(product, sizeId, flavorId) !== null;
}

// ============================================================================
// PRICE UTILITIES
// ============================================================================

/**
 * Get price range for a product (min to max across all variations)
 */
export function getPriceRange(product: ProductItem): { min: number; max: number } | null {
  if (product.Variations.length === 0) return null;
  
  const prices = product.Variations.map(v => v.Price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

/**
 * Get formatted price range string
 * Example: "Rs. 590 - Rs. 1,790" or "Rs. 590" (if all same price)
 */
export function getFormattedPriceRange(product: ProductItem): string {
  const range = getPriceRange(product);
  if (!range) return 'N/A';
  
  if (range.min === range.max) {
    return formatPrice(range.min);
  }
  
  return `${formatPrice(range.min)} - ${formatPrice(range.max)}`;
}

/**
 * Get price for a specific size-flavor combination
 */
export function getPriceForCombo(
  product: ProductItem,
  sizeId: number,
  flavorId: number
): number | null {
  const variation = findVariationByCombo(product, sizeId, flavorId);
  return variation ? variation.Price : null;
}

// ============================================================================
// AUTO-SELECTION HELPERS
// ============================================================================

/**
 * Get smart default selections for a product
 * Handles single option auto-selection
 */
export function getSmartDefaults(product: ProductItem): {
  sizeId: number | null;
  flavorId: number | null;
  variationId: number | null;
} {
  if (product.Variations.length === 0) {
    return { sizeId: null, flavorId: null, variationId: null };
  }

  // If only one variation, auto-select everything
  if (product.Variations.length === 1) {
    const variation = product.Variations[0];
    return {
      sizeId: variation.Size.Id,
      flavorId: variation.Flavour.Id,
      variationId: variation.Id,
    };
  }

  // Check if all variations have the same size (only flavor varies)
  const uniqueSizes = getUniqueSizes(product);
  if (uniqueSizes.length === 1) {
    const sizeId = uniqueSizes[0].id;
    const flavorId = getDefaultFlavor(product, sizeId);
    const variationId = flavorId ? findVariationByCombo(product, sizeId, flavorId)?.Id || null : null;
    
    return { sizeId, flavorId, variationId };
  }

  // Check if all variations have the same flavor (only size varies)
  const uniqueFlavors = getUniqueFlavors(product);
  if (uniqueFlavors.length === 1) {
    const flavorId = uniqueFlavors[0].id;
    const sizeId = getDefaultSize(product);
    const variationId = sizeId ? findVariationByCombo(product, sizeId, flavorId)?.Id || null : null;
    
    return { sizeId, flavorId, variationId };
  }

  // Multiple sizes and flavors - don't auto-select
  return { sizeId: null, flavorId: null, variationId: null };
}