
export enum DiscountType {
  PERCENTAGE = 'Percentage',
  FIXED_AMOUNT = 'Amount',
  }
  
  export interface Discount {
    Id: number;
    Type: DiscountType;
    Name: string;
    Value: number;
    MaxCap: number;
    MinCap: number;
  }
  
  export interface DiscountCalculation {
    originalPrice: number;
    discountAmount: number;
    finalPrice: number;
    discountPercentage?: number;
    hasDiscount: boolean;
  }