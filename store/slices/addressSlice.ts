import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  DeliveryPickupApiResponse,
  UserSelectedAddress,
  OrderMode,
  Branch
} from '@/types/address.types';

interface AddressState {
  // API Data from SignalR
  Data: DeliveryPickupApiResponse | null;
  isLoading: boolean;
  error: string | null;

  // User Selection
  selectedAddress: UserSelectedAddress | null;

  // UI State
  isModalOpen: boolean;
  isLoadingLocation: boolean;
}

const initialState: AddressState = {
  Data: null,
  isLoading: false,
  error: null,
  selectedAddress: null,
  isModalOpen: false,
  isLoadingLocation: false,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    // ============================================
    // API DATA ACTIONS (SignalR)
    // ============================================

    addressDataRequested: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    addressDataReceived: (state, action: PayloadAction<DeliveryPickupApiResponse>) => {
      state.isLoading = false;
      state.Data = action.payload;
    },

    addressDataError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // ============================================
    // USER SELECTION ACTIONS
    // ============================================

    setOrderMode: (state, action: PayloadAction<OrderMode>) => {
      if (state.selectedAddress) {
        state.selectedAddress.orderMode = action.payload;
        // Clear opposite mode data
        if (action.payload === 'delivery') {
          state.selectedAddress.branchId = undefined;
          state.selectedAddress.branchName = undefined;
          state.selectedAddress.branchAddress = undefined;
          state.selectedAddress.branchPhoneNumber = undefined;
        } else {
          state.selectedAddress.areaId = undefined;
          state.selectedAddress.areaName = undefined;
          state.selectedAddress.fullAddress = undefined;
        }
      }
    },

    setDeliveryAddress: (state, action: PayloadAction<{
      cityId: string;
      cityName: string;
      areaId: number;
      areaName: string;
      fullAddress?: string;
      coordinates?: { lat: number; lng: number };
      isCurrentLocation?: boolean;
    }>) => {
      state.selectedAddress = {
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

    setPickupBranch: (state, action: PayloadAction<{
      cityId: string;
      cityName: string;
      branchId: number;
      branchName: string;
      branchAddress: string;
      branchPhoneNumber: string;
    }>) => {
      state.selectedAddress = {
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

    clearSelectedAddress: (state) => {
      state.selectedAddress = null;
    },

    // ============================================
    // MODAL ACTIONS
    // ============================================

    openAddressModal: (state) => {
      state.isModalOpen = true;
    },

    closeAddressModal: (state) => {
      state.isModalOpen = false;
    },

    // ============================================
    // LOADING STATES
    // ============================================

    setLoadingLocation: (state, action: PayloadAction<boolean>) => {
      state.isLoadingLocation = action.payload;
    },
  },
});

export const {
  addressDataRequested,
  addressDataReceived,
  addressDataError,
  setOrderMode,
  setDeliveryAddress,
  setPickupBranch,
  clearSelectedAddress,
  openAddressModal,
  closeAddressModal,
  setLoadingLocation,
} = addressSlice.actions;

export default addressSlice.reducer;

// ============================================
// SELECTORS
// ============================================

export const selectAddressApiData = (state: { address: AddressState }) => state.address.Data;

export const selectAddressLoading = (state: { address: AddressState }) => state.address.isLoading;

export const selectAddressError = (state: { address: AddressState }) => state.address.error;

export const selectSelectedAddress = (state: { address: AddressState }) => state.address.selectedAddress;

export const selectIsModalOpen = (state: { address: AddressState }) => state.address.isModalOpen;

export const selectIsLoadingLocation = (state: { address: AddressState }) => state.address.isLoadingLocation;

import { createSelector } from "@reduxjs/toolkit";

// Helper selector for available modes (memoized)
export const selectAvailableModes = createSelector(
  [(state: { address: AddressState }) => state.address.Data],
  (data) => {
    if (!data) {
      return { delivery: false, pickup: false };
    }

    const hasDelivery = Object.values(data.dataPayload.Delivery).some(
      (city) => city.Areas.length > 0
    );

    const hasPickup = Object.values(data.dataPayload.Pickup).some(
      (city) => city.Branches.length > 0
    );

    return {
      delivery: hasDelivery,
      pickup: hasPickup,
    };
  }
);
