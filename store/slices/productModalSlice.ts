import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductItem } from '@/types/product.types';

interface ProductModalState {
  isOpen: boolean;
  currentProduct: ProductItem | null;
  productId: number | null;
}

const initialState: ProductModalState = {
  isOpen: false,
  currentProduct: null,
  productId: null,
};

const productModalSlice = createSlice({
  name: 'productModal',
  initialState,
  reducers: {
    openProductModal: (state, action: PayloadAction<ProductItem>) => {
      state.isOpen = true;
      state.currentProduct = action.payload;
      state.productId = action.payload.Id;
    },
    
    closeProductModal: (state) => {
      state.isOpen = false;
      // Keep product data for exit animation
      // Clear after delay in component
    },
    
    clearProductData: (state) => {
      state.currentProduct = null;
      state.productId = null;
    },

    // For URL-based loading
    // i have to add (, action: PayloadAction<ProductItem>) into props after real api call start
    // nad i have to add       state.currentProduct = action.payload; state.productId = action.payload.Id; to body of this function
    setProductFromUrl: (state) => {
      state.isOpen = true;
    },
  },
});

export const { 
  openProductModal, 
  closeProductModal, 
  clearProductData,
  setProductFromUrl 
} = productModalSlice.actions;

export default productModalSlice.reducer;

// Selectors
export const selectProductModal = (state: { productModal: ProductModalState }) => state.productModal;
export const selectCurrentProduct = (state: { productModal: ProductModalState }) => state.productModal.currentProduct;
export const selectIsModalOpen = (state: { productModal: ProductModalState }) => state.productModal.isOpen;