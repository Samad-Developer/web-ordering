'use client';

import React from 'react';
import { Branch } from '@/types/address.types';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { parseBranchAddress, formatBusinessHours } from '@/lib/address/addressHelpers';

interface BranchCardProps {
  branch: Branch;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

export function BranchCard({ branch, isSelected, onSelect, index }: BranchCardProps) {
  const { mainAddress, phoneNumber } = parseBranchAddress(branch.BranchAddress);
  const businessHours = formatBusinessHours(
    branch.BusinessDayStartTime,
    branch.BusinessDayEndTime
  );

  const handleGetDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    const encodedAddress = encodeURIComponent(mainAddress);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  return (
    <div>
      <div
        className={cn(
          'cursor-pointer rounded-lg',
          isSelected
            ? 'border border-red-500 bg-red-50 shadow-lg'
            : 'border border-gray-200 hover:border-gray-300'
        )}
        onClick={onSelect}
      >
        <div className="p-2 sm:p-4 space-y-3">
          {/* Branch Name */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-lg text-gray-900">
              {branch.BranchName}
            </h4>
            {isSelected && (
              <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <span className="flex-1 font-semibold">{mainAddress}</span>
          </div>

          {/* Phone Number */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <a
              href={`tel:${branch.BranchPhoneNumber}`}
              className="text-red-600 hover:text-red-700 font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              {phoneNumber || branch.BranchPhoneNumber}
            </a>
          </div>

          {/* Business Hours */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{businessHours}</span>
          </div>

          {/* Get Directions Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleGetDirections}
          >
            <Navigation className="w-4 h-4" />
            Get Directions
          </Button>
        </div>
      </div>
    </div>
  );
}