import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/store/hooks";
import { selectCartItems } from "@/store/slices/cartSlice";
import { PriceDisplay } from "./PriceDisplay";
import { MenuItem } from "@/types/menu.types";
import { ProductImage } from "./ProductImage";
import { ProductHeader } from "./ProductHeader";
import { AddToCartButton } from "./AddToCartButtom";
import { QuantityCounter } from "./QuantityCounter";
import { VariationSelectionModal } from "./inc-dec-modals/VariationSelectionModal";
import { openProductModal } from "@/store/slices/productModalSlice";
import {
  addToCart,
  incrementItem,
  decrementItem,
  removeItem,
} from "@/store/slices/cartSlice";
import { toast } from "sonner";
import {
  getProductTotalQuantity,
  getProductCartItems,
  hasMultipleVariations,
} from "@/lib/cart/cartHelpers";
import { RepeatLastOrderModal } from "./inc-dec-modals/RepeatLastOrderModal";
import { getLastAddedItem } from "@/lib/cart/cartHelpers";
import { toSlug } from "@/lib/address/slug";

interface ProductProps {
  product: MenuItem;
}

const ProductCardVerticalLayout1: React.FC<ProductProps> = ({ product }) => {
  const dispatch = useDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [showRepeatModal, setShowRepeatModal] = useState(false);

  // Check if product can be added directly (single variation, no addons)
  const canAddDirectly = (): boolean => {
    if (product.Variations.length !== 1) return false;
    const variation = product.Variations[0];
    return !variation.ItemChoices || variation.ItemChoices.length === 0;
  };

  // Get total quantity across all variations
  const totalQuantity = getProductTotalQuantity(cartItems, product.Id);
  const isInCart = totalQuantity > 0;

  // Get all cart items for this product
  const productCartItems = getProductCartItems(cartItems, product.Id);
  const hasMultipleInCart = hasMultipleVariations(cartItems, product.Id);
  const lastAddedItem = getLastAddedItem(cartItems, product.Id);

  // Check if product has multiple variations available
  const hasMultipleVariationsAvailable = product.Variations.length > 1 ||
    (product.Variations[0]?.ItemChoices && product.Variations[0].ItemChoices.length > 0);


  // Direct add to cart (simple products)
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

  // Open product modal for configuration
  const handleOpenModal = () => {
    dispatch(openProductModal(product));

    const slug = toSlug(product.Name);

    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `/product/${slug}`);
    }
  };

  // Handle add to cart button click
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

    // CASE 1: Simple product with single item in cart
    if (canAddDirectly() && productCartItems.length === 1) {
      dispatch(incrementItem(productCartItems[0].cartItemId));
      return;
    }

    // CASE 2: Product has variations AND has items in cart
    if (hasMultipleVariationsAvailable && isInCart && lastAddedItem) {
      // Show "Repeat Last Order" modal
      setShowRepeatModal(true);
      return;
    }

    // CASE 3: Product has variations but NOT in cart
    if (hasMultipleVariationsAvailable && !isInCart) {
      handleOpenModal();
      return;
    }

    // CASE 4: Fallback - just open modal
    handleOpenModal();
  };

  // Handle decrease quantity
  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();

    // If product has multiple variations in cart, show selection modal
    if (hasMultipleInCart) {
      setShowVariationModal(true);
    }
    // If single variation, decrement/remove directly
    else if (productCartItems.length === 1) {
      const item = productCartItems[0];
      if (item.customization.quantity > 1) {
        dispatch(decrementItem(item.cartItemId));
      } else {
        dispatch(removeItem(item.cartItemId));
        toast.info("Removed from cart");
      }
    }
  };

  // Handle remove (only called when clicking remove in counter)
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();

    // If multiple variations, show modal
    if (hasMultipleInCart) {
      setShowVariationModal(true);
    }
    // If single variation, remove directly
    else if (productCartItems.length === 1) {
      dispatch(removeItem(productCartItems[0].cartItemId));
      toast.info("Removed from cart");
    }
  };

  const isSimpleProduct = canAddDirectly();

  return (
    <>
      <article
        className={`
          bg-product-bg hover:bg-product-hover rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] 
          hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] 
          overflow-hidden transition-all duration-300 
          transform hover:-translate-y-1
          ${!isSimpleProduct ? "cursor-pointer" : ""}
        `}
        onClick={handleOpenModal}
      >
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          <ProductImage src={product.Image} alt={product.Name} priority={true} />

          {/* Badge for multiple variations in cart */}
          {hasMultipleInCart && (
            <div className="absolute top-3 left-3 border bg-primary text-secondary text-xs font-semibold px-2 py-1 rounded-full shadow-lg">
              {productCartItems.length} variants in cart
            </div>
          )}
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
                quantity={totalQuantity}
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

      {/* Variation Selection Modal */}
      <VariationSelectionModal
        open={showVariationModal}
        onOpenChange={setShowVariationModal}
        productName={product.Name}
        variations={productCartItems}
      />

      {/* Repeat Last Order Modal (for increase) */}
      {lastAddedItem && (
        <RepeatLastOrderModal
          open={showRepeatModal}
          onOpenChange={setShowRepeatModal}
          lastOrder={lastAddedItem}
          onChooseAgain={handleOpenModal}
        />
      )}
    </>
  );
};

export default ProductCardVerticalLayout1;