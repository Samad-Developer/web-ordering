'use client';

import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openAddressModal, selectSelectedAddress } from "@/store/slices/addressSlice";
import { MapPin, ChevronDown, MapPinHouse } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAddressHydration } from "@/hooks/useAddressHydration";

interface ChangeLocationProps {
  locationIcon?: React.ReactNode;
  compact?: boolean;
}

export const ChangeLocation: React.FC<ChangeLocationProps> = ({
  locationIcon,
  compact = false,
}) => {
  const dispatch = useAppDispatch();
  const selectedAddress = useAppSelector(selectSelectedAddress);

  useAddressHydration();

  const handleLocationChange = () => {
    dispatch(openAddressModal());
  };

  const getDisplayText = () => {
    if (!selectedAddress) {
      return 'Select Location';
    }

    if (selectedAddress.orderMode === 'delivery') {
      return selectedAddress.areaName || 'Delivery Area';
    }

    return selectedAddress.branchName || 'Pickup Branch';
  };

  const displayText = getDisplayText();
  const hasSelection = !!selectedAddress;

  // Compact version (icon only)
  if (compact) {
    return (
      <button
        onClick={handleLocationChange}
        className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-secondary hover:opacity-90 transition-opacity"
        aria-label="Change Location"
      >
        {/* {locationIcon || <MapPin className="w-5 h-5" />} */}
        <MapPinHouse />

        {hasSelection && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        )}
      </button>
    );
  }

  // Full version
  return (
    <button
      onClick={handleLocationChange}
      className={cn(
        "relative flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors",
        "bg-primary text-secondary "
      )}
      aria-label="Change Location"
    >
      {/* Icon */}
      <span className="flex-shrink-0 ">
        <MapPinHouse />
      </span>

      {/* Text Content - Hidden on small screens, visible on lg+ */}
      <div className="hidden lg:flex flex-col items-start min-w-0">
        {/* Top Label */}
        <span className="text-xs font-medium  leading-none mb-0.5">
          Change Location
        </span>

        {/* Selected Location */}
        <span className="text-sm font-semibold  truncate max-w-[180px]">
          {displayText}
        </span>
      </div>

      {/* Chevron Indicator */}
      <ChevronDown className="hidden lg:block w-4 h-4 flex-shrink-0 ml-1" />

      {/* Active Indicator Dot */}
      {hasSelection && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      )}
    </button>
  );
};