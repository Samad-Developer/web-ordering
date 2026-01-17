'use client';

import React, { useEffect, useState } from 'react';
import { Branch } from '@/types/address.types';
import { Clock, AlertCircle } from 'lucide-react';
import { 
  formatTimeRemaining 
} from '@/lib/branch/branchUtils';

import { cn } from '@/lib/utils';
import { useBranchValidation } from '@/hooks/useBranchValidation';

export function BranchStatus() {
  const branch = useBranchValidation();
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);



  // if (compact) {
  //   return (
  //     <div className="flex items-center gap-2">
  //       <div className={cn(
  //         'w-2 h-2 rounded-full',
  //         branch.isBranchOpen ? 'bg-green-500' : 'bg-red-500'
  //       )} />
  //       <span className={cn(
  //         'text-sm font-medium',
  //         branch.isBranchOpen ? 'text-green-600' : 'text-red-600'
  //       )}>
  //         {isOpen ? 'Open' : 'Closed'}
  //       </span>
  //     </div>
  //   );
  // }

  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-2 rounded-lg',
      branch.isBranchOpen ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
    )}>
      {branch.isBranchOpen ? (
        <Clock className="w-4 h-4 text-green-600" />
      ) : (
        <AlertCircle className="w-4 h-4 text-red-600" />
      )}
      
      <div className="flex-1">
        <p className={cn(
          'text-sm font-semibold',
          branch.isBranchOpen ? 'text-green-700' : 'text-red-700'
        )}>
          {branch.isBranchOpen ? 'Open Now' : 'Closed'}
        </p>
        
        {timeRemaining && (
          <p className="text-xs text-gray-600">
            {branch.isBranchOpen 
              ? `Closes in ${formatTimeRemaining(timeRemaining)}`
              : `Opens in ${formatTimeRemaining(timeRemaining)}`
            }
          </p>
        )}
      </div>
      
      <div className="text-right">
        <p className="text-xs text-gray-500">Hours</p>
        {/* <p className="text-xs font-medium text-gray-700">
          {branch.BusinessStartTime} - {branch.BusinessEndTime}
        </p> */}
      </div>
    </div>
  );
}