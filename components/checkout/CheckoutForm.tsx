"use client";

import { useState, useEffect, RefObject } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectCartItems } from "@/store/slices/cartSlice";
import { createCheckoutSchema } from "@/lib/checkout/checkoutSchema";
import { getDefaultFormValues } from "@/lib/checkout/checkoutHelpers";
import {
  CheckoutFormData,
  OrderMode,
  PaymentMethod,
} from "@/types/checkout.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckoutFormFields } from "./CheckoutFormFields";
import { PaymentSection } from "./PaymentSection";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { PlaceOrderResponse } from "@/hooks/useOrderSubmission";

interface CheckoutFormProps {
  formRef: RefObject<HTMLFormElement>;
  submitOrder: (data: CheckoutFormData) => Promise<PlaceOrderResponse>;
}

export function CheckoutForm({ formRef, submitOrder }: CheckoutFormProps) {
  const t = useTranslations("checkout");
  const router = useRouter();
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

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      router.push("/");
    }
  }, [cartItems.length, router]);

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

      console.log("Order submission response:", response);

      if (response.dataPayload?.Success) {
        toast.success("Order placed successfully!", {
          description: "You will receive a confirmation shortly.",
        });
      }

      localStorage.setItem("orderCustomerInfo", JSON.stringify(data));

      form.reset(getDefaultFormValues());
      setIsGift(false);
      setPaymentMethod("cash");

      router.push(`/${locale}/order-success?orderNumber=${response.dataPayload?.OrderNumber}`);

    } catch (error) {
      toast.error("Failed to place order", {
        description: error instanceof Error ? error.message : "Please try again or contact support.",
      });
    }

  };



  return (
    <div className="border p-6 rounded-xl">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">{t("title")}</h1>
        </div>
      </div>

      <div>
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
      </div>
    </div>
  );
}
