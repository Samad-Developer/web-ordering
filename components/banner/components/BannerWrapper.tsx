"use client";

import React from 'react';
import { BannerImage, BannerStyle } from '@/types/banner.types';
import { SingleBanner } from './SingleBanner';
import { CarouselBanner } from './CarouselBanner';


const BANNER_CONFIG = {
  images: [
    {
      id: '1',
      src: '/assets/images/banner/banner1.webp',
      alt: 'Banner 1',
    },
    {
      id: '2',
      src: '/assets/images/banner/banner2.webp',
      alt: 'Banner 2',
    },
    {
      id: '3',
      src: '/assets/images/banner/banner3.webp',
      alt: 'Banner 3',
    },
  ] as BannerImage[],

  // Style: 'full-width' or 'rounded'
  style: 'rounded' as BannerStyle,

  // Show payment cards (Visa & Mastercard)
  showPaymentCards: true,

  // Auto-play for carousel (only applies when multiple images)
  autoPlay: true,

  // Auto-play interval in milliseconds
  autoPlayInterval: 4000,
};


const handleBannerClick = () => {};


export const BannerWrapper: React.FC = () => {
  const { images, style, showPaymentCards, autoPlay, autoPlayInterval } = BANNER_CONFIG;

  if (!images || images.length === 0) {
    console.error('BannerWrapper: No images provided in configuration');
    return null;
  }

  if (images.length > 5) {
    console.warn('BannerWrapper: Maximum 5 images allowed. Truncating...');
  }

  if (images.length === 1) {
    return (
      <SingleBanner
        images={[images[0]]}
        style={style}
        showPaymentCards={showPaymentCards}
        onClick={handleBannerClick}
      />
    );
  }

  return (
    <CarouselBanner
      images={images}
      style={style}
      showPaymentCards={showPaymentCards}
      onClick={handleBannerClick}
      autoPlay={autoPlay}
      autoPlayInterval={autoPlayInterval}
    />
  );
};