'use client';

import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { UseFormReturn } from 'react-hook-form';
import { CreditCard, AlertCircle } from 'lucide-react';
import { selectAddressApiData, setPaymentMethod, selectPaymentMethod } from '@/store/slices/addressSlice';
import { CheckoutFormData } from '@/types/checkout.types';
import React from 'react';

interface PaymentSectionProps {
  form: UseFormReturn<CheckoutFormData>;
}

export function PaymentSection({ form }: PaymentSectionProps) {
  const dispatch = useAppDispatch();
  const t = useTranslations("checkout")
  const config = useAppSelector(selectAddressApiData);
  const paymentMethod = useAppSelector(selectPaymentMethod);

  // Extract payment modes from backend
  const paymentModes = config?.dataPayload?.Theme?.Settings?.PaymentModes;

  // Fallback if no payment modes
  if (!paymentModes || paymentModes.length === 0) {
    return (
      <div className="p-6 border rounded-lg bg-yellow-50 text-yellow-800 flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        "No payment modes available. Please create one in the backend."
      </div>
    );
  }

  // Map icons for known payment types
  const paymentIcons: Record<string, React.ReactNode> = {
    CASH: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="1" y="5" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="4" cy="10" r="0.8" fill="currentColor" />
        <circle cx="16" cy="10" r="0.8" fill="currentColor" />
        <line x1="1" y1="7.5" x2="4.5" y2="7.5" stroke="currentColor" strokeWidth="1" />
        <line x1="15.5" y1="7.5" x2="19" y2="7.5" stroke="currentColor" strokeWidth="1" />
        <line x1="1" y1="12.5" x2="4.5" y2="12.5" stroke="currentColor" strokeWidth="1" />
        <line x1="15.5" y1="12.5" x2="19" y2="12.5" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
    CARD: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="1" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="1" y1="7.5" x2="19" y2="7.5" stroke="currentColor" strokeWidth="1.2" />
        <line x1="1" y1="10" x2="19" y2="10" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="4.5" cy="13" r="0.7" fill="currentColor" />
        <circle cx="6.5" cy="13" r="0.7" fill="currentColor" />
        <circle cx="8.5" cy="13" r="0.7" fill="currentColor" />
        <rect x="13" y="11.5" width="4" height="2.5" rx="0.5" stroke="currentColor" strokeWidth="0.9" />
      </svg>
    ),
    OnlineTransaction: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.2" />
        <polyline points="7,11 10,7 13,11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="10" y1="7" x2="10" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  };

  const handlePaymentMethod = (mode: string) => {
    dispatch(setPaymentMethod(mode as 'CASH' | 'CARD' | 'OnlineTransaction'));
    form.setValue('paymentMethod', mode as 'CASH' | 'CARD' | 'OnlineTransaction');

    // Clear changeAmount when switching away from CASH
    if (mode !== 'CASH') {
      form.setValue('changeAmount', undefined);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900">{t('paymentMethod')}</h3>

      {/* Payment Method Selection */}
      <div className="grid grid-cols-3 gap-3">
        {paymentModes.map((mode) => {
          const isSelected = paymentMethod === mode.PaymentMode;
          const icon = paymentIcons[mode.PaymentMode] || <CreditCard className="w-6 h-6 text-gray-400" />;

          return (
            <button
              key={mode.PaymentModeId}
              type="button"
              onClick={() => handlePaymentMethod(mode.PaymentMode)}
              className={cn(
                'relative flex flex-col items-start gap-1.5 p-3.5 rounded-xl border text-left transition-all',
                isSelected
                  ? 'border-[0.5px] border-blue-500 bg-blue-50'
                  : 'border-[0.5px] border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              {/* Checkmark */}
              {isSelected && (
                <div
                  className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg z-10 border-2 border-white"
                >
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}

              {/* Icon */}
              <span className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center mb-0.5',
                isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
              )}>
                {icon}
              </span>

              <span className={cn('text-sm font-medium leading-tight', isSelected ? 'text-blue-700' : 'text-gray-800')}>
                {mode.PaymentMode === 'OnlineTransaction' ? 'Online' : mode.PaymentMode === 'CASH' ? 'Cash' : 'Card'}
              </span>
              <span className="text-[11px] text-gray-400">
                {mode.PaymentMode === 'CASH' ? 'Pay on delivery' : mode.PaymentMode === 'CARD' ? 'Debit or credit' : 'Bank transfer'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Description block — shows when selected mode has a description */}
      {(() => {
        const activeMode = paymentModes.find((m) => m.PaymentMode === paymentMethod);
        if (!activeMode?.Description) return null;

        return (
          <div className="rounded-lg border-[0.5px] border-l-[3px] border-green-600 border-l-green-600 bg-gray-50 px-4 py-3 space-y-2">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                <circle cx="7" cy="7" r="6.5" stroke="#0F6E56" strokeWidth="1" />
                <rect x="6.4" y="3" width="1.2" height="1.2" rx="0.6" fill="#0F6E56" />
                <rect x="6.4" y="5.5" width="1.2" height="5" rx="0.6" fill="#0F6E56" />
              </svg>
              <span className="text-xs font-medium text-green-800">How to pay</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {activeMode.Description}
            </p>

            {/* WhatsApp hint — shown for OnlineTransaction or when Description mentions WhatsApp */}
            {paymentMethod === 'OnlineTransaction' && (
              <span className="inline-flex items-center gap-1.5 mt-1 px-3 py-1.5 rounded-full bg-green-50 text-xs font-medium text-green-800">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6.5" fill="#25D366" />
                  <path d="M4.5 9.5C5.5 10 6.5 10.2 7.5 10C9.5 9.5 11 7.8 11 6C11 4 9.5 2.5 7.5 2.5C5.2 2.5 3.5 4.2 3.5 6.5C3.5 7.3 3.8 8 4.2 8.6L3.8 10.2L5.2 9.8" stroke="white" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
                Share screenshot on WhatsApp
              </span>
            )}
          </div>
        );
      })()}


      {/* Change Request (Cash Only) */}
      {paymentMethod === 'CASH' && (
        <div className="space-y-2">
          <Label htmlFor="changeAmount">
            {t('changeRequest')}
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              Rs.
            </span>
            <Input
              {...form.register('changeAmount', { valueAsNumber: true })}
              id="changeAmount"
              type="number"
              placeholder={t('placeholders.changeAmount')}
              className="pl-10"
            />
          </div>
          <p className="text-xs text-gray-500">
            {t('changeRequestHelp')}
          </p>
        </div>
      )}
    </div>
  );
}