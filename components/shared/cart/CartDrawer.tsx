// components/cart/CartDrawer.tsx

"use client";

import React, { useState } from "react";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectCartItems, selectIsCartOpen } from "@/store/slices/cartSlice";
import { calculateCartSummary } from "@/lib/cart/cartHelpers";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { EmptyCart } from "./EmptyCart";
import { useRouter } from "next/navigation";
import { toggleCart } from "@/store/slices/cartSlice";
import { useAppDispatch } from "@/store/hooks";

export function CartDrawer() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const isCartOpen = useAppSelector(selectIsCartOpen);
  const summary = calculateCartSummary(cartItems);
  console.log("Cart Items in Drawer:", selectCartItems);

  const handleCheckout = () => {
    dispatch(toggleCart(false));
    router.push("/checkout");
  };

  return (
    <Sheet
      open={isCartOpen}
      onOpenChange={(value) => dispatch(toggleCart(value))}
    >
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold flex items-center gap-2">
              <ShoppingBag className="h-6 w-6" />
              Your Cart{" "}
            </SheetTitle>
            {/* <Button
              variant="ghost"
              className="bg-red-600 text-white rounded-full hover:bg-red-700 hover:text-shadow-header-profile-text cursor-pointer"
              size="icon-lg"
              onClick={() => dispatch(toggleCart(false))}
            > */}
            <button
              className="bg-red-600 text-white font-extrabold rounded-full hover:bg-red-700 hover:text-shadow-header-profile-text cursor-pointer p-2 hover:scale-105 transition-transform"
              onClick={() => dispatch(toggleCart(false))}
            >
              <X className="h-4 w-4 font-extrabold" />
            </button>
            {/* </Button> */}
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
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => {
                  dispatch(toggleCart(false));
                  router.push("/");
                }}
              >
                + Add more items
              </Button>
            </div>

            {/* Footer - Summary & Checkout */}
            <div className="border-t bg-white px-6 py-4 space-y-4">
              <CartSummary summary={summary} />

              <Button
                size="lg"
                className="w-full h-14 text-lg font-semibold"
                onClick={handleCheckout}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              {/* Delivery Time Estimate */}
              <p className="text-center text-sm text-gray-500">
                Estimated delivery in 45-60 minutes
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
