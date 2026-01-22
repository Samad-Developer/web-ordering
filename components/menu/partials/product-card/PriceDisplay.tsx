import React from "react";

interface PriceDisplayProps {
  currentPrice: number;
  originalPrice?: number;
  currency?: string;
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  currentPrice,
  originalPrice,
  currency = "Rs.",
  className = "",
}) => {
  const hasDiscount = originalPrice && originalPrice > currentPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  return (
    <div className={`bg-product-price-bg flex items-center gap-2 flex-wrap ${className}`}>

      <span className="text-lg font-bold text-product-price-fg">
        {currency} {currentPrice}
      </span>

      {/* {hasDiscount && (
        <>
          <span className="text-sm text-gray-400 line-through font-medium">
            {currency} {originalPrice}
          </span>
          <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded">
            {discountPercentage}% OFF
          </span>
        </>
      )} */}
    </div>
  );
};
