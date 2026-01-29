"use client";

import React, { useState } from "react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { PlaceOrderButton } from "@/components/checkout/PlaceOrderButton";
import { useAppSelector } from "@/store/hooks";
import { selectCartItems } from "@/store/slices/cartSlice";

export default function CheckoutPage() {
  const [formRef, setFormRef] = useState<HTMLFormElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cartItems = useAppSelector(selectCartItems);

  const handlePlaceOrder = () => {
    if (formRef) {
      formRef.requestSubmit();
    }
  };

  return (
    <div className="min-h-screen container mx-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutForm
              setFormRef={setFormRef}
              setIsSubmitting={setIsSubmitting}
            />
          </div>

          {/* Right: Order Summary & Place Order Button */}
          <div className="lg:col-span-1 space-y-4 relative">
            <OrderSummary />
            <PlaceOrderButton
              onPlaceOrder={handlePlaceOrder}
              isSubmitting={isSubmitting}
              isDisabled={cartItems.length === 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
