'use client';

import React from 'react';
import { Area } from '@/types/address.types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ChevronDown } from 'lucide-react';

interface AreaSelectorProps {
  areas: Area[];
  selectedAreaId: number | null;
  onAreaSelect: (areaId: number) => void;
  disabled?: boolean;
}

export function AreaSelector({
  areas,
  selectedAreaId,
  onAreaSelect,
  disabled = false,
}: AreaSelectorProps) {
    
  const handleValueChange = (value: string) => {
    const areaId = parseInt(value);
    const area = areas.find((a) => a.AreaId === areaId);
    if (area) {
      onAreaSelect(area.AreaId);
    }
  };

  return (
    <div className="space-y-2 w-full mx-auto">
      <Label htmlFor="area-select" className="text-sm font-medium text-gray-700">
        Select Area
      </Label>
      
      <Select
        value={selectedAreaId?.toString() || ''}
        onValueChange={handleValueChange}
        disabled={disabled || areas.length === 0}
      >
        <SelectTrigger
          id="area-select"
          className="!h-10 text-base border-2 hover:border-gray-300 transition-colors w-full"
        >
          <SelectValue placeholder="Select your area" />
        </SelectTrigger>
        
        <SelectContent>
          {areas.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No areas available for this city
            </div>
          ) : (
            areas.map((area) => (
              <SelectItem 
                key={area.AreaId} 
                value={area.AreaId.toString()}
                className="cursor-pointer hover:bg-gray-50"
              >
                {area.AreaName}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {areas.length === 0 && (
        <p className="text-xs text-red-500 mt-1">
          Please select a city first
        </p>
      )}
    </div>
  );
}