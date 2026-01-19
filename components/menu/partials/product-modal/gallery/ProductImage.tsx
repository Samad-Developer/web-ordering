"use client"
import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/image/imageUtils";

interface ProductImageProps {
  image: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  image,
  alt,
  className,
  priority = false,
}) => {

  const imageSrc = getImageUrl(image, '/assets/images/products/product.webp')

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden bg-gray-100",
        className
      )}
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
    </div>
  );
};
