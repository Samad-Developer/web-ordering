'use client';

import React from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CurrentLocationButton() {
  return (
    <Button
      type="button"
      onClick={() => {}}
      disabled={false}
      className={cn(
        'w-full max-w-md mx-auto h-8 rounded-full gap-2',
        'bg-red-500 hover:bg-red-600 text-white font-semibold',
        'shadow-lg hover:shadow-xl transition-all'
      )}
    >
      {false ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Detecting Location...
        </>
      ) : (
        <>
          <MapPin className="w-5 h-5" />
          Use Current Location
        </>
      )}
    </Button>
  );
}