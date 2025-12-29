import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productModalReducer from './slices/productModalSlice'
import addressReducer from './slices/addressSlice'
import themeReducer from './slices/themeSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    address: addressReducer,
    productModal: productModalReducer,
    theme: themeReducer,
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