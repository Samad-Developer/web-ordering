import React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/store/hooks";
import { selectCartItems } from "@/store/slices/cartSlice";
import { PriceDisplay } from "./PriceDisplay";
import { MenuItem } from "@/types/menu.types";
import { ProductImage } from "./ProductImage";
import { ProductHeader } from "./ProductHeader";
import { AddToCartButton } from "./AddToCartButtom";
import { QuantityCounter } from "./QuantityCounter";
import { openProductModal } from "@/store/slices/productModalSlice";
import {
  addToCart,
  incrementItem,
  decrementItem,
  removeItem,
} from "@/store/slices/cartSlice";
import { toast } from "sonner";

interface ProductProps {
  product: MenuItem;
}

const ProductCardVerticalLayout1: React.FC<ProductProps> = ({ product }) => {
  const dispatch = useDispatch();
  const cartItems = useAppSelector(selectCartItems);

  const canAddDirectly = (): boolean => {
    if (product.Variations.length !== 1) return false;

    const variation = product.Variations[0];
    return !variation.ItemChoices || variation.ItemChoices.length === 0;
  };

  const getCartItem = () => {
    return cartItems.find(
      (item) =>
        product.Variations.some(
          (variation) => variation.Id === item.variationId
        ) && item.productId === product.Id
    );
  };

  const cartItem = getCartItem();
  const isInCart = !!cartItem;

  const handleDirectAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    const variation = product.Variations[0];

    dispatch(
      addToCart({
        productId: product.Id,
        productName: product.Name,
        productImage:
          product.Image !== "N/A" ? product.Image : "/placeholder-food.jpg",
        variationId: variation.Id,
        sizeName: variation.Size.Name,
        flavorName: variation.Flavour.Name,
        customization: {
          selectedSizeId: variation.Size.Id,
          selectedFlavorId: variation.Flavour.Id,
          selectedVariationId: variation.Id,
          selectedAddons: {},
          quantity: 1,
          specialInstructions: "",
        },
        priceBreakdown: {
          basePrice: variation.Price,
          addonsTotal: 0,
          subtotal: variation.Price,
          total: variation.Price,
        },
        specialInstructions: "",
      })
    );

    toast.success("Added to cart!", {
      duration: 2000,
    });
  };

  const handleOpenModal = () => {
    dispatch(openProductModal(product));

    const slug = `${product.Name.toLowerCase().replace(/\s+/g, "-")}-${
      product.Id
    }`;
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `/product/${slug}`);
    }
  };

  const handleCardClick = () => {
    handleOpenModal();
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    if (canAddDirectly()) {
      handleDirectAddToCart(e);
    } else {
      e.stopPropagation();
      handleOpenModal();
    }
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      dispatch(incrementItem(cartItem.cartItemId));
    }
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      dispatch(decrementItem(cartItem.cartItemId));
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      dispatch(removeItem(cartItem.cartItemId));
      toast.info("Removed from cart");
    }
  };

  const isSimpleProduct = canAddDirectly();

  return (
    <article
      className={`
        bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] 
        hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] 
        overflow-hidden transition-all duration-300 
        transform hover:-translate-y-1
        ${!isSimpleProduct ? "cursor-pointer" : ""}
      `}
      onClick={handleCardClick}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <ProductImage src={product.Image} alt={product.Name} priority={true} />
      </div>

      {/* Content Section */}
      <div className="p-2 sm:p-6 space-y-4">
        <ProductHeader
          name={product.Name}
          description={
            product.Comment || "Delicious and freshly made just for you"
          }
        />

        <PriceDisplay
          currentPrice={product.Variations[0]?.Price || product.Price}
          originalPrice={product.Variations[0]?.Price || product.Price}
        />

        {/* Add to Cart / Quantity Counter */}
        <div className="pt-2" onClick={(e) => e.stopPropagation()}>
          {isInCart ? (
            <QuantityCounter
              quantity={cartItem!.customization.quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemove}
              disabled={false}
            />
          ) : (
            <AddToCartButton
              onClick={handleAddToCartClick}
              text={"Add to Cart"}
              showIcon={true}
              isLoading={false}
              disabled={product.Variations.length === 0}
            />
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCardVerticalLayout1;
