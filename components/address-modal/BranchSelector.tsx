'use client';

import React from 'react';
import { Branch } from '@/types/address.types';
import { BranchCard } from './BranchCard';

interface BranchSelectorProps {
  branches: Branch[];
  selectedBranchId: number | null;
  onBranchSelect: (branch: Branch) => void;
}

export function BranchSelector({
  branches,
  selectedBranchId,
  onBranchSelect,
}: BranchSelectorProps) {
  if (branches.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No branches available for this city</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 space-y-3 max-h-[400px] overflow-y-auto pr-2">
      {branches.map((branch, index) => (
        <BranchCard
          key={branch.BranchId}
          branch={branch}
          isSelected={selectedBranchId === branch.BranchId}
          onSelect={() => onBranchSelect(branch)}
          index={index}
        />
      ))}
    </div>
  );
}