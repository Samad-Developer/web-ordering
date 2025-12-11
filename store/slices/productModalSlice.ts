import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductItem } from '@/types/product.types';

interface ProductModalState {
  isOpen: boolean;
  currentProduct: ProductItem | null;
  productId: number | null;
  openedFromUrl: boolean;
}

const initialState: ProductModalState = {
  isOpen: false,
  currentProduct: null,
  productId: null,
  openedFromUrl: false,
};

const productModalSlice = createSlice({
  name: 'productModal',
  initialState,
  reducers: {
    openProductModal: (state, action: PayloadAction<ProductItem>) => {
      state.isOpen = true;
      state.currentProduct = action.payload;
      state.productId = action.payload.Id;
      state.openedFromUrl = false;
    },
    closeProductModal: (state) => {
      state.isOpen = false;
      state.currentProduct = null;
      state.productId = null;
    },
    setProductFromUrl: (state, action: PayloadAction<ProductItem>) => {
      state.isOpen = true;
      state.currentProduct = action.payload;
      state.productId = action.payload.Id;
      state.openedFromUrl = true;
    },
  },
});

export const {
  openProductModal,
  closeProductModal,
  setProductFromUrl
} = productModalSlice.actions;

export default productModalSlice.reducer;

// Selectors
export const selectProductModal = (state: { productModal: ProductModalState }) => state.productModal;
export const selectCurrentProduct = (state: { productModal: ProductModalState }) => state.productModal.currentProduct;
export const selectIsModalOpen = (state: { productModal: ProductModalState }) => state.productModal.isOpen;
export const selectOpenedFromUrl = (state: { productModal: ProductModalState }) => state.productModal.openedFromUrl;
