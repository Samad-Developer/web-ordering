"use client";

import React from "react";
import { BadgeDollarSignIcon, CreditCard, Banknote } from "lucide-react";
import { CartSummary } from "../shared/cart/CartSummary";
import { useAppSelector } from "@/store/hooks";
import { selectCartItems } from "@/store/slices/cartSlice";
import { calculateCartSummary } from "@/lib/cart/cartHelpers";

interface OrderDetailsProps {
  paymentMethod: "cash" | "online";
}

export function OrderDetails({
  paymentMethod,
}: OrderDetailsProps) {
  const cartItems = useAppSelector(selectCartItems);
  const summary = calculateCartSummary(cartItems);

  return (
    <div className="border-2 rounded-xl">
      {/* HEADER WITH PAYMENT METHOD ON RIGHT */}
      <div className="flex items-center justify-between bg-gray-200 p-4 rounded-t-lg border-b">
        {/* LEFT SIDE TITLE */}
        <div className="flex items-center gap-2">
          <BadgeDollarSignIcon className="w-7 h-7 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800 tracking-wide">
            Payment Details
          </h2>
        </div>

        {/* RIGHT SIDE PAYMENT METHOD CHIP */}
        <div className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-1.5 rounded-full shadow-sm">
          {paymentMethod === "cash" ? (
            <Banknote className="w-4 h-4 text-green-600" />
          ) : (
            <CreditCard className="w-4 h-4 text-blue-600" />
          )}
          <span className="text-xs font-semibold text-gray-700">
            {paymentMethod === "cash" ? "Cash on Delivery" : "Online Payment"}
          </span>
        </div>
      </div>

      {/* BODY */}
      <div className="p-5 space-y-4">
        {/* CART SUMMARY */}
        <CartSummary />
      </div>
    </div>
  );
}
