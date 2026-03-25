export interface OrderSuccessPageProps {
  searchParams: Promise<{
    orderNumber?: string;
  }>;
}

export interface ItemOption {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface ItemChoice {
  id: number;
  name: string;
  quantity: number;
  maxChoice: number;
  itemOptions: ItemOption[];
}

export interface ItemVariation {
  id: number;
  size?: { id: number; name: string };
  flavour?: { id: number; name: string };
  price: number;
  discount: number | null;
  itemChoices: ItemChoice[];
}

export interface ApiOrderItem {
  id: number;
  categoryId: string;
  code: string;
  name: string;
  departmentName: string;
  price: number;
  taxAmount: number;
  quantity: number;
  image?: string;
  comment: string;
  isKot: boolean;
  itemFOC: boolean;
  description: string;
  variations: ItemVariation[];
  discount: number | null;
}

export interface ApiOrderResponse {
  domain: string | null;
  branchId: number;
  branchName: string;
  customerDetails: {
    title: string | null;
    fullName: string;
    mobileNumber: string;
    alternateMobileNumber: string | null;
    deliveryAddress: string;
    nearestLandmark: string;
    emailAddress: string | null;
    deliveryInstructions: string;
    paymentMethod: string | null;
    giftingMessage: string | null;
    recipientName: string | null;
    recipientNumber: string | null;
    isGift: boolean;
  };
  orderNumber: string;
  orderToken: string;
  orderType: string;
  orderStatusLogs: Array<{ Id: number; CreatedAt: string }>;
  paymentType: string | null;
  paymentStatus: string | null;
  status: string;
  amountWithGst: number;
  amountWithoutGst: number;
  items: ApiOrderItem[];
  orderTime: string;
  deliveryCharges: number;
  gstPercentage: number;
  totalDiscount: number | null;
}

// Enhanced UI interface with addon details
export interface OrderItemAddon {
  name: string;
  price: number;
  quantity: number;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  size?: string;
  addons: OrderItemAddon[];
  totalPrice: number;
}

export interface OrderDetails {
  orderNumber: string;
  orderToken: string;
  initialLogs: Array<{ Id: number; CreatedAt: string }>;
  status: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  totalDiscount: number;
  deliveryCharges: number;
  gstPercentage: number;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerAltPhone?: string;
  giftingMessage?: string;
  isGift?: boolean;
  nearestLandmark?: string;
  recipientName?: string;
  recipientNumber?: string;
  customerEmail: string | null;
  deliveryAddress: string;
  deliveryInstructions: string;
  branchName: string;
  orderType: string;
  createdAt: string;
}