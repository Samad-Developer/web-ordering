'use client';

import { useState } from 'react';
import { X, Clock, AlertTriangle } from 'lucide-react';
import { useFreshBranchStatus } from '@/hooks/useFreshBranchStatus';

export function BranchStatus() {
  const { branch, isBranchOpen, businessStartTime } = useFreshBranchStatus();
  const [dismissed, setDismissed] = useState(false);

  // ✅ Show only when closed
  if (!branch || isBranchOpen || dismissed) return null;

  return (
    <div className="relative bg-gradient-to-r from-rose-600 via-red-500 to-orange-400 text-white px-4 sm:px-6 py-2 shadow-xl border border-white/10">

      {/* Center Content */}
      <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-2 text-sm pr-8 sm:pr-12">

        {/* Icon + Heading */}
        <div className="flex items-center gap-2 shrink-0">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-semibold whitespace-nowrap">
            We’re currently closed.
          </span>
        </div>



        {/* Opening Time */}
        {branch?.BusinessStartTime && (
          <>
            <span className="text-white/90 whitespace-nowrap">
              Opens at{" "}
              <span className="font-semibold text-white">
                {branch.BusinessStartTime}
              </span>
            </span>
          </>
        )}

        {/* Extra Text */}
        <span className="text-white/80 text-[13px] sm:whitespace-nowrap">
          You can still explore our menu and plan your order for later.
        </span>

      </div>

      {/* Close Button */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 sm:top-1 sm:right-3 p-1 hover:opacity-80 transition cursor-pointer"
        aria-label="Close"
      >
        <X className="w-6 h-6 text-white" />
      </button>

    </div>
  );
}