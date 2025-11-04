// components/product-modal/footer/product-modal-footer.tsx

import React from 'react';
import { ShoppingCart } from 'lucide-react';
// import { useProductModal } from '../product-modal-context';
import { QuantityCounter } from './QuantityCounter';
import { AddToCartButton } from './AddToCart';
import { formatPrice } from '@/lib/product/productHelper';
// import { CartItem } from '@/lib/types/cart.types';
// import { getVariationDisplayName } from '@/lib/utils/product-helpers';

interface ProductModalFooterProps {
//   onAddToCart?: (cartItem: CartItem) => void;
}

export function ProductModalFooter () {
//   const {
//     product,
//     configuration,
//     currentVariation,
//     priceBreakdown,
//     isValid,
//   } = useProductModal();

  const handleAddToCart = () => {
    // if (!isValid || !currentVariation) return;

    // const cartItem: CartItem = {
    //   productId: product.Id,
    //   productName: product.Name,
    //   variationId: currentVariation.Id,
    //   variationName: getVariationDisplayName(currentVariation),
    //   configuration,
    //   priceBreakdown,
    //   specialInstructions: configuration.specialInstructions,
    //   timestamp: Date.now(),
    // };

    // onAddToCart?.(cartItem);
  };

  return (
    <div className="sticky bottom-0 z-10 bg-white border-t">
      <div className="px-2 py-4">
        <div className="flex items-center justify-between gap-2 lg:gap-4">
          {/* Quantity Counter */}
          <div className="flex-shrink-0">
            <QuantityCounter />
          </div>

          {/* Add to Cart Button */}
          <AddToCartButton
            onClick={handleAddToCart}
            // disabled={!isValid}
            // price={priceBreakdown.total}
            price={1000}
            icon={<ShoppingCart className="h-5 w-5" />}
            className='bg-red-500 text-white hover:bg-red-600 cursor-pointer'
          />
        </div>
      </div>
    </div>
  );
}