import { CheckoutFormData } from "./checkoutSchema";

export const TITLE_OPTIONS = [
  { value: "mr", label: "Mr." },
  { value: "mrs", label: "Mrs." },
  { value: "miss", label: "Miss" },
  { value: "dr", label: "Dr." },
];

export function formatPhoneNumber(phone: string): string {
  // Format: 0364-8574986
  if (phone.length === 11) {
    return `${phone.slice(0, 4)}-${phone.slice(4)}`;
  }
  return phone;
}

export function calculateTax(subtotal: number, taxRate: number = 0.15): number {
  return subtotal * taxRate;
}

export function getDefaultFormValues(): Partial<CheckoutFormData> {
  return {
    title: "",
    fullName: "",
    mobileNumber: "",
    alternateMobileNumber: "",
    deliveryAddress: "",
    nearestLandmark: "",
    emailAddress: "",
    deliveryInstructions: "",
    paymentMethod: "cash",
    changeAmount: undefined,
    isGift: false,
    recipientName: "",
    recipientNumber: "",
    giftingMessage: "",
  };
}