// 'use client';

// import React, { useState, useMemo, useCallback } from 'react';
// import Image from 'next/image';
// import { Product } from '@/types/product';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { addItem, updateQuantity, removeItem } from '@/store/slices/cartSlice';
// import { ProductHeader } from './ProductHeader';
// import { SizeSelector } from './SizeSelector';
// import { PriceDisplay } from './PriceDisplay';
// import { AddToCartButton } from './AddToCartButton';
// import { QuantityCounter } from './QuantityCounter';

// interface ProductCardProps {
//   product: Product;
//   addToCartText?: string;
//   showCartIcon?: boolean;
//   onAddToCart?: (productId: string, size: string, quantity: number) => void;
//   className?: string;
//   imageClassName?: string;
//   showBadge?: boolean;
//   badgeText?: string;
// }

// export const ProductCard: React.FC<ProductCardProps> = ({
//   product,
//   addToCartText = 'ADD',
//   showCartIcon = false,
//   onAddToCart,
//   className = '',
//   imageClassName = '',
//   showBadge = false,
//   badgeText,
// }) => {
//   const dispatch = useAppDispatch();
//   const [selectedSize, setSelectedSize] = useState<string>(
//     product.sizes[0]?.value || ''
//   );
//   const [isLoading, setIsLoading] = useState(false);

//   // Get cart quantity for current product and size
//   const cartQuantity = useAppSelector((state) => {
//     const item = state.cart.items.find(
//       (item) =>
//         item.productId === product.id && item.size === selectedSize
//     );
//     return item?.quantity || 0;
//   });

//   const isInCart = cartQuantity > 0;

//   // Calculate current price based on selected size
//   const currentPrice = useMemo(() => {
//     const size = product.sizes.find((s) => s.value === selectedSize);
//     const multiplier = size?.priceMultiplier || 1;
//     return Math.round(product.basePrice * multiplier);
//   }, [product.basePrice, product.sizes, selectedSize]);

//   const originalPrice = useMemo(() => {
//     if (!product.originalPrice) return undefined;
//     const size = product.sizes.find((s) => s.value === selectedSize);
//     const multiplier = size?.priceMultiplier || 1;
//     return Math.round(product.originalPrice * multiplier);
//   }, [product.originalPrice, product.sizes, selectedSize]);

//   // Handle add to cart
//   const handleAddToCart = useCallback(async () => {
//     if (!selectedSize) return;

//     setIsLoading(true);

//     try {
//       const cartItem = {
//         productId: product.id,
//         productName: product.name,
//         size: selectedSize,
//         quantity: 1,
//         price: currentPrice,
//         image: product.image,
//       };

//       dispatch(addItem(cartItem));
//       onAddToCart?.(product.id, selectedSize, 1);

//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 300));
//     } catch (error) {
//       console.error('Failed to add to cart:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [
//     product.id,
//     product.name,
//     product.image,
//     selectedSize,
//     currentPrice,
//     dispatch,
//     onAddToCart,
//   ]);

//   // Handle quantity increase
//   const handleIncrease = useCallback(() => {
//     dispatch(
//       updateQuantity({
//         productId: product.id,
//         size: selectedSize,
//         quantity: cartQuantity + 1,
//       })
//     );
//   }, [dispatch, product.id, selectedSize, cartQuantity]);

//   // Handle quantity decrease
//   const handleDecrease = useCallback(() => {
//     dispatch(
//       updateQuantity({
//         productId: product.id,
//         size: selectedSize,
//         quantity: cartQuantity - 1,
//       })
//     );
//   }, [dispatch, product.id, selectedSize, cartQuantity]);

//   // Handle remove from cart
//   const handleRemove = useCallback(() => {
//     dispatch(
//       removeItem({
//         productId: product.id,
//         size: selectedSize,
//       })
//     );
//   }, [dispatch, product.id, selectedSize]);

//   // Handle size change
//   const handleSizeChange = useCallback((newSize: string) => {
//     setSelectedSize(newSize);
//   }, []);

//   return (
//     <article
//       className={`
//         bg-white rounded-2xl shadow-md overflow-hidden
//         hover:shadow-xl transition-all duration-300
//         transform hover:-translate-y-1
//         ${className}
//       `}
//     >
//       {/* Image Section */}
//       <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
//         <Image
//           src={product.image}
//           alt={product.name}
//           fill
//           className={`object-cover hover:scale-105 transition-transform duration-300 ${imageClassName}`}
//           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//         />

//         {/* Badge */}
//         {showBadge && badgeText && (
//           <div className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-md">
//             {badgeText}
//           </div>
//         )}

//         {/* Out of Stock Overlay */}
//         {product.stock === 0 && (
//           <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//             <span className="px-4 py-2 bg-white text-gray-900 font-bold rounded-lg">
//               Out of Stock
//             </span>
//           </div>
//         )}
//       </div>

//       {/* Content Section */}
//       <div className="p-6 space-y-4">
//         {/* Header */}
//         <ProductHeader name={product.name} description={product.description} />

//         {/* Size Selector */}
//         {product.sizes.length > 0 && (
//           <SizeSelector
//             sizes={product.sizes}
//             selectedSize={selectedSize}
//             onSizeChange={handleSizeChange}
//             disabled={product.stock === 0}
//           />
//         )}

//         {/* Price */}
//         <PriceDisplay
//           currentPrice={currentPrice}
//           originalPrice={originalPrice}
//         />

//         {/* Add to Cart / Counter */}
//         <div className="pt-2">
//           {isInCart ? (
//             <QuantityCounter
//               quantity={cartQuantity}
//               onIncrease={handleIncrease}
//               onDecrease={handleDecrease}
//               onRemove={handleRemove}
//               disabled={product.stock === 0}
//             />
//           ) : (
//             <AddToCartButton
//               onClick={handleAddToCart}
//               text={addToCartText}
//               showIcon={showCartIcon}
//               isLoading={isLoading}
//               disabled={product.stock === 0 || !selectedSize}
//             />
//           )}
//         </div>
//       </div>
//     </article>
//   );
// };

import React from "react";
import { MenuItem } from "@/types/menu.types";
import { ProductImage } from "./ProductImage";
import { ProductHeader } from "./ProductHeader";
import { PriceDisplay } from "./PriceDisplay";
import { AddToCartButton } from "./AddToCartButtom";
import { QuantityCounter } from "@/components/shared/counter/QuantityCounter";

interface ProductProps {
  product: MenuItem;
}

const ProductCardVerticalLayout1: React.FC<ProductProps> = ({ product }) => {
  const handleAddToCart = () => {};
  return (
    <article
      className={`
        bg-white rounded-2xl shadow-md overflow-hidden 
        hover:shadow-xl transition-all duration-300 
        transform hover:-translate-y-1
        cursor-pointer
      `}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <ProductImage src={product.Image} alt={product.Name} priority={true} />

        {/* Badge */}
        {/* {showBadge && badgeText && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-md">
            {badgeText}
          </div>
        )} */}

        {/* Out of Stock Overlay */}
        {/* {item.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="px-4 py-2 bg-white text-gray-900 font-bold rounded-lg">
              Out of Stock
            </span>
          </div>
        )} */}
      </div>

      {/* Content Section */}
      <div className="p-2 sm:p-6 space-y-4">
        {/* Header */}
        <ProductHeader
          name={product.Name}
          description="A quick brown fox jumps over the lazy dog. A quick brown fox jumps over the lazy dog."
        />

        {/* Size Selector */}
        {/* {product.sizes.length > 0 && (
           <SizeSelector
             sizes={product.sizes}
             selectedSize={selectedSize}
             onSizeChange={handleSizeChange}
             disabled={product.stock === 0}
           />
         )} */}

        {/* Price */}
        <PriceDisplay currentPrice={152} originalPrice={540} />

        {/* Add to Cart / Counter */}
        <div className="pt-2">
          {true ? (
            <QuantityCounter
              quantity={1}
              onIncrease={() => {}}
              onDecrease={() => {}}
              onRemove={() => {}}
              disabled={false}
            />
          ) : (
            <AddToCartButton
              onClick={handleAddToCart}
              text={`Add to Cart`}
              showIcon={true}
              isLoading={false}
              disabled={false}
            />
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCardVerticalLayout1;
