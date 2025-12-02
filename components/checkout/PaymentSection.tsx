'use client';

import React from 'react';
import { Banknote, CreditCard } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { CheckoutFormData, PaymentMethod } from '@/types/checkout.types';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '../ui/label';

interface PaymentSectionProps {
  form: UseFormReturn<CheckoutFormData>;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
}

export function PaymentSection({ 
  form, 
  paymentMethod, 
  onPaymentMethodChange 
}: PaymentSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>

      {/* Payment Method Selection */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onPaymentMethodChange('cash')}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
            paymentMethod === 'cash'
              ? "border-green-500 bg-green-50"
              : "border-gray-200 hover:border-gray-300 bg-white"
          )}
        >
          <Banknote className={cn(
            "w-6 h-6",
            paymentMethod === 'cash' ? "text-green-600" : "text-gray-400"
          )} />
          <span className={cn(
            "font-medium text-sm",
            paymentMethod === 'cash' ? "text-green-700" : "text-gray-700"
          )}>
            Cash on Delivery
          </span>
        </button>

        <button
          type="button"
          onClick={() => onPaymentMethodChange('online')}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
            paymentMethod === 'online'
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300 bg-white"
          )}
        >
          <CreditCard className={cn(
            "w-6 h-6",
            paymentMethod === 'online' ? "text-blue-600" : "text-gray-400"
          )} />
          <span className={cn(
            "font-medium text-sm",
            paymentMethod === 'online' ? "text-blue-700" : "text-gray-700"
          )}>
            Online Payment
          </span>
        </button>
      </div>

      {/* Change Request (Cash Only) */}
      {paymentMethod === 'cash' && (
        <div className="space-y-2">
          <Label htmlFor="changeAmount">
            Change Request (Optional)
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              Rs.
            </span>
            <Input
              {...form.register('changeAmount', { valueAsNumber: true })}
              id="changeAmount"
              type="number"
              placeholder="500"
              className="pl-10"
            />
          </div>
          <p className="text-xs text-gray-500">
            Enter the amount you&apos;ll pay for change preparation
          </p>
        </div>
      )}
    </div>
  );
}