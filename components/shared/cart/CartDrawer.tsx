"use client";

import { useAppSelector } from "@/store/hooks";
import { X, ShoppingCart, Plus } from "lucide-react";
import { selectCartItems, selectIsCartOpen } from "@/store/slices/cartSlice";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CartItem } from "./CartItem";
import { EmptyCart } from "./EmptyCart";
import { PriceSummary } from "./PriceSummary";
import { useAppDispatch } from "@/store/hooks";
import { toggleCart } from "@/store/slices/cartSlice";
import { useTranslations } from "next-intl";
import { CheckoutButton } from "./CheckoutButton";
import { useBranchValidation } from "@/hooks/useBranchValidation";
import { useCartTotals } from "@/hooks/useCartTotals";
import {
  BranchNotSelectedAlert,
  MinimumOrderAlert,
  FreeDeliveryProgress,
  FreeDeliveryBadge,
  DeliveryTimeInfo,
} from './CartSummaryAlerts';
import { PromotionalItems } from "./PromotionalItems";

export function CartDrawer() {

  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const isCartOpen = useAppSelector(selectIsCartOpen);
  const t = useTranslations("cart")

  const branch = useBranchValidation();
  const totals = useCartTotals();

  return (
    <Sheet
      open={isCartOpen}
      onOpenChange={(value) => dispatch(toggleCart(value))}
    >
      <SheetContent
        side="right"
        className="w-full sm:max-w-sm p-0 sm:p-1 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="px-2 py-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold flex items-center gap-3">
              
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>

              <div className="flex flex-col">
              {t("title")}
              {cartItems.length > 0 && (
                <span className="text-[14px] text-gray-400">
                  {cartItems.length} items
                </span>
              )}
              </div>
            </SheetTitle>
            <button
              className="bg-gray-100 text-gray-700 font-extrabold rounded-full hover:text-shadow-header-profile-text cursor-pointer p-2 hover:scale-105 transition-transform"
              onClick={() => dispatch(toggleCart(false))}
            >
              <X className="h-4 w-4 font-extrabold" strokeWidth={4} />
            </button>
          </div>
        </SheetHeader>

        {/* Content */}
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-2">
              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <CartItem key={item.cartItemId} item={item} isLast={index === cartItems.length - 1} />
                ))}
              </div>

              {/* Promotional items */}
              <div className="mt-2 border-t py-4">
                <PromotionalItems />
              </div>

              {/* Add More Items Button */}
              <button
                className="flex items-center justify-center gap-2 w-full mt-4 p-3 rounded-xl border-2 border-dashed cursor-pointer"
                onClick={() => {
                  dispatch(toggleCart(false));
                }}
              >
                <Plus className="h-4 w-4" />

                {t("addMoreItems")}
              </button>

              {/* Alerts & Notifications */}
              <div className='space-y-4 my-4'>
                {!branch.hasBranch && <BranchNotSelectedAlert />}

                {branch.hasBranch && !totals.meetsMinimumOrder && (
                  <MinimumOrderAlert amount={totals.amountToMinimum} />
                )}

                {branch.hasBranch &&
                  totals.meetsMinimumOrder &&
                  totals.amountToFreeDelivery > 0 &&
                  branch.isDeliveryMode && (
                    <FreeDeliveryProgress
                      amount={totals.amountToFreeDelivery}
                      progress={totals.freeDeliveryProgress}
                    />
                  )}

                {totals.isFreeDelivery && branch.isDeliveryMode && (
                  <FreeDeliveryBadge />
                )}

                {totals.deliveryTimeRange && branch.isDeliveryMode && (
                  <DeliveryTimeInfo timeRange={totals.deliveryTimeRange} />
                )}
              </div>


              <PriceSummary variant="cart" />
            </div>

            {/* Footer - Summary & Checkout */}
            <div className="p-2 pb-3 border-t">
              <div className="p-1">
                <CheckoutButton />
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
