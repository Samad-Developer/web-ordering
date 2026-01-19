'use client';

import React from 'react';
import { XCircle } from 'lucide-react';
import { useBranchValidation } from '@/hooks/useBranchValidation';

export function BranchStatus() {
  const branch = useBranchValidation();

   if (!branch.hasBranch || !branch.businessStartTime || branch.isBranchOpen) {
    return null;
  }

  return (
    <div className="relative w-full bg-gradient-to-br from-red-500 via-red-500 to-rose-600 overflow-hidden shadow-md">
      {/* Subtle overlay pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-white">
          {/* Icon & Message */}
          <div className="flex items-center gap-2.5">
            <XCircle className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
            <p className="text-sm font-medium">
              We&lsquo;re currently closed and not accepting orders
            </p>
          </div>

          {/* Separator (desktop only) */}
          <div className="hidden sm:block w-1 h-1 rounded-full bg-white/40" />

          {/* Reopening time */}
          <p className="text-sm font-semibold">
            Reopens at {branch.businessStartTime}
          </p>
        </div>
      </div>
    </div>
  );
}