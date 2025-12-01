// lib/types/checkout.types.ts

export type OrderMode = 'delivery' | 'pickup';
export type PaymentMethod = 'cash' | 'online';

export interface CheckoutFormData {
  // Customer Info (Always Required)
  title: string;
  fullName: string;
  mobileNumber: string;
  alternateMobileNumber?: string;
  
  // Delivery Info (Required for Delivery mode)
  deliveryAddress?: string;
  nearestLandmark?: string;
  
  // Common Fields
  emailAddress?: string;
  deliveryInstructions?: string;
  
  // Payment
  paymentMethod: PaymentMethod;
  changeAmount?: number;
  
  // Gift Options (Delivery mode only)
  isGift: boolean;
  recipientName?: string;
  recipientNumber?: string;
  giftingMessage?: string;
}

export interface CheckoutState {
  orderMode: OrderMode;
  isGift: boolean;
}