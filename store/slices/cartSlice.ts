import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '@/types/product.types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          item.size === action.payload.size
      );

      if (existingItemIndex > -1) {
        state.items[existingItemIndex].quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: number; size: string; quantity: number }>
    ) => {
      const { productId, size, quantity } = action.payload;
      
      if (quantity <= 0) {
        state.items = state.items.filter(
          (item) => !(item.productId === productId && item.size === size)
        );
      } else {
        const itemIndex = state.items.findIndex(
          (item) => item.productId === productId && item.size === size
        );
        
        if (itemIndex > -1) {
          state.items[itemIndex].quantity = quantity;
        }
      }
    },
    
    removeItem: (
      state,
      action: PayloadAction<{ productId: number; size: string }>
    ) => {
      const { productId, size } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.productId === productId && item.size === size)
      );
    },
    
    clearCart: (state) => {
      state.items = [];
    },
    
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const {
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  toggleCart,
  setCartOpen,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartIsOpen = (state: { cart: CartState }) => state.cart.isOpen;
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectCartItemsCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectCartItemQuantity = (
  state: { cart: CartState },
  productId: number,
  size: string
) =>
  state.cart.items.find(
    (item) => item.productId === productId && item.size === size
  )?.quantity || 0;

export default cartSlice.reducer;