"use client";

import { useState, RefObject } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { clearCart, selectCartItems } from "@/store/slices/cartSlice";
import { createCheckoutSchema } from "@/lib/checkout/checkoutSchema";
import { getDefaultFormValues } from "@/lib/checkout/checkoutHelpers";
import {
  CheckoutFormData,
  OrderMode,
  PaymentMethod,
} from "@/types/checkout.types";
import { Separator } from "@/components/ui/separator";
import { CheckoutFormFields } from "./CheckoutFormFields";
import { PaymentSection } from "./PaymentSection";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { PlaceOrderResponse } from "@/hooks/useOrderSubmission";
import { useAppDispatch } from "@/store/hooks";

interface CheckoutFormProps {
  formRef: RefObject<HTMLFormElement>;
  submitOrder: (data: CheckoutFormData) => Promise<PlaceOrderResponse>;
}

export function CheckoutForm({ formRef, submitOrder }: CheckoutFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { locale } = useParams();
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

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    form.setValue("paymentMethod", method);

    if (method !== "cash") {
      form.setValue("changeAmount", undefined);
    }
  };

  const handleGiftToggle = (checked: boolean) => {
    setIsGift(checked);
    form.setValue("isGift", checked);

    if (!isGift) {
      form.setValue("recipientName", "");
      form.setValue("recipientNumber", "");
      form.setValue("giftingMessage", "");
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {

    try {
      const response = await submitOrder(data);

      if (response.dataPayload?.Success) {
        toast.success("Order placed successfully!", {
          description: "You will receive a confirmation shortly.",
        });

        // Reset form and state
        form.reset(getDefaultFormValues());
        dispatch(clearCart());
        setIsGift(false);
        setPaymentMethod("cash");

        // Navigate to order confirmation page with order number
        router.push(`/${locale}/order-placed?orderNumber=${response.dataPayload?.OrderNumber}`);
      } else {
        toast.error("Failed to place order", {
          description: response.dataPayload?.Message || "Please try again or contact support.",
        });
      }
      
    } catch (error) {
      toast.error("Failed to place order", {
        description: error instanceof Error ? error.message : "Please try again or contact support.",
      });
    }
  };

  return (
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        ref={formRef}
      >
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
  );
}
