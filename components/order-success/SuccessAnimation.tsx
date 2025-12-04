"use client";

import React from "react";
import { Check, Sparkles, Hash } from "lucide-react";
import { OrderTimeline } from "./OrderTimeline";

interface SuccessAnimationProps {
  orderNumber: string;
  orderTime: string;
  estimatedTime: string;
}

export function SuccessAnimation({
  orderNumber,
  orderTime,
  estimatedTime,
}: SuccessAnimationProps) {
  return (
    <div className="relative py-10 flex flex-col items-center text-center overflow-hidden bg-green-50 rounded-xl p-6 mx-auto">
      {/* SUCCESS ICON */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-24 h-24 flex items-center justify-center bg-green-100 rounded-full shadow-inner">
          <Check
            className="w-16 h-16 text-green-500 animate-scale-in"
            strokeWidth={2}
          />
        </div>
      </div>

      {/* MAIN TEXT */}
      <div className="relative z-10 mt-6 space-y-1 animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold text-green-600">
          Order Placed Successfully
        </h1>
        <p className="text-sm text-gray-600">
          Thank you for your order. We’re preparing your delicious meal.
        </p>
      </div>

      {/* ORDER NUMBER – UNIQUE STYLE */}
      <div className="mt-5">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-white border border-green-200 shadow-sm rounded-full">
          <Hash className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-green-700 tracking-wide">
            Order No: {orderNumber}
          </span>
        </div>
      </div>

      {/* ORDER TIMELINE */}
      <OrderTimeline estimatedDelivery={estimatedTime}/>
    </div>
  );
}

/* Reusable small info box */
function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
      <p className="text-xs uppercase text-gray-500 font-semibold">{label}</p>
      <p className="text-sm font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );
}
