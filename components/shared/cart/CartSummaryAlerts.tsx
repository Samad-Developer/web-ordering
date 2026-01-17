// components/cart/CartSummaryAlerts.tsx

import React from 'react';
import { AlertCircle, TrendingUp, Truck, Clock } from 'lucide-react';
import { formatPrice } from '@/lib/product/productHelper';

// ============================================
// BRANCH NOT SELECTED ALERT
// ============================================

export function BranchNotSelectedAlert() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
      <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-yellow-700">
          Location Required
        </p>
        <p className="text-xs text-yellow-600 mt-1">
          Please select your delivery location to see delivery charges
        </p>
      </div>
    </div>
  );
}

// ============================================
// BRANCH CLOSED ALERT
// ============================================

interface BranchClosedAlertProps {
  businessHours: string;
}

export function BranchClosedAlert({ businessHours }: BranchClosedAlertProps) {
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-2">
      <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-orange-700">
          Branch Currently Closed
        </p>
        <p className="text-xs text-orange-600 mt-1">
          Business hours: {businessHours}
        </p>
      </div>
    </div>
  );
}

// ============================================
// MINIMUM ORDER ALERT
// ============================================

interface MinimumOrderAlertProps {
  amount: number;
}

export function MinimumOrderAlert({ amount }: MinimumOrderAlertProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-red-700">
          Minimum Order Required
        </p>
        <p className="text-xs text-red-600 mt-1">
          Add {formatPrice(amount)} more to place your order
        </p>
      </div>
    </div>
  );
}

// ============================================
// FREE DELIVERY PROGRESS
// ============================================

interface FreeDeliveryProgressProps {
  amount: number;
  progress: number;
}

export function FreeDeliveryProgress({ 
  amount, 
  progress 
}: FreeDeliveryProgressProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-semibold text-blue-700">
            Almost There!
          </span>
        </div>
        <span className="text-xs font-bold text-blue-600">
          {formatPrice(amount)} to FREE delivery
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full bg-blue-100 rounded-full h-2 overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>

      {/* Progress Text */}
      <p className="text-xs text-blue-600 mt-1.5 text-right">
        {Math.round(progress)}% complete
      </p>
    </div>
  );
}

// ============================================
// FREE DELIVERY BADGE
// ============================================

export function FreeDeliveryBadge() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-3 flex items-center gap-3 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-100/50 to-emerald-100/50 animate-pulse" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center gap-3 w-full">
        <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          <Truck className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1">
          <p className="text-sm font-bold text-green-700 flex items-center gap-1">
            Free Delivery Unlocked! 
            <span className="text-base">🎉</span>
          </p>
          <p className="text-xs text-green-600 mt-0.5">
            You&apos;ve qualified for free delivery on this order
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DELIVERY TIME INFO
// ============================================

interface DeliveryTimeInfoProps {
  timeRange: string;
}

export function DeliveryTimeInfo({ timeRange }: DeliveryTimeInfoProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-600" />
          <span className="text-xs font-medium text-gray-600">
            Estimated Delivery
          </span>
        </div>
        <span className="text-sm font-bold text-gray-900">
          {timeRange}
        </span>
      </div>
    </div>
  );
}