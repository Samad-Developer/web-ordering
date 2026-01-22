"use client";

import React from 'react';
import { BannerImage, BannerStyle } from '@/types/banner.types';
import { SingleBanner } from './SingleBanner';
import { CarouselBanner } from './CarouselBanner';
import { useAppSelector } from '@/store/hooks';
import { selectAddressApiData } from '@/store/slices/addressSlice';
import { useMemo } from 'react';

const BANNER_CONFIG = {
  images: [
    // {
    //   id: '1',
    //   src: '/assets/images/banner/banner1.webp',
    //   alt: 'Banner 1',
    // },
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';


const handleBannerClick = () => { };

const BannerWrapper = () => {
  const { style, showPaymentCards, autoPlay, autoPlayInterval } = BANNER_CONFIG;

  const addressAndThemeData = useAppSelector(selectAddressApiData);
  const settings = addressAndThemeData?.dataPayload?.Theme?.Settings;

  const bannerImages = useMemo(() => {
    const apiBanners = settings?.BANNER_IMAGES;

    // If no API banners or empty array, use defaults
    if (!apiBanners || apiBanners.length === 0) {
      return BANNER_CONFIG.images;
    }

    return apiBanners.map((banner, index) => ({
      id: `api-${index + 1}`,
      src: `${API_BASE_URL}${banner}`,
      alt: `Banner ${index + 1}`,
    }));
  }, [settings?.BANNER_IMAGES]);

  // No images at all
  if (!bannerImages || bannerImages.length === 0) {
    console.error('❌ BannerWrapper: No images available');
    return null;
  }

  // Limit to 5 images
  const limitedImages = bannerImages.slice(0, 5);
  if (bannerImages.length > 5) {
    console.warn('⚠️ BannerWrapper: Maximum 5 images allowed. Truncating...');
  }

  if (limitedImages.length === 1) {
    return (
      <SingleBanner
        images={[limitedImages[0]]}
        style={style}
        showPaymentCards={showPaymentCards}
        onClick={handleBannerClick}
      />
    );
  }

  return (
    <CarouselBanner
      images={limitedImages}
      style={style}
      showPaymentCards={showPaymentCards}
      onClick={handleBannerClick}
      autoPlay={autoPlay}
      autoPlayInterval={autoPlayInterval}
    />
  );
};

export default BannerWrapper;