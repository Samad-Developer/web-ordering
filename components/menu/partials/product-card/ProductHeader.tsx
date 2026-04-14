"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  productHeaderVariants,
  productNameVariants,
  productDescriptionVariants,
  ProductCardLayout,
} from "@/lib/product/productCardVariants";

interface ProductHeaderProps {
  name: string;
  description?: string;
  layout: ProductCardLayout;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  name,
  description,
  layout,
}) => {
  const shouldShowDescription =
    description &&
    description !== "null" &&
    description.trim() !== "" &&
    description.trim() !== "N/A" &&
    description !== "n/a";

  return (
    <div className={productHeaderVariants({ layout })}>
      <h3 className={productNameVariants({ layout })}>{name}</h3>
      <p className={productDescriptionVariants({ layout })}>
        {shouldShowDescription
          ? description
          : "A freshly brewed coffee crafted from premium beans, delivering rich aroma and smooth flavor in every sip."}
      </p>
    </div>
  );
};
