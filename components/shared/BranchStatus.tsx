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


    <div className=" flex items-center justify-between gap-6 bg-red-500 text-white px-2 sm:px-4 py-1.5 shadow-lg border border-white/10">

      {/* Icon */}
      <div className="flex items-center justify-center w-6 h-6 ">
      </div>

      {/* Text */}
      <div className="flex-col sm:flex-row items-center gap-2 text-sm">

        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-semibold">Sorry, we are currently closed.</span>
        </div>

        {branch?.BusinessStartTime && (
          <>
            <span className="w-[3px] h-[3px] rounded-full bg-white/40" />
            <span className="text-white/80">
              Opens at{" "}
              <span className="font-semibold text-white">
                {branch.BusinessStartTime}
              </span>
            </span>
          </>
        )}

        {/* Additional message */}
        {/* <span className=" text-white/80 text-[13px] mt-1 sm:mt-0 sm:ml-2">
          You can still browse our menu or come back later to place your order.
        </span> */}
      </div>

      {/* Close */}
      <button
        onClick={() => setDismissed(true)}
        className="cursor-pointer ml-1 p-1 rounded-full bg-white transition self-end"
        aria-label="Close"
      >
        <X className="w-4 h-4 text-red-500" />
      </button>

    </div>

  );
}