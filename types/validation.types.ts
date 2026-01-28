export interface BranchValidationData {
    // Branch availability
    hasBranch: boolean;
    isDeliveryMode: boolean;
    isPickupMode: boolean;
    branchName: string | null;
    branchId: number | null;
  
    // Business hours
    isBranchOpen: boolean;
    businessHours: string | null;
    businessStartTime: string | null;
    businessEndTime: string | null;
  
    // Delivery settings
    deliveryCharges: number;
    deliveryChargesWaiveOffLimit: number;
    deliveryTime: number | null;
    deliveryTimeRange: string | null;
  
    // Minimum order
    minimumOrderAmount: number;
    meetsMinimumOrder: (cartTotal: number) => boolean;
    getAmountToMinimum: (cartTotal: number) => number;
  
    // Free delivery
    hasDeliveryChargesWaiveOff: boolean;
    calculateDeliveryFee: (cartTotal: number) => number;
    getAmountToFreeDelivery: (cartTotal: number) => number;
    getFreeDeliveryProgress: (cartTotal: number) => number;
    isFreeDelivery: (cartTotal: number) => boolean;
  
    // Overall validation
    canPlaceOrder: (cartTotal: number, hasItems: boolean) => boolean;
  }

  export interface CartTotalsData {
    // Cart basics
    subtotal: number;
    itemCount: number;
    hasItems: boolean;
  
    // Calculations
    tax: number;
    taxRate: number;
    deliveryFee: number;
    total: number;
    totalDiscount: number;
  
    // Formatted totals
    beforeTax: number; // subtotal + delivery
    
    // Validations
    meetsMinimumOrder: boolean;
    canCheckout: boolean;
  }