"use client";

import { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { Separator } from "@/components/ui/separator";
import { PriceSummary } from "../shared/cart/PriceSummary";
import { formatPrice } from "@/lib/product/productHelper";
import { selectCartItems } from "@/store/slices/cartSlice";
import { getCartItemAddonsText } from "@/lib/cart/cartHelpers";
import { ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const containerBorderClass =
    variant === "checkout"
      ? " shadow-md"
      : variant === "success"
        ? "border-2 "
        : "border";

  return (
    <div className={`rounded-xl ${containerBorderClass}`}>
      <div className="flex items-center gap-2 bg-gray-200 p-4 rounded-t-lg border-b">
        <ShoppingBag className="w-6 h-6 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-800 tracking-wide">
          {t("orderSummary")}
        </h2>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {/* Cart Items */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {cartItems.map((item) => {
              const addons = getCartItemAddonsText(item);
              const isExpanded = expandedItems.has(item.cartItemId);
              const hasDiscount = !!item.discount;

              return (
                <div
                  key={item.cartItemId}
                  className="border-b border-gray-100 pb-3 last:border-0"
                >
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
                            <span>
                              {addons.length} add-on
                              {addons.length > 1 ? "s" : ""}
                            </span>
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
            <>
              <Separator />
              <PriceSummary variant="checkout" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
