"use client";

import { useRef } from "react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { PlaceOrderButton } from "@/components/checkout/PlaceOrderButton";
import { useAppSelector } from "@/store/hooks";
import { selectCartItems } from "@/store/slices/cartSlice";
import { useOrderSubmission } from "@/hooks/useOrderSubmission";
import { Logo } from "@/components/shared/headers/partials/Logo";

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
    <div className="min-h-screen bg-[#F9FAFB]">

      {/* Logo */}
      <div className="w-full flex items-center justify-center">
        <Logo />
      </div>

      {/* Main Container */}
      <div className="max-w-[1200px] mx-auto px-2 pb-24 lg:pb-8">

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left Side - Checkout Form */}
          <div className="lg:col-span-3 px-4 sm:px-8 py-6 bg-white rounded-lg shadow-sm">
            <h1 className="text-2xl font-semibold mb-8">Checkout</h1>

            <CheckoutForm
              formRef={formRef}
              submitOrder={submitOrder}
            />
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-8 h-fit">
            <OrderSummary />

            {/* Desktop Button */}
            <div className="hidden lg:block">
              <PlaceOrderButton
                onPlaceOrder={handlePlaceOrder}
                isDisabled={cartItems.length === 0}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 p-4 bg-white border-t shadow-lg">
        <PlaceOrderButton
          onPlaceOrder={handlePlaceOrder}
          isDisabled={cartItems.length === 0}
          isSubmitting={isSubmitting}
        />
      </div>

    </div>
  );
}
