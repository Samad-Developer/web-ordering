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
import { getCartItemAddons } from "@/lib/cart/cartHelpers";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
import { getImageUrl } from "@/lib/image/imageUtils";
import { motion, AnimatePresence } from "framer-motion";
import { useConfig } from "@/hooks/useConfig";

interface CartItemProps {
  item: CartItemType;
  isLast?: boolean;
}

export function CartItem({ item, isLast }: CartItemProps) {
  const dispatch = useAppDispatch();
  const t = useTranslations("cart");
  const websiteConfig = useConfig();
  const websiteLogo = websiteConfig?.RESTAURANT_LOGO || '';
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

  const imageSrc = getImageUrl(item.productImage, websiteLogo);

  return (
    <div className="bg-whiteoverflow-hidden">
      <div className="flex items-center gap-3">
        {/* Product Image */}
        <div className="relative w-[72px] h-[72px] flex-shrink-0 rounded-2xl overflow-hidden border">
          <Image
            src={imageSrc}
            alt={item.productName}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
            {item.productName}
          </h3>

          {/* Size & Flavor */}
          {(item.sizeName !== "-" || item.flavorName !== "-") && (
            <div className="flex items-center gap-2">

              {item.sizeName !== "-" && (
                <span className="text-xs text-gray-700 py-0.5 rounded">
                  {item.sizeName}
                </span>
              )}

              {item.flavorName !== "-" && (
                <span className="text-xs text-gray-700 py-0.5 rounded">
                  {item.flavorName}
                </span>
              )}

            </div>
          )}

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


          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-0">
          {item.customization.quantity === 1 ? (
            <button
              className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-l-lg border border-border text-muted-foreground transition-colors hover:bg-secondary"
              onClick={handleRemove}
            >
              <Trash2 className="h-3.5 w-3.5 text-primary" />
            </button>
          ) : (
            <button
              className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-l-lg border border-border text-muted-foreground transition-colors hover:bg-secondary"
              onClick={handleDecrement}
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
          )}

          <div className="flex h-8 w-8 items-center justify-center border-y border-border bg-card text-sm font-medium text-foreground">
            {item.customization.quantity}
          </div>

          <button
            className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-r-lg border border-border text-muted-foreground transition-colors hover:bg-secondary"
            onClick={handleIncrement}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
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
          <AnimatePresence>
            {showAddons && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-2 space-y-1 bg-gray-50 p-3 rounded-lg">
                  {addons.map((addon, index) => (
                    <div
                      key={index}
                      className="w-full flex items-center justify-between gap-2 py-0.5 text-xs text-gray-600 border-b border-border/40 pb-1 last:border-b-0"
                    >
                      <span>
                        {addon.name}{" "}
                        {addon.quantity > 1 ? `(${addon.quantity}x)` : ""}
                      </span>
                      {addon.price > 0 ? (
                        <span className="font-medium">+ Rs {addon.price}</span>
                      ) : (
                        "-"
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {!isLast && <Separator className="bg-gray-200 h-[1px] w-full mt-2" />}
    </div>
  );
}
