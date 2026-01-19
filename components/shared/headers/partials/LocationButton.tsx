'use client';

import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openAddressModal, selectSelectedAddress } from "@/store/slices/addressSlice";
import { useTranslations } from 'next-intl';
import { MapPin, ChevronDown, Truck, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAddressHydration } from "@/hooks/useAddressHydration";

interface ChangeLocationProps {
  locationIcon?: React.ReactNode;
  showModeIcon?: boolean;
  compact?: boolean;
}

export const ChangeLocation: React.FC<ChangeLocationProps> = ({ 
  locationIcon,
  showModeIcon = true,
  compact = false,
}) => {
  const t = useTranslations('nav');
  const dispatch = useAppDispatch();
  const selectedAddress = useAppSelector(selectSelectedAddress);

  useAddressHydration();

  const handleLocationChange = () => { 
    dispatch(openAddressModal());
  };

  const getLocationInfo = () => {
    if (!selectedAddress) {
      return {
        main: 'Select Location',
        sub: 'Choose delivery or pickup',
        mode: null,
        icon: <MapPin className="w-5 h-5" />,
      };
    }

    if (selectedAddress.orderMode === 'delivery') {
      return {
        main: selectedAddress.areaName || 'Delivery Area',
        sub: selectedAddress.cityName || 'City',
        mode: 'Delivery',
        icon: <Truck className="w-5 h-5" />,
      };
    }

    return {
      main: selectedAddress.branchName || 'Pickup Branch',
      sub: selectedAddress.cityName || 'City',
      mode: 'Pickup',
      icon: <Store className="w-5 h-5" />,
    };
  };

  const locationInfo = getLocationInfo();
  const isSelected = !!selectedAddress;

  if (compact) {
    return (
      <button
        onClick={handleLocationChange}
        className="relative cursor-pointer flex items-center justify-center w-10 h-10 rounded-lg transition bg-primary text-white hover:opacity-90"
      >
        {showModeIcon ? locationInfo.icon : (locationIcon || <MapPin className="w-5 h-5" />)}
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleLocationChange}
      className={cn(
        "relative cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg transition group",
        isSelected 
          ? "bg-primary text-white hover:opacity-90" 
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      )}
    >
      {showModeIcon && <span className="flex-shrink-0">{locationInfo.icon}</span>}
      {!showModeIcon && locationIcon && <span className="flex-shrink-0">{locationIcon}</span>}

      <div className="hidden lg:flex flex-col items-start min-w-0 flex-1">
        {isSelected && locationInfo.mode && (
          <span className="text-[10px] font-medium opacity-80 uppercase tracking-wide">
            {locationInfo.mode}
          </span>
        )}
        <span className={cn("font-semibold truncate max-w-[200px]", isSelected ? "text-sm" : "text-base")}>
          {locationInfo.main}
        </span>
        {/* <span className="text-xs opacity-90 truncate max-w-[200px]">
          {locationInfo.sub}
        </span> */}
      </div>

      <ChevronDown className="hidden lg:block w-4 h-4 flex-shrink-0 group-hover:translate-y-0.5 transition-transform" />
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      )}
    </button>
  );
};