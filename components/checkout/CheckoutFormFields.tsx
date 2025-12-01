
'use client';

import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { CheckoutFormData, OrderMode } from '@/types/checkout.types';
import { TITLE_OPTIONS } from '@/lib/checkout/checkoutHelpers';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Gift } from 'lucide-react';

interface CheckoutFormFieldsProps {
  form: UseFormReturn<CheckoutFormData>;
  orderMode: OrderMode;
  isGift: boolean;
  onGiftToggle: (checked: boolean) => void;
}

export function CheckoutFormFields({
  form,
  orderMode,
  isGift,
  onGiftToggle,
}: CheckoutFormFieldsProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      {/* Customer Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>

        {/* Title & Full Name */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    id="title"
                     className={`w-full ${errors.title ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {TITLE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Full Name */}
          <div className="sm:col-span-3 space-y-2">
            <Label htmlFor="fullName">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register('fullName')}
              id="fullName"
              placeholder="John Doe"
              className={errors.fullName ? 'border-red-500' : ''}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">{errors.fullName.message}</p>
            )}
          </div>
        </div>

        {/* Mobile Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Mobile Number */}
          <div className="space-y-2">
            <Label htmlFor="mobileNumber">
              Mobile Number <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register('mobileNumber')}
              id="mobileNumber"
              type="tel"
              placeholder="03xx-xxxxxxx"
              className={errors.mobileNumber ? 'border-red-500' : ''}
            />
            {errors.mobileNumber && (
              <p className="text-xs text-red-500">{errors.mobileNumber.message}</p>
            )}
          </div>

          {/* Alternate Mobile Number */}
          <div className="space-y-2">
            <Label htmlFor="alternateMobileNumber">
              Alternate Mobile Number
            </Label>
            <Input
              {...register('alternateMobileNumber')}
              id="alternateMobileNumber"
              type="tel"
              placeholder="03xx-xxxxxxx"
              className={errors.alternateMobileNumber ? 'border-red-500' : ''}
            />
            {errors.alternateMobileNumber && (
              <p className="text-xs text-red-500">
                {errors.alternateMobileNumber.message}
              </p>
            )}
          </div>
        </div>

        {/* Email Address */}
        <div className="space-y-2">
          <Label htmlFor="emailAddress">Email Address</Label>
          <Input
            {...register('emailAddress')}
            id="emailAddress"
            type="email"
            placeholder="john.doe@example.com"
            className={errors.emailAddress ? 'border-red-500' : ''}
          />
          {errors.emailAddress && (
            <p className="text-xs text-red-500">{errors.emailAddress.message}</p>
          )}
        </div>
      </div>

      {/* Delivery Information (Delivery Mode Only) */}
      {orderMode === 'delivery' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Delivery Information</h3>

          {/* Delivery Address */}
          <div className="space-y-2">
            <Label htmlFor="deliveryAddress">
              Delivery Address <span className="text-red-500">*</span>
            </Label>
            <Textarea
              {...register('deliveryAddress')}
              id="deliveryAddress"
              placeholder="House #, Street, Area, City"
              rows={3}
              className={errors.deliveryAddress ? 'border-red-500' : ''}
            />
            {errors.deliveryAddress && (
              <p className="text-xs text-red-500">{errors.deliveryAddress.message}</p>
            )}
          </div>

          {/* Nearest Landmark */}
          <div className="space-y-2">
            <Label htmlFor="nearestLandmark">Nearest Landmark</Label>
            <Input
              {...register('nearestLandmark')}
              id="nearestLandmark"
              placeholder="e.g., Near XYZ Mall"
              className={errors.nearestLandmark ? 'border-red-500' : ''}
            />
            {errors.nearestLandmark && (
              <p className="text-xs text-red-500">{errors.nearestLandmark.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Delivery Instructions */}
      <div className="space-y-2">
        <Label htmlFor="deliveryInstructions">
          {orderMode === 'delivery' ? 'Delivery' : 'Pickup'} Instructions
        </Label>
        <Textarea
          {...register('deliveryInstructions')}
          id="deliveryInstructions"
          placeholder={
            orderMode === 'delivery'
              ? 'Any special instructions for delivery...'
              : 'Any special instructions for pickup...'
          }
          rows={3}
          className={errors.deliveryInstructions ? 'border-red-500' : ''}
        />
        {errors.deliveryInstructions && (
          <p className="text-xs text-red-500">{errors.deliveryInstructions.message}</p>
        )}
      </div>

      {/* Send as Gift (Delivery Only) */}
      {orderMode === 'delivery' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
            <Checkbox
              id="isGift"
              checked={isGift}
              onCheckedChange={onGiftToggle}
            />
            <div className="flex-1">
              <Label
                htmlFor="isGift"
                className="flex items-center gap-2 cursor-pointer font-medium text-gray-900"
              >
                <Gift className="w-5 h-5 text-pink-500" />
                Send as a Gift
              </Label>
              <p className="text-xs text-gray-600 mt-1">
                Add gifting details for the recipient
              </p>
            </div>
          </div>

          {/* Gift Details */}
          {isGift && (
            <div className="space-y-4 pl-4 border-l-4 border-pink-300 bg-pink-50/50 p-4 rounded-r-lg">
              <h4 className="text-sm font-semibold text-gray-900">Gifting Details</h4>

              {/* Recipient Name */}
              <div className="space-y-2">
                <Label htmlFor="recipientName">
                  Recipient Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register('recipientName')}
                  id="recipientName"
                  placeholder="Jane Doe"
                  className={errors.recipientName ? 'border-red-500' : ''}
                />
                {errors.recipientName && (
                  <p className="text-xs text-red-500">{errors.recipientName.message}</p>
                )}
              </div>

              {/* Recipient Number */}
              <div className="space-y-2">
                <Label htmlFor="recipientNumber">
                  Recipient Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register('recipientNumber')}
                  id="recipientNumber"
                  type="tel"
                  placeholder="03xx-xxxxxxx"
                  className={errors.recipientNumber ? 'border-red-500' : ''}
                />
                {errors.recipientNumber && (
                  <p className="text-xs text-red-500">{errors.recipientNumber.message}</p>
                )}
              </div>

              {/* Gifting Message */}
              <div className="space-y-2">
                <Label htmlFor="giftingMessage">Gifting Message</Label>
                <Textarea
                  {...register('giftingMessage')}
                  id="giftingMessage"
                  placeholder="Happy Birthday! Enjoy your meal..."
                  rows={3}
                  className={errors.giftingMessage ? 'border-red-500' : ''}
                />
                {errors.giftingMessage && (
                  <p className="text-xs text-red-500">{errors.giftingMessage.message}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}