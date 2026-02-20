"use client";

import { useRef } from "react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { PlaceOrderButton } from "@/components/checkout/PlaceOrderButton";
import { useAppSelector } from "@/store/hooks";
import { selectCartItems } from "@/store/slices/cartSlice";
import { useOrderSubmission } from "@/hooks/useOrderSubmission";

export default function CheckoutPage() {
  const formRef = useRef<HTMLFormElement>(null!);
  const cartItems = useAppSelector(selectCartItems);

  const { submitOrder, isSubmitting } = useOrderSubmission();

  const handlePlaceOrder = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutForm
              formRef={formRef}
              submitOrder={submitOrder}
            />
          </div>

          {/* Right: Order Summary & Place Order Button */}
          <div className="lg:col-span-1 space-y-4 relative">
            <OrderSummary />
            <PlaceOrderButton
              onPlaceOrder={handlePlaceOrder}
              isDisabled={cartItems.length === 0}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
