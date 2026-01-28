// lib/types/cart.types.ts

import { ProductCustomization, PriceBreakdown } from './customization.types';
import { Discount } from './discount.types';

export interface CartItem {
  // Unique identifier for this cart item
  cartItemId: string;
  
  // Product infos
  productId: number;
  productName: string;
  productImage: string;
  
  // Variation info
  variationId: number;
  sizeName: string;
  flavorName: string;
  
  // Customization
  customization: ProductCustomization;
  
  // Pricing
  priceBreakdown: PriceBreakdown;
  discount: Discount | null;
  
  // Metadata
  specialInstructions?: string;
  addedAt: number; // timestamp
}

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  isCartOpen: boolean;
  lastUpdated: number;
}

export interface CartSummary {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  itemCount: number;
}