"use client";

import React from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/image/imageUtils";
import { ProductCardLayout, productImageVariants } from "@/lib/product/productCardVariants";
import { useConfig } from "@/hooks/useConfig";

interface ProductImageProps {
  src?: string;
  alt: string;
  priority?: boolean;
  layout: ProductCardLayout;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  priority = true,
  layout,
}) => {
  const websiteConfig = useConfig();
  const websiteLogo = websiteConfig?.RESTAURANT_LOGO || '';
  const imageSrc = getImageUrl(src, websiteLogo);
  
  return (
    <div className={productImageVariants({ layout })}>
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
        className="object-cover transition-transform duration-300 hover:scale-105"
        placeholder="blur"
        blurDataURL={imageSrc}
        loading={priority ? "eager" : "lazy"}
        quality={75}
      />
    </div>
  );
};
