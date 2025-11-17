import { ProductCustomization } from "@/types/customization.types";
import { CartItem } from "@/types/cart.types";

/**
 * Compare two customizations to check if they're identical
 * Used to determine if we should increment quantity or add new item
 */
export function areCustomizationsEqual(
  custom1: ProductCustomization,
  custom2: ProductCustomization
): boolean {
  // Check size
  if (custom1.selectedSizeId !== custom2.selectedSizeId) {
    return false;
  }

  // Check flavor
  if (custom1.selectedFlavorId !== custom2.selectedFlavorId) {
    return false;
  }

  // Check special instructions
  const instructions1 = (custom1.specialInstructions || '').trim().toLowerCase();
  const instructions2 = (custom2.specialInstructions || '').trim().toLowerCase();
  if (instructions1 !== instructions2) {
    return false;
  }

  // Check addons
  const addons1 = custom1.selectedAddons;
  const addons2 = custom2.selectedAddons;

  // Get addon group IDs
  const groupIds1 = Object.keys(addons1).sort();
  const groupIds2 = Object.keys(addons2).sort();

  // Different number of addon groups
  if (groupIds1.length !== groupIds2.length) {
    return false;
  }

  // Compare each addon group
  for (let i = 0; i < groupIds1.length; i++) {
    const groupId = groupIds1[i];
    
    if (groupId !== groupIds2[i]) {
      return false;
    }

    const group1 = addons1[Number(groupId)];
    const group2 = addons2[Number(groupId)];

    // Compare selected options in this group
    if (group1.selectedOptions.length !== group2.selectedOptions.length) {
      return false;
    }

    // Sort options by optionId for comparison
    const options1 = [...group1.selectedOptions].sort((a, b) => a.optionId - b.optionId);
    const options2 = [...group2.selectedOptions].sort((a, b) => a.optionId - b.optionId);

    for (let j = 0; j < options1.length; j++) {
      const opt1 = options1[j];
      const opt2 = options2[j];

      if (
        opt1.optionId !== opt2.optionId ||
        opt1.quantity !== opt2.quantity ||
        opt1.price !== opt2.price
      ) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Find matching cart item with same customization
 */
export function findMatchingCartItem(
  cartItems: CartItem[],
  productId: number,
  variationId: number,
  customization: ProductCustomization
): CartItem | undefined {
  return cartItems.find(
    (item) =>
      item.productId === productId &&
      item.variationId === variationId &&
      areCustomizationsEqual(item.customization, customization)
  );
}

/**
 * Generate unique cart item ID
 */
export function generateCartItemId(): string {
  return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}