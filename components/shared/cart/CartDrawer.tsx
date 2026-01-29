"use client";

import { useAppSelector } from "@/store/hooks";
import { X, ShoppingBag } from "lucide-react";
import { selectCartItems, selectIsCartOpen } from "@/store/slices/cartSlice";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CartItem } from "./CartItem";
import { EmptyCart } from "./EmptyCart";
import { CartSummary } from "./CartSummary";
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

export function CartDrawer() {

  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const isCartOpen = useAppSelector(selectIsCartOpen);
  const t = useTranslations("cart")

  const branch = useBranchValidation();
  const totals = useCartTotals();

  const amountToMinimum = branch.hasBranch
    ? branch.getAmountToMinimum(totals.subtotal)
    : 0;

  const amountToFreeDelivery = branch.hasBranch && branch.isDeliveryMode
    ? branch.getAmountToFreeDelivery(totals.subtotal)
    : 0;

  const freeDeliveryProgress = branch.hasBranch
    ? branch.getFreeDeliveryProgress(totals.subtotal)
    : 0;

  const isFreeDelivery = branch.hasBranch && branch.isDeliveryMode
    ? branch.isFreeDelivery(totals.subtotal)
    : false;


  return (
    <Sheet
      open={isCartOpen}
      onOpenChange={(value) => dispatch(toggleCart(value))}
    >
      <SheetContent
        side="right"
        className="w-full sm:max-w-sm p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold flex items-center gap-2">
              <ShoppingBag className="h-6 w-6" />
              {t("title")}{" "}
            </SheetTitle>
            <button
              className="bg-primary text-secondary font-extrabold rounded-full hover:text-shadow-header-profile-text cursor-pointer p-2 hover:scale-105 transition-transform"
              onClick={() => dispatch(toggleCart(false))}
            >
              <X className="h-4 w-4 font-extrabold" />
            </button>
          </div>
        </SheetHeader>

        {/* Content */}
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            {/* Cart Items - Scrollable */}
            <div className="flex-1 overflow-y-auto px-2 py-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem key={item.cartItemId} item={item} />
                ))}
              </div>

              {/* Add More Items Button */}
              <button
                className="w-full mt-4 p-2 rounded-md border-2 border-dashed cursor-pointer"
                onClick={() => {
                  dispatch(toggleCart(false));
                }}
              >
                {t("addMoreItems")}
              </button>


              <div className='space-y-4 my-4'>
                {/* Alerts & Notifications */}
                {!branch.hasBranch && <BranchNotSelectedAlert />}

                {branch.hasBranch && !totals.meetsMinimumOrder && (
                  <MinimumOrderAlert amount={amountToMinimum} />
                )}

                {branch.hasBranch &&
                  totals.meetsMinimumOrder &&
                  amountToFreeDelivery > 0 &&
                  branch.isDeliveryMode && (
                    <FreeDeliveryProgress
                      amount={amountToFreeDelivery}
                      progress={freeDeliveryProgress}
                    />
                  )}

                {isFreeDelivery && branch.isDeliveryMode && (
                  <FreeDeliveryBadge />
                )}

                {branch.deliveryTimeRange && branch.isDeliveryMode && (
                  <DeliveryTimeInfo timeRange={branch.deliveryTimeRange} />

                )}
              </div>

              <div className="p-1">
                <CartSummary showDetails={true} />
              </div>
            </div>

            {/* Footer - Summary & Checkout */}
            <div className="border-t bg-white px-6 py-4 space-y-4">
              <CheckoutButton />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
