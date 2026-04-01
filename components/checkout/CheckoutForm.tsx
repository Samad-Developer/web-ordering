"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useState, RefObject } from "react";
import { useAppSelector } from "@/store/hooks";
import { useAppDispatch } from "@/store/hooks";
import { PaymentSection } from "./PaymentSection";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckoutFormFields } from "./CheckoutFormFields";
import { PlaceOrderResponse } from "@/hooks/useOrderSubmission";
import { selectSelectedAddress } from "@/store/slices/addressSlice";
import { createCheckoutSchema } from "@/lib/checkout/checkoutSchema";
import { getDefaultFormValues } from "@/lib/checkout/checkoutHelpers";
import { clearCart } from "@/store/slices/cartSlice";
import { CheckoutFormData, OrderMode } from "@/types/checkout.types";

interface CheckoutFormProps {
  formRef: RefObject<HTMLFormElement>;
  submitOrder: (data: CheckoutFormData) => Promise<PlaceOrderResponse>;
}

export function CheckoutForm({ formRef, submitOrder }: CheckoutFormProps) {
  const router = useRouter();
  const { locale } = useParams();
  const dispatch = useAppDispatch();
  const [isGift, setIsGift] = useState(false);
  const selectedAddress = useAppSelector(selectSelectedAddress);

  const orderMode: OrderMode = selectedAddress?.orderMode || "pickup";

  // Create dynamic schema based on current state
  const schema = createCheckoutSchema(orderMode, isGift);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(schema) as unknown as Resolver<CheckoutFormData>,
    defaultValues: getDefaultFormValues(),
    mode: "onBlur",
  });


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
      console.log("Order submission response:", response);
      if (response.dataPayload?.Success) {
        toast.success("Order placed successfully!", {
          description: "You will receive a confirmation shortly.",
        });

        // Reset form and state
        form.reset(getDefaultFormValues());
        dispatch(clearCart());
        setIsGift(false);

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

      {/* Payment Section */}
      <PaymentSection
        form={form}
      />
    </form>
  );
}
