'use client';

import React, { useEffect, useState } from 'react';
import { Branch } from '@/types/address.types';
import { Clock, AlertCircle } from 'lucide-react';
import { 
  isBranchOpen, 
  getTimeUntilClose, 
  getTimeUntilOpen,
  formatTimeRemaining 
} from '@/lib/branch/branchUtils';

import { cn } from '@/lib/utils';

interface BranchStatusProps {
  branch: Branch;
  compact?: boolean;
}

export function BranchStatus({ branch, compact = false }: BranchStatusProps) {
  const [isOpen, setIsOpen] = useState(isBranchOpen(branch));
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    const updateStatus = () => {
      const open = isBranchOpen(branch);
      setIsOpen(open);

      if (open) {
        setTimeRemaining(getTimeUntilClose(branch));
      } else {
        setTimeRemaining(getTimeUntilOpen(branch));
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [branch]);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={cn(
          'w-2 h-2 rounded-full',
          isOpen ? 'bg-green-500' : 'bg-red-500'
        )} />
        <span className={cn(
          'text-sm font-medium',
          isOpen ? 'text-green-600' : 'text-red-600'
        )}>
          {isOpen ? 'Open' : 'Closed'}
        </span>
      </div>
    );
  }

  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-2 rounded-lg',
      isOpen ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
    )}>
      {isOpen ? (
        <Clock className="w-4 h-4 text-green-600" />
      ) : (
        <AlertCircle className="w-4 h-4 text-red-600" />
      )}
      
      <div className="flex-1">
        <p className={cn(
          'text-sm font-semibold',
          isOpen ? 'text-green-700' : 'text-red-700'
        )}>
          {isOpen ? 'Open Now' : 'Closed'}
        </p>
        
        {timeRemaining && (
          <p className="text-xs text-gray-600">
            {isOpen 
              ? `Closes in ${formatTimeRemaining(timeRemaining)}`
              : `Opens in ${formatTimeRemaining(timeRemaining)}`
            }
          </p>
        )}
      </div>
      
      <div className="text-right">
        <p className="text-xs text-gray-500">Hours</p>
        <p className="text-xs font-medium text-gray-700">
          {branch.BusinessStartTime} - {branch.BusinessEndTime}
        </p>
      </div>
    </div>
  );
}