export interface CustomerInfoType {
  title: string;
  fullName: string;
  mobileNumber: string;
  alternateMobileNumber?: string;
  emailAddress: string;

  deliveryAddress: string;
  nearestLandmark?: string;
  deliveryInstructions?: string;

  isGift: boolean;
  recipientName?: string;
  recipientNumber?: string;
  giftingMessage?: string;

  paymentMethod: string;
  changeAmount?: number;
}
