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
import { DiscountBadge } from "../DiscountBadge";
import { calculateDiscount } from "@/lib/discount/discountUtils";
import { cn } from "@/lib/utils";
import {
  cartActionVariants,
  contentSectionVariants,
  discountBadgePositionVariants,
  ProductCardLayout,
  productCardVariants,
} from "@/lib/product/productCardVariants";

interface ProductProps {
  product: MenuItem;
  cardLayout: ProductCardLayout;
}

const ProductCardVerticalLayout1: React.FC<ProductProps> = ({ product, cardLayout }) => {
  const dispatch = useDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [showRepeatModal, setShowRepeatModal] = useState(false);

  const displayPrice = product.Price;
  const displayDiscount = product.Discount;

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
  const hasMultipleVariationsAvailable =
    product.Variations.length > 1 ||
    (product.Variations[0]?.ItemChoices &&
      product.Variations[0].ItemChoices.length > 0);

  // Direct add to cart (simple products)
  const handleDirectAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    const variation = product.Variations[0];
    const priceCalc = calculateDiscount(variation.Price, variation.Discount);

    dispatch(
      addToCart({
        productId: product.Id,
        productName: product.Name,
        productImage: product.Image,
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
          basePrice: priceCalc.finalPrice,
          originalBasePrice: variation.Price,
          addonsTotal: 0,
          subtotal: priceCalc.finalPrice,
          total: priceCalc.finalPrice,
        },
        discount: variation.Discount,
        specialInstructions: "",
      }),
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
        className={cn(
          productCardVariants({ layout: cardLayout, clickable: !isSimpleProduct }),
        )}
        onClick={handleOpenModal}
      >
        {displayDiscount && (
          <div className={discountBadgePositionVariants({ layout: cardLayout })}>
            <DiscountBadge discount={displayDiscount} size="md" bounce={true} />
          </div>
        )}

        {/* Product Image */}
        <ProductImage src={product.Image} alt={product.Name} priority={true} layout={cardLayout}/>

        {/* Content Section */}
        <div className={contentSectionVariants({ layout: cardLayout })}>
          <ProductHeader
            name={product.Name}
            description={product.Description}
            layout={cardLayout}
          />

          <PriceDisplay
            price={displayPrice}
            discount={displayDiscount}
            size="md"
            layout={cardLayout}
          />

          {/* Add to Cart / Quantity Counter */}
          <div className={cartActionVariants({ layout: cardLayout })} onClick={(e) => e.stopPropagation()}>
            {isInCart ? (
              <QuantityCounter
                quantity={totalQuantity}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRemove={handleRemove}
                layout={cardLayout}
              />
            ) : (
              <AddToCartButton
                onClick={handleAddToCartClick}
                disabled={product.Variations.length === 0}
                layout={cardLayout}
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
