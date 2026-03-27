"use client";

import React from "react";
import Image from "next/image";
import { CarouselBannerProps } from "@/types/banner.types";
import { PaymentCards } from "./PaymentCards";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { getImageUrl } from "@/lib/image/imageUtils";

export const CarouselBanner: React.FC<CarouselBannerProps> = ({
  images,
  style = "full-width",
  showPaymentCards = true,
  onClick,
  autoPlay = true,
  autoPlayInterval = 3000,
}) => {
  const bannerImages = images.slice(0, 5);

  const plugin = React.useRef(
    Autoplay({ delay: autoPlayInterval, stopOnInteraction: true })
  );

  const containerClasses = cn(
    "relative w-full",
    style === "rounded" && "px-2 py-2 md:p-6"
  );

  const imageWrapperClasses = cn(
    "w-full flex justify-center",
    style === "rounded" && "rounded-xl overflow-hidden",
    onClick && "cursor-pointer"
  );

  return (
    <div className={containerClasses}>
      <Carousel
        plugins={autoPlay ? [plugin.current] : []}
        className="w-full rounded-xl overflow-hidden"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {bannerImages.map((image) => (
            <CarouselItem
              key={image.id}
              className="flex justify-center items-center"
            >
              <div className={imageWrapperClasses} onClick={onClick}>
                <Image
                  src={getImageUrl(image.src)}
                  alt={image.alt}
                  width={1400} 
                  height={400}
                  priority={bannerImages.indexOf(image) === 0}
                  className="w-full h-auto object-contain rounded-xl overflow-hidden"
                  quality={90}
                />
                {showPaymentCards && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full px-4 md:px-0">
                    <PaymentCards />
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Buttons */}
        <CarouselPrevious className="left-4 hidden md:flex z-10" />
        <CarouselNext className="right-4 hidden md:flex z-10" />
      </Carousel>
    </div>
  );
};