"use client";

import { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { Separator } from "@/components/ui/separator";
import { PriceSummary } from "../shared/cart/PriceSummary";
import { formatPrice } from "@/lib/product/productHelper";
import { selectCartItems } from "@/store/slices/cartSlice";
import { getCartItemAddonsText } from "@/lib/cart/cartHelpers";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { getImageUrl } from "@/lib/image/imageUtils";

interface OrderSummaryProps {
  showPaymentDetails?: boolean;
  variant?: "checkout" | "success";
}

export function OrderSummary({ showPaymentDetails = true, variant = "checkout" }: OrderSummaryProps) {
  const t = useTranslations("checkout")
  const cartItems = useAppSelector(selectCartItems);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Dynamic border styling based on variant
  const containerBorderClass = variant === "checkout" ? "shadow-sm" : variant === "success" ? "border-2 " : "border";

  return (
    <div className={` bg-white rounded-lg ${containerBorderClass}`}>
      <h2 className="px-6 pt-6 text-lg font-semibold text-gray-700 tracking-wide mb-2">
        {t("orderSummary")}
      </h2>
      <div className="">
        <div className="space-y-4">
          {/* Cart Items */}
          <div className="space-y-3 max-h-[400px] px-6 pb-6 pt-2 overflow-y-auto">
            {cartItems.map((item) => {
              const addons = getCartItemAddonsText(item);
              const isExpanded = expandedItems.has(item.cartItemId);
              const hasDiscount = !!item.discount;
              const imageSrc = getImageUrl(item.productImage);

              return (
                <div
                  key={item.cartItemId}
                  className="border-b border-gray-100 pb-2 last:border-0"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                          <Image
                            alt={item.productName}
                            src={imageSrc}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex flex-col">
                          <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                            {item.customization.quantity} × {item.productName}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {item.sizeName && item.sizeName !== "-" ? item.sizeName : ""}
                            {item.sizeName && item.sizeName !== "-" && item.flavorName && item.flavorName !== "-" ? " • " : ""}
                            {item.flavorName && item.flavorName !== "-" ? item.flavorName : ""}
                          </p>
                        </div>
                      </div>

                      {addons.length > 0 && (
                        <div className="py-2 px-1 space-y-1">

                          {/* Addons Toggle */}
                          <button
                            type="button"
                            onClick={() => toggleItem(item.cartItemId)}
                            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                          >
                            <span>
                              {addons.length} add-on{addons.length > 1 ? "s" : ""}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>

                          {/* Expanded Addons */}
                          {isExpanded && (
                            <div className="space-y-0.5 pl-2 border-l-2 border-red-200">
                              {addons.map((addon, idx) => (
                                <p key={idx} className="text-xs text-gray-600">
                                  + {addon}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <span className="font-semibold text-sm text-gray-900 flex-shrink-0">
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
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show cart summary and separator only if showCartDetails is true */}
          {showPaymentDetails && (
            <div className="p-5">
              <Separator className="bg-gray-500 mb-4" />
              <PriceSummary variant="checkout" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
