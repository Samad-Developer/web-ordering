"use client";

import React from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  toggleCart,
} from "@/store/slices/cartSlice";
import { formatPrice } from "@/lib/product/productHelper";
import { cn } from "@/lib/utils";
import { CartButton } from "../headers/partials/CartButton";
import { SvgIcon } from "@/components/common/SvgIcon";
import { useTranslations } from "next-intl";
import { useCartTotals } from "@/hooks/useCartTotals";

export function FloatingCartButton() {
  const dispatch = useAppDispatch();
  const t = useTranslations("cart");
  const { subtotal} = useCartTotals();

  const handleOpenCart = () => {
    dispatch(toggleCart(true));
  };

  return (
 <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 w-auto px-4">
  <div
    onClick={handleOpenCart}
    className={cn(
      "cursor-pointer relative flex items-center gap-8 sm:gap-10",
      "px-4 py-3 rounded-2xl",
      // Glassy effect
      "bg-white/10 dark:bg-black/20",
      "backdrop-blur-xl backdrop-saturate-150",
      "border border-white/30 dark:border-white/10",
      "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
      "hover:bg-white/15 dark:hover:bg-black/25",
      "hover:shadow-[0_8px_32px_rgba(0,0,0,0.18)]",
      "transition-all duration-300 ease-out",
      "hover:scale-[1.02] active:scale-[0.98]",
      "group"
    )}
  >
    {/* Cart Icon with Badge */}
    <div className="flex-shrink-0 bg-primary/90 p-2.5 rounded-xl shadow-lg">
      <CartButton
        cartIcon={<SvgIcon src="/assets/images/svgIcons/cart.svg" alt="Cart" />}
        iconClassName="text-white w-5 h-5"
      />
    </div>

    {/* View Cart Text */}
    <span className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base whitespace-nowrap">
      {t("viewCart")}
    </span>
    
    {/* Subtotal Price */}
    <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
      {formatPrice(subtotal)}
    </p>
  </div>
</div>
  );
}
