
import React from "react";
import { useDispatch } from "react-redux";
import { PriceDisplay } from "./PriceDisplay";
import { MenuItem } from "@/types/menu.types";
import { ProductImage } from "./ProductImage";
import { ProductHeader } from "./ProductHeader";
import { AddToCartButton } from "./AddToCartButtom";
import { QuantityCounter } from "./QuantityCounter";
import { openProductModal } from "@/store/slices/productModalSlice";

interface ProductProps {
  product: MenuItem;
}

const ProductCardVerticalLayout1: React.FC<ProductProps> = ({ product }) => {
  const dispatch = useDispatch();

  const handleOpenModal = () => {
    // here we have to decide if this product contain single item we have to add it to cart directly
    // but if it contains multiple varaition we have to open Modal for user to select
    dispatch(openProductModal(product));

    // 2. Update URL without navigation
    const slug = `${product.Name.toLowerCase().replace(/\s+/g, "-")}-${
      product.Id
    }`;
    if (typeof window !== "undefined") {
    window.history.pushState(null, "", `/product/${slug}`);
    }
  };

  const handleAddToCart = () => {};
  
  return (
    <article
      className={`
        bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-300 
        transform hover:-translate-y-1
        cursor-pointer
      `}
      onClick={handleOpenModal}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <ProductImage src={product.Image} alt={product.Name} priority={true} />
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
        <PriceDisplay currentPrice={product.Price} originalPrice={product.Price} />

        {/* Add to Cart / Counter */}
        <div className="pt-2">
          {false ? (
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
