"use client";

import React from 'react';
import Image from 'next/image';
import { CarouselBannerProps } from '@/types/banner.types';
import { PaymentCards } from './PaymentCards';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

export const CarouselBanner: React.FC<CarouselBannerProps> = ({
  images,
  style = 'full-width',
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
    'relative w-full',
    style === 'rounded' && 'px-2 md:px-6 lg:px-8 py-4'
  );

  const imageWrapperClasses = cn(
    'relative w-full h-auto',
    'aspect-[1400/400]', // Maintain 1400x400 aspect ratio
    style === 'rounded' && 'rounded-xl overflow-hidden',
    onClick && 'cursor-pointer',
  );

  return (
    <div className={containerClasses}>
      <Carousel
        plugins={autoPlay ? [plugin.current] : []}
        className="w-full"
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent>
          {bannerImages.map((image) => (
            <CarouselItem key={image.id}>
              <div className={imageWrapperClasses} onClick={onClick}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={bannerImages.indexOf(image) === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1400px"
                  className="object-cover"
                  quality={90}
                />
                {showPaymentCards && <PaymentCards />}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation Buttons - Hidden on mobile */}
        <CarouselPrevious className="left-4 hidden md:flex" />
        <CarouselNext className="right-4 hidden md:flex" />
      </Carousel>
    </div>
  );
};