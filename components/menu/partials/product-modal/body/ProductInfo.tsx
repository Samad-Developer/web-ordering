import React from 'react';
import { useProductModal } from '../ProductModalContext';
import { formatPrice } from '@/lib/product/productHelper';

export function ProductInfo() {
  const { product, priceBreakdown } = useProductModal();

  return (
    <div className="px-4 sm:px-6 py-4 space-y-3">
      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-xl font-bold text-popup-price">
          {formatPrice(priceBreakdown.subtotal)}
        </span>
        
        {priceBreakdown.addonsTotal > 0 && (
          <span className="text-sm text-gray-500">
            (Base: {formatPrice(priceBreakdown.basePrice)} + 
            Extras: {formatPrice(priceBreakdown.addonsTotal)})
          </span>
        )}
      </div>

      {/* Description (if exists) */}
      {/* {product.Comment && product.Comment.trim() !== '' && ( */}
        <p className="text-sm text-popup-desc leading-relaxed">
          {/* {product.Comment} */}
            This is a sample product description. It provides details about the product, its features, and any other relevant information that might help the customer make a purchase decision.
        </p>
      {/* )} */}

    </div>
  );
}