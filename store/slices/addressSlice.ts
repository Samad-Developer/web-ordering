import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  UserAddress,
  OrderMode,
  AvailableModes,
  OrderModesResponse
} from '@/types/address.types';

interface AddressState {
  // User's selected address
  currentAddress: UserAddress | null;

  // API Data
  orderModesData: OrderModesResponse | null;
  availableModes: AvailableModes;

  // UI State
  isModalOpen: boolean;
  isLoadingLocation: boolean;
  isLoadingData: boolean;
}

const initialState: AddressState = {
  currentAddress: null,
  orderModesData: null,
  availableModes: {
    delivery: false,
    pickup: false,
  },
  isModalOpen: false,
  isLoadingLocation: false,
  isLoadingData: false,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    // Set Order Modes Data (from API)
    setOrderModesData: (state, action: PayloadAction<OrderModesResponse>) => {
      state.orderModesData = action.payload;

      // Update available modes
      const hasDelivery = !!action.payload.orderModes.delivery && Object.keys(action.payload.orderModes.delivery).length > 0;
      const hasPickup = !!action.payload.orderModes.pickup && Object.keys(action.payload.orderModes.pickup).length > 0;

      state.availableModes = {
        delivery: hasDelivery,
        pickup: hasPickup,
      };
    },

    // Open/Close Modal
    openAddressModal: (state) => {
      state.isModalOpen = true;
    },

    closeAddressModal: (state) => {
      state.isModalOpen = false;
    },

    // Set Order Mode
    setOrderMode: (state, action: PayloadAction<OrderMode>) => {
      if (state.currentAddress) {
        state.currentAddress.orderMode = action.payload;

        // Clear opposite mode data
        if (action.payload === 'delivery') {
          state.currentAddress.branchId = undefined;
          state.currentAddress.branchName = undefined;
          state.currentAddress.branchAddress = undefined;
          state.currentAddress.branchPhoneNumber = undefined;
        } else {
          state.currentAddress.areaId = undefined;
          state.currentAddress.areaName = undefined;
          state.currentAddress.fullAddress = undefined;
        }
      } else {
        state.currentAddress = {
          orderMode: action.payload,
          isCurrentLocation: false,
          lastUpdated: Date.now(),
        };
      }
    },

    // Set Delivery Address
    setDeliveryAddress: (
      state,
      action: PayloadAction<{
        cityId: string;
        cityName: string;
        areaId: number;
        areaName: string;
        fullAddress?: string;
        coordinates?: { lat: number; lng: number };
        isCurrentLocation?: boolean;
      }>
    ) => {
      state.currentAddress = {
        orderMode: 'delivery',
        cityId: action.payload.cityId,
        cityName: action.payload.cityName,
        areaId: action.payload.areaId,
        areaName: action.payload.areaName,
        fullAddress: action.payload.fullAddress,
        coordinates: action.payload.coordinates,
        isCurrentLocation: action.payload.isCurrentLocation || false,
        lastUpdated: Date.now(),
      };
    },

    // Set Pickup Branch
    setPickupBranch: (
      state,
      action: PayloadAction<{
        cityId: string;
        cityName: string;
        branchId: number;
        branchName: string;
        branchAddress: string;
        branchPhoneNumber: string;
      }>
    ) => {
      state.currentAddress = {
        orderMode: 'pickup',
        cityId: action.payload.cityId,
        cityName: action.payload.cityName,
        branchId: action.payload.branchId,
        branchName: action.payload.branchName,
        branchAddress: action.payload.branchAddress,
        branchPhoneNumber: action.payload.branchPhoneNumber,
        isCurrentLocation: false,
        lastUpdated: Date.now(),
      };
    },

    // Update City (intermediate selection)
    updateSelectedCity: (
      state,
      action: PayloadAction<{ cityId: string; cityName: string }>
    ) => {
      if (state.currentAddress) {
        state.currentAddress.cityId = action.payload.cityId;
        state.currentAddress.cityName = action.payload.cityName;

        // Clear area/branch when city changes
        state.currentAddress.areaId = undefined;
        state.currentAddress.areaName = undefined;
        state.currentAddress.branchId = undefined;
        state.currentAddress.branchName = undefined;
        state.currentAddress.branchAddress = undefined;
      }
    },

    // Select Area (intermediate)
    selectArea: (
      state,
      action: PayloadAction<{ areaId: number; areaName: string }>
    ) => {
      if (!state.currentAddress) return;

      state.currentAddress.areaId = action.payload.areaId;
      state.currentAddress.areaName = action.payload.areaName;
    },

    // Select Branch (intermediate)
    selectBranch: (
      state,
      action: PayloadAction<{ branchId: number }>
    ) => {
      if (!state.currentAddress) return;

      state.currentAddress.branchId = action.payload.branchId;
    },


    // Clear Address
    clearAddress: (state) => {
      state.currentAddress = null;
    },

    // Set Loading States
    setLoadingLocation: (state, action: PayloadAction<boolean>) => {
      state.isLoadingLocation = action.payload;
    },

    setLoadingData: (state, action: PayloadAction<boolean>) => {
      state.isLoadingData = action.payload;
    },
  },
});

export const {
  setOrderModesData,
  openAddressModal,
  closeAddressModal,
  setOrderMode,
  setDeliveryAddress,
  setPickupBranch,
  updateSelectedCity,
  clearAddress,
  setLoadingLocation,
  setLoadingData,
  selectArea,
  selectBranch
} = addressSlice.actions;

export default addressSlice.reducer;

// Selectors
export const selectCurrentAddress = (state: { address: AddressState }) => state.address.currentAddress;
export const selectOrderModesData = (state: { address: AddressState }) => state.address.orderModesData;
export const selectAvailableModes = (state: { address: AddressState }) => state.address.availableModes;
export const selectIsModalOpen = (state: { address: AddressState }) => state.address.isModalOpen;
export const selectIsLoadingLocation = (state: { address: AddressState }) => state.address.isLoadingLocation;