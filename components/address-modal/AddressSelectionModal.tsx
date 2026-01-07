'use client';

import { toast } from 'sonner';
import {
  selectIsModalOpen,
  selectSelectedAddress,
  selectAvailableModes,
  closeAddressModal,
  setOrderMode,
  setDeliveryAddress,
  setPickupBranch,
} from '@/store/slices/addressSlice';
import { useState, useEffect } from 'react';
import { CitySelector } from './CitySelector';
import { AreaSelector } from './AreaSelector';
import { useAddress } from '@/hooks/useAddress';
import { Button } from '@/components/ui/button';
import { BranchSelector } from './BranchSelector';
import { OrderModeToggle } from './OrderModeToggle';
import { OrderMode } from '@/types/address.types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { CurrentLocationButton } from './CurrentLocationButton';
import { TemporarilyClosedMessage } from './TemporarilyClosedMessage';
import { getAllCities, getAreasForCity, getBranchesForCity, getCityNameById } from '@/lib/address/addressHelpers';


export function AddressSelectionModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsModalOpen);
  const selectedAddress = useAppSelector(selectSelectedAddress);
  const availableModes = useAppSelector(selectAvailableModes);
  const { apiData, isLoading } = useAddress();

  // Local state - only for temporary selection (before confirming)
  const [tempMode, setTempMode] = useState<OrderMode>('delivery');
  const [tempCityId, setTempCityId] = useState<string | null>(null);
  const [tempAreaId, setTempAreaId] = useState<number | null>(null);
  const [tempBranchId, setTempBranchId] = useState<number | null>(null);

  // Initialize from selected address when modal opens
  useEffect(() => {
    if (isOpen && selectedAddress) {
      setTempMode(selectedAddress.orderMode);
      setTempCityId(selectedAddress.cityId);
      setTempAreaId(selectedAddress.areaId || null);
      setTempBranchId(selectedAddress.branchId || null);
    }
  }, [isOpen, selectedAddress]);

  if (!apiData) return null;

  const cities = getAllCities(apiData);
  const areas = tempCityId ? getAreasForCity(apiData, tempCityId) : [];
  const branches = tempCityId ? getBranchesForCity(apiData, tempCityId) : [];

  const isTemporarilyClosed = !availableModes.delivery && !availableModes.pickup;

  const handleModeChange = (mode: OrderMode) => {
    dispatch(setOrderMode(mode));
    setTempMode(mode);
    setTempCityId(null);
    setTempAreaId(null);
    setTempBranchId(null);
  };

  const handleConfirm = () => {
    if (!tempCityId) {
      toast.error('Please select a city');
      return;
    }

    const cityName = getCityNameById(apiData, tempCityId);
    if (!cityName) return;

    if (tempMode === 'delivery') {
      if (!tempAreaId) {
        toast.error('Please select an area');
        return;
      }

      const area = areas.find(a => a.AreaId === tempAreaId);
      if (!area) return;

      dispatch(setDeliveryAddress({
        cityId: tempCityId,
        cityName,
        areaId: tempAreaId,
        areaName: area.AreaName,
      }));

      toast.success('Delivery address set!', {
        description: `${area.AreaName}, ${cityName}`,
      });
    } else {
      if (!tempBranchId) {
        toast.error('Please select a branch');
        return;
      }

      const branch = branches.find(b => b.BranchId === tempBranchId);
      if (!branch) return;

      dispatch(setPickupBranch({
        cityId: tempCityId,
        cityName,
        branchId: branch.BranchId,
        branchName: branch.BranchName,
        branchAddress: branch.BranchAddress,
        branchPhoneNumber: branch.BranchPhoneNumber,
      }));

      toast.success('Pickup branch selected!', {
        description: branch.BranchName,
      });
    }

    dispatch(closeAddressModal());
  };

  const canConfirm = tempCityId && ((tempMode === 'delivery' && tempAreaId) || (tempMode === 'pickup' && tempBranchId));

  const handleCloseModal = () => {
    dispatch(closeAddressModal())
    setTempMode('delivery');
    setTempCityId(null);
    setTempAreaId(null);
    setTempBranchId(null);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal} >
      <DialogContent className="md:max-w-[500px] max-h-[90vh] overflow-y-auto p-0 mx-auto" showCloseButton={false}>
        {isTemporarilyClosed ? (
          <TemporarilyClosedMessage />
        ) : (
          <div className="p-6 space-y-6 flex flex-col items-center justify-center">
            {/* Order Mode Toggle */}
            <OrderModeToggle
              selectedMode={tempMode}
              onModeChange={handleModeChange}
              availableDelivery={availableModes.delivery}
              availablePickup={availableModes.pickup}
            />

            {/* Current Location Button */}
            <div className="flex flex-col items-center">
              <CurrentLocationButton />
            </div>

            {/* City Selector */}
            <CitySelector
              cities={cities}
              selectedCityId={tempCityId}
              onCitySelect={setTempCityId}
              orderMode={tempMode}
            />

            {/* Area Selector (Delivery) */}
            {tempMode === 'delivery' && tempCityId && (
              <>
                <AreaSelector
                  areas={areas}
                  selectedAreaId={tempAreaId}
                  onAreaSelect={setTempAreaId}
                  disabled={!tempCityId}
                />
              </>
            )}

            {/* Branch Selector (Pickup) */}
            {tempMode === 'pickup' && tempCityId && (
              <>
                <BranchSelector
                  branches={branches}
                  selectedBranchId={tempBranchId}
                  onBranchSelect={setTempBranchId}
                />
              </>
            )}

            {/* Select Button */}
            <Button
              onClick={handleConfirm}
              disabled={!canConfirm}
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