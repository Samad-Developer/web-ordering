import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type {
  DeliveryPickupApiResponse,
  UserSelectedAddress,
  OrderMode,
  Branch,
} from '@/types/address.types';
import { saveUserAddress, clearUserAddress } from '@/lib/address/addressHelpers';

interface AddressState {
  apiData: DeliveryPickupApiResponse | null;
  isLoading: boolean;
  error: string | null;
  selectedAddress: UserSelectedAddress | null;
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
        branchDetails: Branch; 
      }>
    ) => {
      const deliveryAddress: UserSelectedAddress = {
        orderMode: 'delivery',
        cityId: action.payload.cityId,
        cityName: action.payload.cityName,
        areaId: action.payload.areaId,
        areaName: action.payload.areaName,
        branchId: action.payload.branchDetails.BranchId,
        
        // ✅ Store complete branch details
        branchDetails: {
          BranchId: action.payload.branchDetails.BranchId,
          BranchName: action.payload.branchDetails.BranchName,
          BranchAddress: action.payload.branchDetails.BranchAddress,
          BranchPhoneNumber: action.payload.branchDetails.BranchPhoneNumber,
          BusinessStartTime: action.payload.branchDetails.BusinessStartTime,
          BusinessEndTime: action.payload.branchDetails.BusinessEndTime,
          DeliveryCharges: action.payload.branchDetails.DeliveryCharges,
          DeliveryChargesWaiveOffLimit: action.payload.branchDetails.DeliveryChargesWaiveOffLimit,
          DeliveryTime: action.payload.branchDetails.DeliveryTime,
          MinimumOrder: action.payload.branchDetails.MinimumOrder,
          IsBranchOpen: action.payload.branchDetails.IsBranchOpen,
        },
        
        isCurrentLocation: false,
        lastUpdated: Date.now(),
      };

      state.selectedAddress = deliveryAddress;
      state.selectedBranchDetails = action.payload.branchDetails;
      
      saveUserAddress(deliveryAddress);
    },

    setPickupBranch: (
      state,
      action: PayloadAction<{
        cityId: string;
        cityName: string;
        branch: Branch; 
      }>
    ) => {
      const pickupAddress: UserSelectedAddress = {
        orderMode: 'pickup',
        cityId: action.payload.cityId,
        cityName: action.payload.cityName,
        branchId: action.payload.branch.BranchId,
        branchName: action.payload.branch.BranchName,
        branchAddress: action.payload.branch.BranchAddress,
        branchPhoneNumber: action.payload.branch.BranchPhoneNumber,
        
        branchDetails: {
          BranchId: action.payload.branch.BranchId,
          BranchName: action.payload.branch.BranchName,
          BranchAddress: action.payload.branch.BranchAddress,
          BranchPhoneNumber: action.payload.branch.BranchPhoneNumber,
          BusinessStartTime: action.payload.branch.BusinessStartTime,
          BusinessEndTime: action.payload.branch.BusinessEndTime,
          DeliveryCharges: action.payload.branch.DeliveryCharges,
          DeliveryChargesWaiveOffLimit: action.payload.branch.DeliveryChargesWaiveOffLimit,
          DeliveryTime: action.payload.branch.DeliveryTime,
          MinimumOrder: action.payload.branch.MinimumOrder,
          IsBranchOpen: action.payload.branch.IsBranchOpen,
        },
        
        isCurrentLocation: false,
        lastUpdated: Date.now(),
      };

      state.selectedAddress = pickupAddress;
      state.selectedBranchDetails = action.payload.branch;
      
      // ✅ Save complete address to localStorage
      saveUserAddress(pickupAddress);
    },

    clearSelectedAddress: (state) => {
      state.selectedAddress = null;
      state.selectedBranchDetails = null;
      clearUserAddress();
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

// Selectors
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