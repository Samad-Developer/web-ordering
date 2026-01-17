
'use client';

import React, { useState } from 'react';
import { Branch } from '@/types/address.types';
import { BranchDetailsCard } from './BranchCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Store } from 'lucide-react';

interface BranchSelectorProps {
  branches: Branch[];
  selectedBranchId: number | null;
  onBranchSelect: (branchId: number) => void;
}

export function BranchSelector({
  branches,
  selectedBranchId,
  onBranchSelect,
}: BranchSelectorProps) {
  const selectedBranch = branches.find((b) => b.BranchId === selectedBranchId);

  const handleValueChange = (value: string) => {
    const branchId = parseInt(value);
    const branch = branches.find((b) => b.BranchId === branchId);
    if (branch) {
      onBranchSelect(branch.BranchId);
    }
  };

  if (branches.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No branches available for this city</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto">
      {/* Branch Dropdown */}
      <div className="space-y-2">
        <Label htmlFor="branch-select" className="text-sm font-medium text-gray-700">
          Select Branch
        </Label>
        
        <Select
          value={selectedBranchId?.toString() || ''}
          onValueChange={handleValueChange}
        >
          <SelectTrigger
            id="branch-select"
            className="!h-10 text-base border-2 hover:border-gray-300 transition-colors w-full"
          >
            <div className="flex items-center gap-2 w-full">
              <Store className="w-4 h-4 text-gray-500" />
              <SelectValue placeholder="Choose your pickup location" />
            </div>
          </SelectTrigger>
          
          <SelectContent >
            {branches.map((branch) => (
              <SelectItem 
                key={branch.BranchId} 
                value={branch.BranchId.toString()}
                className="cursor-pointer hover:bg-gray-50 py-3"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{branch.BranchName}</span>
                  {/* <span className="text-xs text-gray-500">
                    {branch.BranchPhoneNumber}
                  </span> */}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Selected Branch Details Card */}
      {selectedBranch && (
        <BranchDetailsCard branch={selectedBranch} />
      )}
    </div>
  );
}