"use client";

import React from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  selectCartItemCount,
  selectCartSubtotal,
  toggleCart,
} from "@/store/slices/cartSlice";
import { formatPrice } from "@/lib/product/productHelper";
import { cn } from "@/lib/utils";
import { CartButton } from "../headers/partials/CartButton";
import { SvgIcon } from "@/components/common/SvgIcon";

export function FloatingCartButton() {
  const dispatch = useAppDispatch();
  const itemCount = useAppSelector(selectCartItemCount);
  const subtotal = useAppSelector(selectCartSubtotal);

  const handleOpenCart = () => {
    dispatch(toggleCart(true));
  };

  return (
    <div className="fixed bottom-1 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center">
      <div className="relative w-full flex justify-center">
        <button
          onClick={handleOpenCart}
          className={cn(
            "cursor-pointer relative flex items-center gap-8 sm:gap-16",
            "px-4 py-3 rounded-full",
            "bg-gradient-to-r from-red-600 to-red-500",
            "hover:from-red-700 hover:to-red-600",
            "shadow-2xl hover:shadow-red-500/50",
            "transition-all duration-300 ease-out",
            "border-2 border-white",
            "group",
            "max-w-[95vw]" // ensures full button stays visible on small screens
          )}
        >
          {/* Cart Icon with Badge */}
          <div className="relative flex-shrink-0">
            <CartButton
              cartIcon={
                <SvgIcon src="/assets/images/svgIcons/cart.svg" alt="Menu" />
              }
            />
          </div>

          {/* Divider + Text + Price */}
          <div className="flex items-center gap-8 sm:gap-16 whitespace-nowrap overflow-hidden min-w-0">

            <span className="text-white font-semibold text-lg sm:text-xl flex-shrink-0">
              View Cart
            </span>

            <div className="flex gap-2 items-center min-w-0">
              <div className="text-left min-w-0">
                <p className="text-lg font-bold text-white truncate">
                  {formatPrice(subtotal)}
                </p>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
