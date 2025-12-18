'use client';

import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectIsModalOpen,
  selectOrderModesData,
  selectAvailableModes,
  selectCurrentAddress,
  closeAddressModal,
  setOrderMode,
  setDeliveryAddress,
  setPickupBranch,
  updateSelectedCity,
  selectArea,
  selectBranch,
} from '@/store/slices/addressSlice';
import {
  getAllCities,
  getAreasForCity,
  getBranchesForCity,
  getCityNameById,
} from '@/lib/address/addressHelpers';
import { OrderMode, Branch } from '@/types/address.types';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toast } from 'sonner';

export function useAddressSelection() {
  const dispatch = useAppDispatch();
  const { getUserLocation } = useGeolocation();

  const isOpen = useAppSelector(selectIsModalOpen);
  const orderModesData = useAppSelector(selectOrderModesData);
  const availableModes = useAppSelector(selectAvailableModes);
  const currentAddress = useAppSelector(selectCurrentAddress);

  const selectedMode: OrderMode = currentAddress?.orderMode ?? 'delivery';
  const selectedCityId = currentAddress?.cityId ?? null;
  const selectedAreaId = currentAddress?.areaId ?? null;
  const selectedBranchId = currentAddress?.branchId ?? null;

  const isTemporarilyClosed =
    !availableModes.delivery && !availableModes.pickup;

  const cities = useMemo(
    () => (orderModesData ? getAllCities(orderModesData) : []),
    [orderModesData]
  );

  const areas = useMemo(
    () =>
      selectedCityId && orderModesData
        ? getAreasForCity(orderModesData, selectedCityId)
        : [],
    [orderModesData, selectedCityId]
  );

  const branches = useMemo(
    () =>
      selectedCityId && orderModesData
        ? getBranchesForCity(orderModesData, selectedCityId)
        : [],
    [orderModesData, selectedCityId]
  );

  const isSelectionComplete =
    !!selectedCityId &&
    ((selectedMode === 'delivery' && !!selectedAreaId) ||
      (selectedMode === 'pickup' && !!selectedBranchId));

  /* ------------------ Handlers ------------------ */

  const changeMode = (mode: OrderMode) => {
    dispatch(setOrderMode(mode));
  };

  const selectCity = (cityId: string, cityName: string) => {
    dispatch(updateSelectedCity({ cityId, cityName }));
  };

  const selectAreaHandler = (areaId: number, areaName: string) => {
    dispatch(selectArea({ areaId, areaName }));
  };

  const selectBranchHandler = (branch: Branch) => {
    dispatch(selectBranch({ branchId: branch.BranchId }));
  };

  const useCurrentLocation = async () => {
    const result = await getUserLocation();

    if (!result) return;

    toast.success('Location detected', {
      description: `Lat: ${result.coordinates?.lat}, Lng: ${result.coordinates?.lng}`,
    });

    /*
      🔒 Correct architectural note:
      - Reverse geocoding
      - City/area matching
      - Branch proximity

      ALL belong in this hook (or a service),
      not in the component.
    */
  };

  const finalizeSelection = () => {
    if (!orderModesData || !selectedCityId) return;

    const cityName = getCityNameById(orderModesData, selectedCityId);
    if (!cityName) return;

    if (selectedMode === 'delivery') {
      if (!selectedAreaId) {
        toast.error('Please select an area');
        return;
      }

      const area = areas.find(a => a.AreaId === selectedAreaId);
      if (!area) return;

      dispatch(
        setDeliveryAddress({
          cityId: selectedCityId,
          cityName,
          areaId: area.AreaId,
          areaName: area.AreaName,
        })
      );
    } else {
      if (!selectedBranchId) {
        toast.error('Please select a branch');
        return;
      }

      const branch = branches.find(
        b => b.BranchId === selectedBranchId
      );
      if (!branch) return;

      dispatch(
        setPickupBranch({
          cityId: selectedCityId,
          cityName,
          branchId: branch.BranchId,
          branchName: branch.BranchName,
          branchAddress: branch.BranchAddress,
          branchPhoneNumber: branch.BranchPhoneNumber,
        })
      );
    }

    dispatch(closeAddressModal());
  };

  return {
    isOpen,
    isTemporarilyClosed,
    availableModes,
    selectedMode,
    selectedCityId,
    selectedAreaId,
    selectedBranchId,
    cities,
    areas,
    branches,
    isSelectionComplete,

    changeMode,
    selectCity,
    selectArea: selectAreaHandler,
    selectBranch: selectBranchHandler,
    useCurrentLocation,
    finalizeSelection,
    closeModal: () => dispatch(closeAddressModal()),
  };
}
