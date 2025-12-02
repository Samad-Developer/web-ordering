
"use client";

import React, { useState, useEffect } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectCartItems } from "@/store/slices/cartSlice";
import { createCheckoutSchema } from "@/lib/checkout/checkoutSchema";
import { getDefaultFormValues } from "@/lib/checkout/checkoutHelpers";
import { PlaceOrderButton } from "./PlaceOrderButton";
import {
  CheckoutFormData,
  OrderMode,
  PaymentMethod,
} from "@/types/checkout.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckoutFormFields } from "./CheckoutFormFields";
import { PaymentSection } from "./PaymentSection";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

interface CheckoutFormProps {
  setFormRef: (ref: HTMLFormElement | null) => void;
  setIsSubmitting: (loading: boolean) => void;
}

export function CheckoutForm({ setFormRef, setIsSubmitting }: CheckoutFormProps) {
  const router = useRouter();
  const cartItems = useAppSelector(selectCartItems);

  const orderMode: OrderMode = "delivery";
  const [isGift, setIsGift] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

  // Create dynamic schema based on current state
  const schema = createCheckoutSchema(orderMode, isGift, paymentMethod);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(schema) as unknown as Resolver<CheckoutFormData>,
    defaultValues: getDefaultFormValues(),
    mode: "onBlur",
  });

  // Reset gift fields when isGift changes
  useEffect(() => {
    if (!isGift) {
      form.setValue("recipientName", "");
      form.setValue("recipientNumber", "");
      form.setValue("giftingMessage", "");
    }
  }, [isGift, form]);

  // Reset change amount when payment method changes
  useEffect(() => {
    if (paymentMethod === "online") {
      form.setValue("changeAmount", undefined);
    }
  }, [paymentMethod, form]);

  // Update form's isGift value
  useEffect(() => {
    form.setValue("isGift", isGift);
  }, [isGift, form]);

  // Update form's payment method
  useEffect(() => {
    form.setValue("paymentMethod", paymentMethod);
  }, [paymentMethod, form]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      router.push("/");
    }
  }, [cartItems.length, router]);

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  const handleGiftToggle = (checked: boolean) => {
    setIsGift(checked);
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);

    try {

      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Form Data:", data);
      console.log("Order Mode:", orderMode);
      console.log("Cart Items:", cartItems);


      toast.success("Order placed successfully!", {
        description: (
          <p className="text-gray-600">
            You will receive a confirmation shortly.
          </p>
        ),
      });

      form.reset(getDefaultFormValues());

      setIsGift(false);
      setPaymentMethod("cash");


    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order", {
        description: "Please try again or contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Checkout</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          This is a{" "}
          <span className="font-semibold text-red-600">Delivery Order 🚚</span>
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" ref={setFormRef}>
          {/* Form Fields */}
          <CheckoutFormFields
            form={form}
            orderMode={orderMode}
            isGift={isGift}
            onGiftToggle={handleGiftToggle}
          />

          <Separator />

          {/* Payment Section */}
          <PaymentSection
            form={form}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={handlePaymentMethodChange}
          />

        </form>
      </CardContent>
    </Card>
  );
}
