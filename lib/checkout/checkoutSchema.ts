// lib/checkout/checkoutSchema.ts

import * as z from "zod";
import { OrderMode, PaymentMethod } from "@/types/checkout.types";

// Phone number regex for Pakistan
const phoneRegex = /^03[0-9]{9}$/;

export const createCheckoutSchema = (
  orderMode: OrderMode,
  isGift: boolean,
  paymentMethod: PaymentMethod
) => {
  return z.object({
    // Basic Info (Always Required)
    title: z.string().min(1, "Please select a title"),
    fullName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

    mobileNumber: z
      .string()
      .regex(phoneRegex, "Please enter a valid mobile number (03xxxxxxxxx)")
      .length(11, "Mobile number must be 11 digits"),

    alternateMobileNumber: z
      .string()
      .regex(phoneRegex, "Please enter a valid mobile number (03xxxxxxxxx)")
      .length(11, "Mobile number must be 11 digits")
      .optional()
      .or(z.literal("")),

    // Delivery Info (Conditional)
    deliveryAddress:
      orderMode === "delivery"
        ? z
            .string()
            .min(10, "Address must be at least 10 characters")
            .max(200, "Address must be at most 200 characters")
        : z.preprocess((val) => val ?? "", z.string().optional()),

    nearestLandmark:
      orderMode === "delivery"
        ? z
            .string()
            .min(3, "Landmark must be at least 3 characters")
            .max(100, "Landmark must be at most 100 characters")
            .optional()
            .or(z.literal(""))
        : z.preprocess((val) => val ?? "", z.string().optional()),

    // Optional Fields
    emailAddress: z
      .string()
      .email("Please enter a valid email address")
      .optional()
      .or(z.literal("")),

    deliveryInstructions: z
      .string()
      .max(500, "Instructions must be at most 500 characters")
      .optional(),

    // Payment
    paymentMethod: z.enum(["cash", "online"]),

    changeAmount:
      paymentMethod === "cash"
        ? z.number().min(0, "Amount cannot be negative").optional()
        : z.number().optional(),

    // Gift Options (Conditional)
    isGift: z.boolean(),

    recipientName: isGift
      ? z
          .string()
          .min(2, "Recipient name must be at least 2 characters")
          .max(50, "Recipient name must be at most 50 characters")
      : z.preprocess((val) => val ?? "", z.string().optional()),

    recipientNumber: isGift
      ? z
          .string()
          .regex(phoneRegex, "Please enter a valid mobile number (03xxxxxxxxx)")
          .length(11, "Mobile number must be 11 digits")
      : z.preprocess((val) => val ?? "", z.string().optional()),

    giftingMessage: isGift
      ? z
          .string()
          .min(5, "Message must be at least 5 characters")
          .max(200, "Message must be at most 200 characters")
          .optional()
          .or(z.literal(""))
      : z.preprocess((val) => val ?? "", z.string().optional()),
  });
};

export type CheckoutFormData = z.infer<ReturnType<typeof createCheckoutSchema>>;
