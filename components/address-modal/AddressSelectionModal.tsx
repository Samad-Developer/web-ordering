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

export function AddressSelectionModal() {
  const dispatch = useAppDispatch();
  
  const isOpen = useAppSelector(selectIsModalOpen);
  const selectedAddress = useAppSelector(selectSelectedAddress);
  const availableModes = useAppSelector(selectAvailableModes);
  const apiData = useAppSelector(selectAddressApiData);

  const [tempMode, setTempMode] = useState<OrderMode>('delivery');
  const [tempCityId, setTempCityId] = useState<string | null>(null);
  const [tempAreaId, setTempAreaId] = useState<number | null>(null);
  const [tempBranchId, setTempBranchId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && selectedAddress) {
      setTempMode(selectedAddress.orderMode);
      setTempCityId(selectedAddress.cityId);
      setTempAreaId(selectedAddress.areaId || null);
      setTempBranchId(selectedAddress.branchId || null);
    } else if (isOpen) {
      setTempMode(availableModes.delivery ? 'delivery' : 'pickup');
    }
  }, [isOpen, selectedAddress, availableModes]);

  if (!apiData) return null;

  const cities = getAllCities(apiData);
  const areas = tempCityId ? getAreasForCity(apiData, tempCityId) : [];
  const branches = tempCityId ? getBranchesForCity(apiData, tempCityId) : [];

  const isTemporarilyClosed = !availableModes.delivery && !availableModes.pickup;

  const handleModeChange = (mode: OrderMode) => {
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
      if (!area) {
        toast.error('Invalid area selection');
        return;
      }

      // ✅ Find branch for this area
      // Assuming area has a BranchId or you need to map it
      // For now, using the first branch from the city as example
      const areaBranch = branches[0]; // TODO: Map area to correct branch
      
      if (!areaBranch) {
        toast.error('No branch available for this area');
        return;
      }

      dispatch(
        setDeliveryAddress({
          cityId: tempCityId,
          cityName,
          areaId: tempAreaId,
          areaName: area.AreaName,
          branchDetails: areaBranch, // ✅ Complete branch details
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

      dispatch(
        setPickupBranch({
          cityId: tempCityId,
          cityName,
          branch, // ✅ Complete branch object
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
    
    if (!selectedAddress) {
      setTempMode('delivery');
      setTempCityId(null);
      setTempAreaId(null);
      setTempBranchId(null);
    }
  };

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
            <div className='w-full max-w-64 mx-auto px-4'>
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