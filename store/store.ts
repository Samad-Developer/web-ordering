import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productModalReducer from './slices/productModalSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    productModal: productModalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;