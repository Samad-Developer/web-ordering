import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartState } from '@/types/cart.types';
import { 
  generateCartItemId, 
  findMatchingCartItem, 
  areCustomizationsEqual 
} from '@/lib/cart/cartComparison';
import {
  saveCartToLocalStorage,
  loadCartFromLocalStorage,
  clearCartFromLocalStorage,
} from '@/lib/cart/cartHelpers';
import { PriceBreakdown, ProductCustomization } from '@/types/customization.types';

const initialState: CartState = {
  items: [],
  isLoading: false,
  lastUpdated: Date.now(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Initialize cart from localStorage
    initializeCart: (state) => {
      const savedItems = loadCartFromLocalStorage();
      state.items = savedItems;
      state.lastUpdated = Date.now();
    },

    // Add item to cart or increment if exists
    addToCart: (
      state,
      action: PayloadAction<{
        productId: number;
        productName: string;
        productImage: string;
        variationId: number;
        sizeName: string;
        flavorName: string;
        customization: ProductCustomization;
        priceBreakdown: PriceBreakdown;
        specialInstructions?: string;
      }>
    ) => {
      const {
        productId,
        productName,
        productImage,
        variationId,
        sizeName,
        flavorName,
        customization,
        priceBreakdown,
        specialInstructions,
      } = action.payload;

      // Check if exact same item exists
      const existingItem = findMatchingCartItem(
        state.items,
        productId,
        variationId,
        customization
      );

      if (existingItem) {
        // Increment quantity of existing item
        existingItem.customization.quantity += customization.quantity;
        
        // Recalculate price
        existingItem.priceBreakdown.total = existingItem.priceBreakdown.subtotal * existingItem.customization.quantity;
      } else {
        // Add new item
        const newItem: CartItem = {
          cartItemId: generateCartItemId(),
          productId,
          productName,
          productImage,
          variationId,
          sizeName,
          flavorName,
          customization,
          priceBreakdown,
          specialInstructions,
          addedAt: Date.now(),
        };

        state.items.push(newItem);
      }

      state.lastUpdated = Date.now();
      saveCartToLocalStorage(state.items);
    },

    // Increment item quantity
    incrementItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.cartItemId === action.payload);
      
      if (item) {
        item.customization.quantity += 1;
        item.priceBreakdown.total = 
          item.priceBreakdown.subtotal * item.customization.quantity;
        
        state.lastUpdated = Date.now();
        saveCartToLocalStorage(state.items);
      }
    },

    // Decrement item quantity
    decrementItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.cartItemId === action.payload);
      
      if (item) {
        if (item.customization.quantity > 1) {
          item.customization.quantity -= 1;
          item.priceBreakdown.total = 
            item.priceBreakdown.subtotal * item.customization.quantity;
        } else {
          // Remove item if quantity becomes 0
          state.items = state.items.filter((i) => i.cartItemId !== action.payload);
        }
        
        state.lastUpdated = Date.now();
        saveCartToLocalStorage(state.items);
      }
    },

    // Remove item from cart
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.cartItemId !== action.payload);
      state.lastUpdated = Date.now();
      saveCartToLocalStorage(state.items);
    },

    // Update item quantity directly
    updateItemQuantity: (
      state,
      action: PayloadAction<{ cartItemId: string; quantity: number }>
    ) => {
      const { cartItemId, quantity } = action.payload;
      const item = state.items.find((i) => i.cartItemId === cartItemId);
      
      if (item) {
        if (quantity > 0) {
          item.customization.quantity = quantity;
          item.priceBreakdown.total = 
            item.priceBreakdown.subtotal * item.customization.quantity;
        } else {
          // Remove if quantity is 0
          state.items = state.items.filter((i) => i.cartItemId !== cartItemId);
        }
        
        state.lastUpdated = Date.now();
        saveCartToLocalStorage(state.items);
      }
    },

    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
      state.lastUpdated = Date.now();
      clearCartFromLocalStorage();
    },
  },
});

export const {
  initializeCart,
  addToCart,
  incrementItem,
  decrementItem,
  removeItem,
  updateItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartItemCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.customization.quantity, 0);
export const selectCartSubtotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.priceBreakdown.total, 0);