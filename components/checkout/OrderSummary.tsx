// components/checkout/OrderSummary.tsx

'use client';

import React from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectCartItems } from '@/store/slices/cartSlice';
import { calculateCartSummary } from '@/lib/cart/cartHelpers';
import { calculateTax } from '@/lib/checkout/checkoutHelpers';
import { formatPrice } from '@/lib/product/productHelper';
import { getCartItemDisplayName, getCartItemAddonsText } from '@/lib/cart/cartHelpers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export function OrderSummary() {
  const cartItems = useAppSelector(selectCartItems);
  const summary = calculateCartSummary(cartItems);
  const tax = calculateTax(summary.subtotal);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {cartItems.map((item) => {
            const addons = getCartItemAddonsText(item);
            const isExpanded = expandedItems.has(item.cartItemId);

            return (
              <div key={item.cartItemId} className="border-b border-gray-100 pb-3 last:border-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-semibold flex items-center justify-center">
                        {item.customization.quantity}×
                      </span>
                      <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                        {item.productName}
                      </h4>
                    </div>
                    
                    <div className="ml-8 mt-1 space-y-1">
                      <p className="text-xs text-gray-500">
                        {item.sizeName} • {item.flavorName}
                      </p>
                      
                      {/* Addons Toggle */}
                      {addons.length > 0 && (
                        <button
                          type="button"
                          onClick={() => toggleItem(item.cartItemId)}
                          className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                        >
                          <span>{addons.length} add-on{addons.length > 1 ? 's' : ''}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      )}
                      
                      {/* Expanded Addons */}
                      {isExpanded && addons.length > 0 && (
                        <div className="space-y-0.5 pl-2 border-l-2 border-red-200">
                          {addons.map((addon, idx) => (
                            <p key={idx} className="text-xs text-gray-600">
                              + {addon}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <span className="font-semibold text-sm text-gray-900 flex-shrink-0">
                    {formatPrice(item.priceBreakdown.total)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatPrice(summary.subtotal)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (15%)</span>
            <span className="font-medium">{formatPrice(tax)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="font-medium">{formatPrice(summary.deliveryFee)}</span>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(summary.total + tax)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}