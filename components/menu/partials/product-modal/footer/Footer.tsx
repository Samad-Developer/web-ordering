import React from 'react';
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { ShoppingCart } from 'lucide-react';
import { AddToCartButton } from './AddToCart';
import { QuantityCounter } from './QuantityCounter';
import { addToCart } from '@/store/slices/cartSlice';
import { useProductModal } from '../ProductModalContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeProductModal } from '@/store/slices/productModalSlice';
import { selectOpenedFromUrl } from '@/store/slices/productModalSlice';


export function ProductModalFooter() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    product,
    customization,
    currentVariation,
    priceBreakdown,
    isValid,
  } = useProductModal();
  const openedFromUrl = useAppSelector(selectOpenedFromUrl)

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
        productImage: product.Image,
        variationId: currentVariation.Id,
        sizeName: currentVariation.Size.Name,
        flavorName: currentVariation.Flavour.Name,
        customization,
        priceBreakdown,
        specialInstructions: customization.specialInstructions,
        discount: currentVariation?.Discount || null
      })
    );
    toast.success(`${product.Name} added to your cart!`);

    // Close modal
    dispatch(closeProductModal());
    if (openedFromUrl) {
      router.push('/');
    } else {
      router.back();
    }
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
            className='bg-popup-cart-bg text-popup-cart-fg  cursor-pointer'
          />
        </div>
      </div>
    </div>
  );
}