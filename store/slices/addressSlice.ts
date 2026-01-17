// store/slices/addressSlice.ts

import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type {
  DeliveryPickupApiResponse,
  UserSelectedAddress,
  OrderMode,
  Branch,
} from '@/types/address.types';
import { saveBranchId, clearBranchId } from '@/lib/address/addressHelpers';

interface AddressState {
  apiData: DeliveryPickupApiResponse | null;
  isLoading: boolean;
  error: string | null;
  selectedAddress: UserSelectedAddress | null;
  
  // Branch details for current selection
  selectedBranchDetails: Branch | null;
  
  isModalOpen: boolean;
}

const initialState: AddressState = {
  apiData: null,
  isLoading: false,
  error: null,
  selectedAddress: null,
  selectedBranchDetails: null,
  isModalOpen: false,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    addressDataRequested: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    addressDataReceived: (state, action: PayloadAction<DeliveryPickupApiResponse>) => {
      state.isLoading = false;
      state.apiData = action.payload;
    },

    addressDataError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    setDeliveryAddress: (
      state,
      action: PayloadAction<{
        cityId: string;
        cityName: string;
        areaId: number;
        areaName: string;
        branchId: number;
        branchDetails?: Branch; // Optional full branch details
      }>
    ) => {
      state.selectedAddress = {
        orderMode: 'delivery',
        cityId: action.payload.cityId,
        cityName: action.payload.cityName,
        areaId: action.payload.areaId,
        areaName: action.payload.areaName,
        isCurrentLocation: false,
        lastUpdated: Date.now(),
      };

      state.selectedBranchDetails = action.payload.branchDetails || null;
      saveBranchId(action.payload.branchId);
    },

    setPickupBranch: (
      state,
      action: PayloadAction<{
        cityId: string;
        cityName: string;
        branch: Branch; // Full branch object
      }>
    ) => {
      state.selectedAddress = {
        orderMode: 'pickup',
        cityId: action.payload.cityId,
        cityName: action.payload.cityName,
        branchId: action.payload.branch.BranchId,
        branchName: action.payload.branch.BranchName,
        branchAddress: action.payload.branch.BranchAddress,
        branchPhoneNumber: action.payload.branch.BranchPhoneNumber,
        isCurrentLocation: false,
        lastUpdated: Date.now(),
      };

      state.selectedBranchDetails = action.payload.branch;
      saveBranchId(action.payload.branch.BranchId);
    },

    clearSelectedAddress: (state) => {
      state.selectedAddress = null;
      state.selectedBranchDetails = null;
      clearBranchId();
    },

    openAddressModal: (state) => {
      state.isModalOpen = true;
    },

    closeAddressModal: (state) => {
      state.isModalOpen = false;
    },
  },
});

export const {
  addressDataRequested,
  addressDataReceived,
  addressDataError,
  setDeliveryAddress,
  setPickupBranch,
  clearSelectedAddress,
  openAddressModal,
  closeAddressModal,
} = addressSlice.actions;

export default addressSlice.reducer;

// ============================================
// SELECTORS
// ============================================

export const selectAddressApiData = (state: { address: AddressState }) =>
  state.address.apiData;

export const selectAddressLoading = (state: { address: AddressState }) =>
  state.address.isLoading;

export const selectAddressError = (state: { address: AddressState }) =>
  state.address.error;

export const selectSelectedAddress = (state: { address: AddressState }) =>
  state.address.selectedAddress;

export const selectSelectedBranchDetails = (state: { address: AddressState }) =>
  state.address.selectedBranchDetails;

export const selectIsModalOpen = (state: { address: AddressState }) =>
  state.address.isModalOpen;

export const selectAvailableModes = createSelector(
  [selectAddressApiData],
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

    return { delivery: hasDelivery, pickup: hasPickup };
  }
);