// components/cart/CartItem.tsx

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { CartItem as CartItemType } from "@/types/cart.types";
import { useAppDispatch } from "@/store/hooks";
import {
  incrementItem,
  decrementItem,
  removeItem,
} from "@/store/slices/cartSlice";
import { formatPrice } from "@/lib/product/productHelper";
import {
  getCartItemDisplayName,
  getCartItemAddonsText,
} from "@/lib/cart/cartHelpers";
import { Button } from "@/components/ui/button";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const dispatch = useAppDispatch();
  const [showAddons, setShowAddons] = useState(false);

  const addons = getCartItemAddonsText(item);
  const hasAddons = addons.length > 0;

  const handleIncrement = () => {
    dispatch(incrementItem(item.cartItemId));
  };

  const handleDecrement = () => {
    dispatch(decrementItem(item.cartItemId));
  };

  const handleRemove = () => {
    dispatch(removeItem(item.cartItemId));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex gap-3 p-3">
        {/* Product Image */}
        <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
          <Image
            src="/assets/images/products/product.webp"
            alt={item.productName}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 items-center min-w-0">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
            {item.productName}
          </h3>

          {/* Size & Flavor */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-700 py-0.5 rounded">
              {item.sizeName}
            </span>
            <span className="text-xs text-gray-700 py-0.5 rounded">
              {item.flavorName}
            </span>
          </div>

          {/* Price */}
          <div className=" flex items-center justify-between">
            <span className="text-base font-bold text-gray-900">
              {formatPrice(item.priceBreakdown.basePrice)}
            </span>

      

            {/* Quantity Controls */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 border">
              {item.customization.quantity === 1 ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleRemove}
                >
                  <Trash2 className="h-3.5 w-3.5s" />

                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-gray-200 rounded-full"
                  onClick={handleDecrement}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
              )}

              <span className="text-sm font-semibold text-gray-900 min-w-[20px] text-center">
                {item.customization.quantity}
              </span>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-white rounded-full"
                onClick={handleIncrement}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Addons & Special Instructions */}
      {hasAddons && (
        <div className="border-t border-gray-100 px-3 py-2 bg-gray-50">
          {/* Toggle Button */}
          <button
            onClick={() => setShowAddons(!showAddons)}
            className="flex items-center justify-between w-full text-sm text-gray-600 hover:text-gray-900"
          >
            <span className="font-medium">
              {hasAddons &&
                `${addons.length} add-on${addons.length > 1 ? "s" : ""}`}
            </span>
            {showAddons ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {/* Expanded Details */}
          {showAddons && (
            <div className="mt-2 space-y-1">
              {/* Addons List */}
              {hasAddons && (
                <div className="space-y-1">
                  {addons.map((addon, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs text-gray-600"
                    >
                      <span className="w-1 h-1 rounded-full bg-gray-400" />
                      <span>{addon}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
