
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, CreditCard, Banknote } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/product/productHelper";
import { CartSummary } from "../shared/cart/CartSummary";
import { useAppSelector } from "@/store/hooks";
import { selectCartItems } from "@/store/slices/cartSlice";
import { calculateCartSummary } from "@/lib/cart/cartHelpers";

interface OrderDetailsProps {
  orderNumber: string;
  orderDate: string;
  paymentMethod: "cash" | "online";
  changeAmount?: number;
}

export function OrderDetails({
  orderNumber,
  orderDate,
  paymentMethod,
  changeAmount,
}: OrderDetailsProps) {
  const cartItems = useAppSelector(selectCartItems);
  const summary = calculateCartSummary(cartItems);

  return (
    <div className="animate-fade-in-up">
      <Card className="border-2 hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Receipt className="w-5 h-5 text-purple-500" />
            Order Summary
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Order Info */}
          <div className="p-3 bg-white rounded-lg border space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Order Number</span>
              <span className="font-mono font-bold text-gray-900">
                #{orderNumber}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Order Date</span>
              <span className="font-medium text-gray-900">{orderDate}</span>
            </div>
          </div>

          <Separator />

          {/* Price Breakdown */}
          <CartSummary summary={summary} />

          <Separator />

          {/* Payment Method */}
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-2">
              {paymentMethod === "cash" ? (
                <Banknote className="w-5 h-5 text-green-500" />
              ) : (
                <CreditCard className="w-5 h-5 text-blue-500" />
              )}
              <span className="text-sm font-medium text-gray-700">
                Payment Method
              </span>
            </div>

            <span className="text-sm font-bold text-gray-900">
              {paymentMethod === "cash" ? "Cash on Delivery" : "Online Payment"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

