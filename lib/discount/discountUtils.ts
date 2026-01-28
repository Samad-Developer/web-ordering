import { Discount, DiscountType, DiscountCalculation } from '@/types/discount.types';

export function calculateDiscount(
  price: number,
  discount: Discount | null | undefined
): DiscountCalculation {

  if (!discount || price <= 0) {
    return {
      originalPrice: price,
      discountAmount: 0,
      finalPrice: price,
      hasDiscount: false,
    };
  }

  let discountAmount = 0;
  let discountPercentage: number | undefined;

  if (discount.Type === DiscountType.PERCENTAGE) {
    discountPercentage = discount.Value;
    discountAmount = (price * discount.Value) / 100;
  } else if (discount.Type === DiscountType.FIXED_AMOUNT) {
    discountAmount = discount.Value;
    discountPercentage = (discount.Value / price) * 100;
  }

  if (discount.MaxCap > 0 && discountAmount > discount.MaxCap) {
    discountAmount = discount.MaxCap;
  }

  if (discount.MinCap > 0 && price < discount.MinCap) {
    return {
      originalPrice: price,
      discountAmount: 0,
      finalPrice: price,
      hasDiscount: false,
    };
  }

  discountAmount = Math.min(discountAmount, price);
  const finalPrice = price - discountAmount;

  return {
    originalPrice: price,
    discountAmount,
    finalPrice,
    discountPercentage,
    hasDiscount: true,
  };
}

export function formatDiscountLabel(discount: Discount | null | undefined): string {
  if (!discount) return '';

  if (discount.Type === DiscountType.PERCENTAGE) {
    return `${discount.Value}% OFF`;
  } else if (discount.Type === DiscountType.FIXED_AMOUNT) {
    return `Rs. ${discount.Value} OFF`;
  }

  return '';
}


// export function hasDiscount(discount: Discount | null | undefined): boolean {
//   return !!discount && discount.Value > 0;
// }