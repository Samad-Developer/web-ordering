import { CartItem, CartSummary } from "@/types/cart.types";

/**
 * Calculate cart summary
 */
export function calculateCartSummary(items: CartItem[]): CartSummary {
  const TAX_RATE = 0.16; // 16% GST (change as needed)

  // Subtotal (total of item prices)
  const subtotal = items.reduce(
    (sum, item) => sum + item.priceBreakdown.total,
    0
  );

  // tax
  const rawTax = subtotal * TAX_RATE;
  const tax = Math.round(rawTax);

  // Delivery fee logic (customize as needed)
  const deliveryFee = subtotal > 0 ? 100 : 0; // Rs. 100 flat rate

  // Grand total
  const total = subtotal + tax + deliveryFee;

  // Item count
  const itemCount = items.reduce(
    (sum, item) => sum + item.customization.quantity,
    0
  );

  return {
    subtotal,
    tax,
    deliveryFee,
    total,
    itemCount,
  };
}

/**
 * Format cart item display name
 */
export function getCartItemDisplayName(item: CartItem): string {
  return `${item.productName} (${item.sizeName} - ${item.flavorName})`;
}

/**
 * Format cart item addons for display
 */
export function getCartItemAddonsText(item: CartItem): string[] {
  const addons: string[] = [];

  Object.values(item.customization.selectedAddons).forEach((group) => {
    group.selectedOptions.forEach((option) => {
      const text = option.quantity > 1 ? `${option.optionName} (×${option.quantity})` : option.optionName;
      addons.push(text);
    });
  });

  return addons;
}

/**
 * Save cart to localStorage
 */
export function saveCartToLocalStorage(items: CartItem[]): void {
  try {
    localStorage.setItem('cart', JSON.stringify(items));
    localStorage.setItem('cart_updated', Date.now().toString());
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
}

/**
 * Load cart from localStorage
 */
export function loadCartFromLocalStorage(): CartItem[] {
  try {
    const savedCart = localStorage.getItem('cart');
    if (!savedCart) return [];
    
    const items = JSON.parse(savedCart) as CartItem[];
    
    // Validate and filter out invalid items
    return items.filter((item) => 
      item.cartItemId && 
      item.productId && 
      item.variationId &&
      item.customization &&
      item.priceBreakdown
    );
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return [];
  }
}

/**
 * Clear cart from localStorage
 */
export function clearCartFromLocalStorage(): void {
  try {
    localStorage.removeItem('cart');
    localStorage.removeItem('cart_updated');
    localStorage.removeItem("orderCustomerInfo");
  } catch (error) {
    console.error('Failed to clear cart from localStorage:', error);
  }
}

/**
 * Get total quantity of a product across all variations
 */
export function getProductTotalQuantity(
  cartItems: CartItem[],
  productId: number
): number {
  return cartItems
    .filter((item) => item.productId === productId)
    .reduce((sum, item) => sum + item.customization.quantity, 0);
}

/**
 * Get all cart items for a specific product
 */
export function getProductCartItems(
  cartItems: CartItem[],
  productId: number
): CartItem[] {
  return cartItems.filter((item) => item.productId === productId);
}

/**
 * Check if product has multiple variations in cart
 */
export function hasMultipleVariations(
  cartItems: CartItem[],
  productId: number
): boolean {
  const productItems = getProductCartItems(cartItems, productId);
  return productItems.length > 1;
}

/**
 * this function is for checking hypens if a string contains only hypen it will
 * return nothing other wise that string will be retunred
 */
export function normalizeLabel(
  value?: string | null
): string | null {
  if (!value) return null;

  const trimmed = value.trim();

  if (trimmed === "-") return null;

  return value;
}

/**
 * Get the most recently added item for a product
 */
export function getLastAddedItem(
  cartItems: CartItem[],
  productId: number
): CartItem | null {
  const productItems = cartItems
    .filter((item) => item.productId === productId)
    .sort((a, b) => b.addedAt - a.addedAt); // Sort by most recent first

  return productItems[0] || null;
}

/**
 * Check if product has customizations (addons or special instructions)
 */
export function hasCustomizations(item: CartItem): boolean {
  const hasAddons = Object.keys(item.customization.selectedAddons).length > 0;
  const hasInstructions = !!item.specialInstructions && item.specialInstructions.trim() !== '';
  return hasAddons || hasInstructions;
}