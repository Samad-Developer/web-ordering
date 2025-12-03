'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, MessageSquare, Gift } from 'lucide-react';

interface DeliveryInfoProps {
  deliveryData: {
    orderMode: 'delivery' | 'pickup';
    deliveryAddress?: string;
    nearestLandmark?: string;
    deliveryInstructions?: string;
    estimatedTime: string;
    isGift?: boolean;
    giftDetails?: {
      recipientName: string;
      recipientNumber: string;
      giftingMessage?: string;
    };
  };
}

export function DeliveryInfo({ deliveryData }: DeliveryInfoProps) {
  return (
    <div className="animate-fade-in-up">
      <Card className="border-2 hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5 text-green-500" />
            {deliveryData.orderMode === 'delivery' ? 'Delivery' : 'Pickup'} Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Estimated Time */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
            <Clock className="w-5 h-5 text-orange-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-600 font-medium">Estimated Time</p>
              <p className="text-sm font-bold text-orange-600">{deliveryData.estimatedTime}</p>
            </div>
          </div>

          {/* Delivery Address */}
          {deliveryData.orderMode === 'delivery' &&
            deliveryData.deliveryAddress && (
              <>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-medium">Delivery Address</p>
                  <p className="text-sm text-gray-900">
                    {deliveryData.deliveryAddress}
                  </p>
                </div>

                {deliveryData.nearestLandmark && (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 font-medium">Nearest Landmark</p>
                    <p className="text-sm text-gray-900">
                      {deliveryData.nearestLandmark}
                    </p>
                  </div>
                )}
              </>
            )}

          {/* Instructions */}
          {deliveryData.deliveryInstructions && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-500 font-medium">
                  Special Instructions
                </p>
              </div>
              <p className="text-sm text-gray-900 pl-6">
                {deliveryData.deliveryInstructions}
              </p>
            </div>
          )}

          {/* Gift Details */}
          {deliveryData.isGift && deliveryData.giftDetails && (
            <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200 space-y-2">
              <div className="flex items-center gap-2 text-pink-600 font-medium">
                <Gift className="w-4 h-4" />
                <span className="text-sm">Gift Order</span>
              </div>

              <div className="space-y-1 pl-6">
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Recipient:</span>{' '}
                  {deliveryData.giftDetails.recipientName}
                </p>

                <p className="text-xs text-gray-600">
                  <span className="font-medium">Contact:</span>{' '}
                  {deliveryData.giftDetails.recipientNumber}
                </p>

                {deliveryData.giftDetails.giftingMessage && (
                  <p className="text-xs text-gray-600 italic">
                    "{deliveryData.giftDetails.giftingMessage}"
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
