'use client';

import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  selectIsModalOpen,
  selectSelectedAddress,
  selectAvailableModes,
  selectAddressApiData,
  closeAddressModal,
  setDeliveryAddress,
  setPickupBranch,
} from '@/store/slices/addressSlice';
import {
  getAllCities,
  getAreasForCity,
  getBranchesForCity,
  getCityNameById,
} from '@/lib/address/addressHelpers';
import { OrderMode } from '@/types/address.types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { OrderModeToggle } from './OrderModeToggle';
import { CitySelector } from './CitySelector';
import { AreaSelector } from './AreaSelector';
import { BranchSelector } from './BranchSelector';
import { TemporarilyClosedMessage } from './TemporarilyClosedMessage';
import { formatTimeRemaining } from '@/lib/branch/branchUtils';

export function AddressSelectionModal() {
  const dispatch = useAppDispatch();
  
  // Redux state
  const isOpen = useAppSelector(selectIsModalOpen);
  const selectedAddress = useAppSelector(selectSelectedAddress);
  const availableModes = useAppSelector(selectAvailableModes);
  const apiData = useAppSelector(selectAddressApiData);

  // Local temporary state (before confirmation)
  const [tempMode, setTempMode] = useState<OrderMode>('delivery');
  const [tempCityId, setTempCityId] = useState<string | null>(null);
  const [tempAreaId, setTempAreaId] = useState<number | null>(null);
  const [tempBranchId, setTempBranchId] = useState<number | null>(null);

  // Initialize temp state when modal opens with existing selection
  useEffect(() => {
    if (isOpen && selectedAddress) {
      setTempMode(selectedAddress.orderMode);
      setTempCityId(selectedAddress.cityId);
      setTempAreaId(selectedAddress.areaId || null);
      setTempBranchId(selectedAddress.branchId || null);
    } else if (isOpen) {
      // Set default mode based on availability
      setTempMode(availableModes.delivery ? 'delivery' : 'pickup');
    }
  }, [isOpen, selectedAddress, availableModes]);

  // Don't render if no API data
  if (!apiData) return null;

  // Get data for current selections
  const cities = getAllCities(apiData);
  const areas = tempCityId ? getAreasForCity(apiData, tempCityId) : [];
  const branches = tempCityId ? getBranchesForCity(apiData, tempCityId) : [];

  // Check if temporarily closed
  const isTemporarilyClosed = !availableModes.delivery && !availableModes.pickup;

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleModeChange = (mode: OrderMode) => {
    setTempMode(mode);
    // Reset city/area/branch when changing modes
    setTempCityId(null);
    setTempAreaId(null);
    setTempBranchId(null);
  };

 // Update handleConfirm in AddressSelectionModal.tsx

const handleConfirm = () => {
  if (!tempCityId) {
    toast.error('Please select a city');
    return;
  }

  const cityName = getCityNameById(apiData, tempCityId);
  if (!cityName) {
    toast.error('Invalid city selection');
    return;
  }

  if (tempMode === 'delivery') {
    if (!tempAreaId) {
      toast.error('Please select an area');
      return;
    }

    const area = areas.find((a) => a.AreaId === tempAreaId);
    const branch = branches.find((b) => b.BranchId === area?.BranchId);
    if (!branch) return;
    if (!area) {
      toast.error('Invalid area selection');
      return;
    }

    // TODO: Get branch details for this area from API
    // For now, using area ID as branch ID
    dispatch(
      setDeliveryAddress({
        cityId: tempCityId,
        cityName,
        areaId: tempAreaId,
        areaName: area.AreaName,
        branchId: branch?.BranchId,
        branchDetails: branch, // Pass full branch if available
      })
    );

    toast.success('Delivery address set!', {
      description: `${area.AreaName}, ${cityName}`,
    });
  } else {
    if (!tempBranchId) {
      toast.error('Please select a branch');
      return;
    }

    const branch = branches.find((b) => b.BranchId === tempBranchId);
    if (!branch) {
      toast.error('Invalid branch selection');
      return;
    }

    // // Check if branch is open
    // if (!isBranchOpen(branch)) {
    //   const timeUntilOpen = getTimeUntilOpen(branch);
    //   toast.warning('Branch is currently closed', {
    //     description: timeUntilOpen 
    //       ? `Opens in ${formatTimeRemaining(timeUntilOpen)}`
    //       : 'Check business hours',
    //   });
    //   // Still allow selection but warn user
    // }

    dispatch(
      setPickupBranch({
        cityId: tempCityId,
        cityName,
        branch, // Pass full branch object
      })
    );

    toast.success('Pickup branch selected!', {
      description: branch.BranchName,
    });
  }

  dispatch(closeAddressModal());
};

  const handleCloseModal = () => {
    dispatch(closeAddressModal());
    
    // Reset temp state if user didn't confirm
    if (!selectedAddress) {
      setTempMode('delivery');
      setTempCityId(null);
      setTempAreaId(null);
      setTempBranchId(null);
    }
  };

  // Check if user can confirm
  const canConfirm =
    tempCityId &&
    ((tempMode === 'delivery' && tempAreaId) ||
      (tempMode === 'pickup' && tempBranchId));

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent
        className="md:max-w-[500px] max-h-[90vh] overflow-y-auto p-0"
        showCloseButton={false}
      >
        {isTemporarilyClosed ? (
          <TemporarilyClosedMessage />
        ) : (
          <div className="p-6 space-y-6">
            {/* Order Mode Toggle */}
            <div className='max-w-1/2 mx-auto'>
            <OrderModeToggle
              selectedMode={tempMode}
              onModeChange={handleModeChange}
              availableDelivery={availableModes.delivery}
              availablePickup={availableModes.pickup}
            />
            </div>

            {/* City Selector */}
            <CitySelector
              cities={cities}
              selectedCityId={tempCityId}
              onCitySelect={setTempCityId}
              orderMode={tempMode}
            />

            {/* Area Selector - Only for Delivery */}
            {tempMode === 'delivery' && tempCityId && (
              <>
                <Separator />
                <AreaSelector
                  areas={areas}
                  selectedAreaId={tempAreaId}
                  onAreaSelect={setTempAreaId}
                  disabled={!tempCityId}
                />
              </>
            )}

            {/* Branch Selector - Only for Pickup */}
            {tempMode === 'pickup' && tempCityId && (
              <>
                <Separator />
                <BranchSelector
                  branches={branches}
                  selectedBranchId={tempBranchId}
                  onBranchSelect={setTempBranchId}
                />
              </>
            )}

            {/* Confirm Button */}
            <Button
              onClick={handleConfirm}
              disabled={!canConfirm}
              className="w-full h-12 text-lg rounded-lg font-semibold bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Select
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}