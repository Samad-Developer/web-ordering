"use client";

import React from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/image/imageUtils";

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean; 
}



export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = "",
  priority = false,
}) => {

  const imageSrc = getImageUrl(src, '/assets/images/products/product.webp');

  return (
    <div
      className={`relative w-full aspect-square overflow-hidden bg-gray-100 rounded-t-2xl ${className}`}
    >
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
          className="object-cover transition-transform duration-300 hover:scale-105"
          placeholder="blur"
          blurDataURL={imageSrc}
          loading={priority ? "eager" : "lazy"}
          priority={priority}
        />
    </div>
  );
};
