import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productModalReducer from './slices/productModalSlice'
import addressReducer from './slices/addressSlice'
import authReducer from './slices/authSlice'
import menuReducer from './slices/menuSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    address: addressReducer,
    productModal: productModalReducer,
    auth: authReducer,
    menu: menuReducer,
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