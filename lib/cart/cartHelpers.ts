import { CartItem, CartSummary } from "@/types/cart.types";

/**
 * Calculate cart summary
 */
export function calculateCartSummary(items: CartItem[]): CartSummary {
  const subtotal = items.reduce((sum, item) => sum + item.priceBreakdown.total, 0);
  
  // Delivery fee logic (customize as needed)
  const deliveryFee = subtotal > 0 ? 100 : 0; // Rs. 100 flat rate
  
  const total = subtotal + deliveryFee;
  
  const itemCount = items.reduce((sum, item) => sum + item.customization.quantity, 0);

  return {
    subtotal,
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
      const text = option.quantity > 1 
        ? `${option.optionName} (×${option.quantity})`
        : option.optionName;
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
  } catch (error) {
    console.error('Failed to clear cart from localStorage:', error);
  }
}