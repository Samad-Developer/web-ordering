import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useProductModal } from '../ProductModalContext';
import { QuantityCounter } from './QuantityCounter';
import { AddToCartButton } from './AddToCart';
import { CartItem } from '@/types/product.types';
import { toast } from "sonner"
import { useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import { closeProductModal } from '@/store/slices/productModalSlice';

interface ProductModalFooterProps {
  onAddToCart?: (cartItem: CartItem) => void;
}

export function ProductModalFooter() {
  const dispatch = useAppDispatch();
  const {
    product,
    customization,
    currentVariation,
    priceBreakdown,
    isValid,
  } = useProductModal();


  const handleAddToCart = () => {
    if (!isValid || !currentVariation) {
      toast.error('Please complete your selection');
      return;
    }

    // Dispatch to Redux
    dispatch(
      addToCart({
        productId: product.Id,
        productName: product.Name,
        productImage: product.Image !== 'N/A' ? product.Image : '/placeholder-food.jpg',
        variationId: currentVariation.Id,
        sizeName: currentVariation.Size.Name,
        flavorName: currentVariation.Flavour.Name,
        customization,
        priceBreakdown,
        specialInstructions: customization.specialInstructions,
      })
    );

    // Show success message
    toast.success(`${product.Name} added to your cart!`);


    // Close modal
    dispatch(closeProductModal());
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
            disabled={!isValid}
            price={priceBreakdown.total}
            icon={<ShoppingCart className="h-5 w-5" />}
            className='bg-red-500 text-white hover:bg-red-600 cursor-poi'
          />
        </div>
      </div>
    </div>
  );
}