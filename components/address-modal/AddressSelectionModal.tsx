'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
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
} from '@/store/slices/addressSlice';
import {
  getAllCities,
  getAreasForCity,
  getBranchesForCity,
  getCityNameById,
} from '@/lib/address/addressHelpers';
import { OrderMode, Branch } from '@/types/address.types';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { OrderModeToggle } from './OrderModeToggle';
import { CurrentLocationButton } from './CurrentLocationButton';
import { CitySelector } from './CitySelector';
import { AreaSelector } from './AreaSelector';
import { BranchSelector } from './BranchSelector';
import { TemporarilyClosedMessage } from './TemporarilyClosedMessage';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toast } from 'sonner';

export function AddressSelectionModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsModalOpen);
  const orderModesData = useAppSelector(selectOrderModesData);
  const availableModes = useAppSelector(selectAvailableModes);
  const currentAddress = useAppSelector(selectCurrentAddress);

  const [selectedMode, setSelectedMode] = useState<OrderMode>('delivery');
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);

  const { getUserLocation } = useGeolocation();

  // Check if both modes are unavailable
  const isTemporarilyClosed = !availableModes.delivery && !availableModes.pickup;

  // Get cities based on current mode
  const allCities = orderModesData ? getAllCities(orderModesData) : [];

  // Get areas/branches for selected city
  const availableAreas = selectedCityId && orderModesData
    ? getAreasForCity(orderModesData, selectedCityId)
    : [];

  const availableBranches = selectedCityId && orderModesData
    ? getBranchesForCity(orderModesData, selectedCityId)
    : [];

  // Initialize from current address
  useEffect(() => {
    if (currentAddress) {
      setSelectedMode(currentAddress.orderMode);
      setSelectedCityId(currentAddress.cityId || null);
      setSelectedAreaId(currentAddress.areaId || null);
      setSelectedBranchId(currentAddress.branchId || null);
    }
  }, [currentAddress]);

  // Reset selections when mode changes
  const handleModeChange = (mode: OrderMode) => {
    setSelectedMode(mode);
    setSelectedCityId(null);
    setSelectedAreaId(null);
    setSelectedBranchId(null);
    dispatch(setOrderMode(mode));
  };

  // Handle city selection
  const handleCitySelect = (cityId: string, cityName: string) => {
    setSelectedCityId(cityId);
    setSelectedAreaId(null);
    setSelectedBranchId(null);
    dispatch(updateSelectedCity({ cityId, cityName }));
  };

  // Handle area selection
  const handleAreaSelect = (areaId: number, areaName: string) => {
    setSelectedAreaId(areaId);
  };

  // Handle branch selection
  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranchId(branch.BranchId);
  };

  // Handle current location
  const handleUseCurrentLocation = async () => {
    const result = await getUserLocation();
    
    if (result) {
      toast.success('Location detected!', {
        description: `Lat: ${result?.coordinates?.lat}, Lng: ${result?.coordinates?.lng}`,
      });
      
      
      // TODO: i have to get the user current location and than check which city or area he belongs so i will automaticly select that area or branch for him/her.
    }
  };

  // Handle final selection
  const handleSelect = () => {
    if (!selectedCityId || !orderModesData) return;

    const cityName = getCityNameById(orderModesData, selectedCityId);
    if (!cityName) return;

    if (selectedMode === 'delivery') {
      if (!selectedAreaId) {
        toast.error('Please select an area');
        return;
      }

      const area = availableAreas.find((a) => a.AreaId === selectedAreaId);
      if (!area) return;

      dispatch(
        setDeliveryAddress({
          cityId: selectedCityId,
          cityName,
          areaId: selectedAreaId,
          areaName: area.AreaName,
        })
      );

      toast.success('Delivery address set!', {
        description: `${area.AreaName}, ${cityName}`,
      });
    } else {
      if (!selectedBranchId) {
        toast.error('Please select a branch');
        return;
      }

      const branch = availableBranches.find((b) => b.BranchId === selectedBranchId);
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

      toast.success('Pickup branch selected!', {
        description: branch.BranchName,
      });
    }

    dispatch(closeAddressModal());
  };

  // Check if selection is complete
  const isSelectionComplete = selectedCityId && ((selectedMode === 'delivery' && selectedAreaId) || (selectedMode === 'pickup' && selectedBranchId));

  return (
    <Dialog open={isOpen} onOpenChange={() => dispatch(closeAddressModal())} >
      <DialogContent className="md:max-w-[500px] max-h-[90vh] overflow-y-auto p-0 mx-auto" showCloseButton={false}>
        {isTemporarilyClosed ? (
          <TemporarilyClosedMessage />
        ) : (
          <div className="p-6 space-y-6 flex flex-col items-center justify-center">
            {/* Order Mode Toggle */}
            <OrderModeToggle
              selectedMode={selectedMode}
              onModeChange={handleModeChange}
              availableDelivery={availableModes.delivery}
              availablePickup={availableModes.pickup}
            />

            {/* Current Location Button */}
            <div className="flex flex-col items-center">
              <CurrentLocationButton
                onClick={handleUseCurrentLocation}
                isLoading={false}
              />
            </div>

            {/* City Selector */}
            <CitySelector
              cities={allCities}
              selectedCityId={selectedCityId}
              onCitySelect={handleCitySelect}
              orderMode={selectedMode}
            />

            {/* Area Selector (Delivery) */}
            {selectedMode === 'delivery' && selectedCityId && (
              <>
                <AreaSelector
                  areas={availableAreas}
                  selectedAreaId={selectedAreaId}
                  onAreaSelect={handleAreaSelect}
                />
              </>
            )}

            {/* Branch Selector (Pickup) */}
            {selectedMode === 'pickup' && selectedCityId && (
              <>
                <BranchSelector
                  branches={availableBranches}
                  selectedBranchId={selectedBranchId}
                  onBranchSelect={handleBranchSelect}
                />
              </>
            )}

            {/* Select Button */}
            <Button
              onClick={handleSelect}
              disabled={!isSelectionComplete}
              className="w-full h-12 text-lg rounded-lg font-semibold bg-red-500 hover:bg-red-600"
            >
              Select
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}