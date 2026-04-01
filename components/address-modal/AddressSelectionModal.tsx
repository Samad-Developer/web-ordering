'use client';

import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  selectIsModalOpen,
  selectSelectedAddress,
  selectAddressApiData,
  closeAddressModal,
  setDeliveryAddress,
  setPickupBranch,
  changeOrderMode,
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
import { OrderModeToggle } from './OrderModeToggle';
import { CitySelector } from './CitySelector';
import { AreaSelector } from './AreaSelector';
import { BranchSelector } from './BranchSelector';
import { TemporarilyClosedMessage } from './TemporarilyClosedMessage';
import { Logo } from '../shared/headers/partials/Logo';

export function AddressSelectionModal() {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector(selectIsModalOpen);
  const selectedAddress = useAppSelector(selectSelectedAddress);
  const apiData = useAppSelector(selectAddressApiData);

  // Direct flags from API
  const isDeliveryEnabled = apiData?.dataPayload?.Theme?.Settings?.IS_DELIVERY_ENABLED ?? false;
  const isPickupEnabled = apiData?.dataPayload?.Theme?.Settings?.IS_PICKUP_ENABLED ?? false;
  const isTemporarilyClosed = !isDeliveryEnabled && !isPickupEnabled;

  const initialMode: OrderMode = isDeliveryEnabled
  ? 'delivery'
  : isPickupEnabled
  ? 'pickup'
  : 'delivery'; // fallback if both disabled

  const [tempMode, setTempMode] = useState<OrderMode>(initialMode);
  const [tempCityId, setTempCityId] = useState<string | null>(null);
  const [tempAreaId, setTempAreaId] = useState<number | null>(null);
  const [tempBranchId, setTempBranchId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && selectedAddress) {
      setTempMode(selectedAddress.orderMode);
      setTempCityId(selectedAddress.cityId);
      setTempAreaId(selectedAddress.areaId || null);
      setTempBranchId(selectedAddress.branchId || null);
      dispatch(changeOrderMode(isDeliveryEnabled ? 'delivery' : 'pickup'));
    }
  }, [isOpen, selectedAddress, isDeliveryEnabled, isPickupEnabled]);

  if (!apiData) return null;
  const cities = getAllCities(apiData);
  const areas = tempCityId ? getAreasForCity(apiData, tempCityId) : [];
  const branches = tempCityId ? getBranchesForCity(apiData, tempCityId) : [];

  const handleModeChange = (mode: OrderMode) => {
    setTempMode(mode);
    setTempCityId(null);
    setTempAreaId(null);
    setTempBranchId(null);
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

      const areaBranch = branches.find((b) => b.BranchId === area.BranchId);

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
          deliveryCharges: area.DeliveryCharges,
          deliveryTime: area.DeliveryTime,
          deliveryChargesWaiveOffLimit: area.DeliveryChargesWaiveOffLimit,
          branchDetails: areaBranch,
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
          branch,
        })
      );

      toast.success('Pickup branch selected!', {
        description: branch.BranchName,
      });
    }

    dispatch(closeAddressModal());
  };

  const canConfirm = tempCityId && ((tempMode === 'delivery' && tempAreaId) || (tempMode === 'pickup' && tempBranchId));

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent
        className="md:max-w-[500px] p-0 overflow-hidden"
        showCloseButton={false}
      >
        {isTemporarilyClosed ? (
          <TemporarilyClosedMessage />
        ) : (
          <div className="max-h-[90vh] overflow-y-auto p-6 space-y-6">

            <div className=' flex justify-center mb-3'>
              <Logo />
            </div>

            {/* Order Mode Toggle */}
            <div className='w-full max-w-64 mx-auto px-4'>
              <OrderModeToggle
                selectedMode={tempMode}
                onModeChange={handleModeChange}
                availableDelivery={isDeliveryEnabled}
                availablePickup={isPickupEnabled}
              />
            </div>

            {/* get current location button */}
            {/* <div className='flex w-full justify-center items-center'>
              <button className='bg-red-500 px-4 font-semibold py-1 rounded-full text-white flex items-center justify-center gap-2 cursor-pointer'>
                <LocateFixed className='w-4 h-4' />
                Use Current Location
              </button>
            </div> */}

            {/* City Selector */}
            <CitySelector
              cities={cities}
              selectedCityId={tempCityId}
              onCitySelect={setTempCityId}
              orderMode={tempMode}
            />

            {/* Area Selector - Only for Delivery */}
            {tempMode === 'delivery' && tempCityId && isDeliveryEnabled && (
              <AreaSelector
                areas={areas}
                selectedAreaId={tempAreaId}
                onAreaSelect={setTempAreaId}
                disabled={!tempCityId}
              />
            )}

            {/* Branch Selector - Only for Pickup */}
            {tempMode === 'pickup' && tempCityId && isPickupEnabled && (
              <BranchSelector
                branches={branches}
                selectedBranchId={tempBranchId}
                onBranchSelect={setTempBranchId}
              />
            )}

            {/* Confirm Button */}
            <Button
              onClick={handleConfirm}
              disabled={!canConfirm}
              className="w-full h-12 text-lg rounded-lg font-semibold bg-primary text-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Select
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}