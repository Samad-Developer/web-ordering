"use client";

import React, { useState } from "react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PlaceOrderButton } from "@/components/checkout/PlaceOrderButton";
import { calculateCartSummary } from "@/lib/cart/cartHelpers";
import { useAppSelector } from "@/store/hooks";
import { selectCartItems } from "@/store/slices/cartSlice";

export default function CheckoutPage() {
  const [formRef, setFormRef] = useState<HTMLFormElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ ADD THIS
  const cartItems = useAppSelector(selectCartItems);
  const summary = calculateCartSummary(cartItems);
  const tax = summary.subtotal * 0.15;
  const grandTotal = summary.total + tax;

  const handlePlaceOrder = () => {
    if (formRef) {
      formRef.requestSubmit();
    }
  };

  return (
    <div className="min-h-screen container mx-auto">
      {/* Header */}
      {/* <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
              <p className="text-sm text-gray-500">Complete your order</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutForm
              setFormRef={setFormRef}
              setIsSubmitting={setIsSubmitting}
            />
          </div>

          <div className="lg:col-span-1 space-y-4 relative">
            <OrderSummary />

     
            <PlaceOrderButton
              onPlaceOrder={handlePlaceOrder}
              isSubmitting={isSubmitting}
              totalAmount={grandTotal}
              isDisabled={cartItems.length === 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
