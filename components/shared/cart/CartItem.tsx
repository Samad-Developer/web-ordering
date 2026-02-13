"use client";

import { useState } from "react";
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
import { getCartItemAddons, getCartItemAddonsText } from "@/lib/cart/cartHelpers";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
import { getImageUrl } from "@/lib/image/imageUtils";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const dispatch = useAppDispatch();
  const t = useTranslations("cart");
  const [showAddons, setShowAddons] = useState(false);

  const addons = getCartItemAddons(item);
  const hasAddons = addons.length > 0;
  const hasDiscount = !!item.discount;

  const handleIncrement = () => {
    dispatch(incrementItem(item.cartItemId));
  };

  const handleDecrement = () => {
    dispatch(decrementItem(item.cartItemId));
  };

  const handleRemove = () => {
    dispatch(removeItem(item.cartItemId));
  };

  const imageSrc = getImageUrl(item.productImage, '/assets/images/products/product.webp');

  return (
    <div className="bg-whiteoverflow-hidden">
      <div className="flex gap-3 px-1.5">
        {/* Product Image */}
        <div className="relative w-18 h-18 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
          <Image
            src={imageSrc}
            alt={item.productName}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1  items-center min-w-0">
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
            <div className="flex flex-col gap-0.5">
              {hasDiscount ? (
                <div className="flex gap-2 items-baseline">
                  {/* Original Price - Line Through */}
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(item.priceBreakdown.originalBasePrice)}
                  </span>

                  {/* Discounted Price - Green */}
                  <span className="text-base font-bold text-gray-800">
                    {formatPrice(item.priceBreakdown.basePrice)}
                  </span>
                </div>
              ) : (
                /* No Discount - Normal Price */
                <span className="text-base font-bold text-gray-900">
                  {formatPrice(item.priceBreakdown.basePrice)}
                </span>
              )}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 border">
              {item.customization.quantity === 1 ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleRemove}
                >
                  <Trash2 className="h-3.5 w-3.5s" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-gray-200 rounded-full"
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
                className="h-6 w-6 hover:bg-white rounded-full"
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
        <div className="px-3 py-2">
          {/* Toggle Button */}
          <button
            onClick={() => setShowAddons(!showAddons)}
            className="flex items-center justify-between w-full text-sm text-red-600 cursor-pointer"
          >
            <span className="font-regular">
              {hasAddons && `View ${t("addons")}`}
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
                      className="w-full flex items-center justify-between gap-2 text-xs text-gray-600"
                    >
                      
                      <span>+ {addon.name} {addon.quantity > 1 ? `(${addon.quantity}x)` : ''}</span>
                      {addon.price > 0 ? <span> + Rs {addon.price}</span> : '-'}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <Separator className="bg-gray-200 h-[1px] w-full mt-1" />
    </div>
  );
}
