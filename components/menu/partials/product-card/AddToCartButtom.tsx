import React from "react";
import { PlusIcon } from "lucide-react";
import { addToCartButtonVariants, ProductCardLayout } from "@/lib/product/productCardVariants";

interface AddToCartButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  layout: ProductCardLayout;
}


export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  onClick,
  disabled = false,
  layout,
}) => {

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button"
      aria-label={"add to cart"}
      className={addToCartButtonVariants({layout})}
    >
      {layout === "vertical" ? (
        <span>Add to Cart</span>
      ) : (
        <PlusIcon className="w-5 h-5" />
      )}
    </button>
  );
};
