"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectCartItems } from "@/store/slices/cartSlice";
import { useOrderSubmission } from "@/hooks/useOrderSubmission";
import { Logo } from "@/components/shared/headers/partials/Logo";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderModeBanner } from "@/components/checkout/OrderModeBanner";
import { PlaceOrderButton } from "@/components/checkout/PlaceOrderButton";

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

      <div className="w-full flex items-center justify-center py-3 rounded-full">
        <Logo />
      </div>

      <div className="max-w-[1200px] mx-auto px-2 pb-24 lg:pb-8 grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* Left Side - Checkout Form */}
        <div className="lg:col-span-3 px-4 sm:px-8 py-6 bg-white rounded-lg shadow-sm self-start">
          <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
          <OrderModeBanner />
          <CheckoutForm formRef={formRef} submitOrder={submitOrder} />
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

          {/* Add More Items */}
          <motion.div whileHover="hover" initial="rest" animate="rest">
            <Link
              href="/"
              className="flex gap-2 items-center justify-center w-full text-sm text-gray-600 
                          border border-gray-400 border-dotted rounded-md py-2 transition-colors duration-200
                        hover:text-black hover:bg-gray-50"
            >
              <motion.span
                variants={{
                  rest: { x: 0 },
                  hover: { x: -4 },
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ArrowLeft className="w-4 h-4" />
              </motion.span>

              <motion.span
                variants={{
                  rest: { opacity: 0.9 },
                  hover: { opacity: 1 },
                }}
              >
                Add More Items
              </motion.span>
            </Link>
          </motion.div>
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
