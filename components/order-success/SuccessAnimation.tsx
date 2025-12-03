'use client';

import React from 'react';
import { Check, Sparkles } from 'lucide-react';

export function SuccessAnimation() {
  return (
    <div className="relative py-16 flex flex-col items-center text-center overflow-hidden bg-green-50 rounded-xl p-8">

      {/* Success Icon */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-32 h-32 flex items-center justify-center bg-green-100 rounded-full">

          <Check className="relative w-24 h-24 text-green-500 animate-scale-in" strokeWidth={2} />
        </div>
      </div>

      {/* Text */}
      <div className="relative z-10 mt-10 space-y-2 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-green-600">
          Order Placed Successfully!
        </h1>
        <p className="text-lg text-gray-600">
          Thank you for your order! We're preparing your delicious meal.
        </p>
      </div>
    </div>
  );
}
