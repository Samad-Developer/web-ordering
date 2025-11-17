import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productModalReducer from './slices/productModalSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    productModal: productModalReducer,
  },
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['cart/initializeCart'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;