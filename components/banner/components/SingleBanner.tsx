import React from 'react';
import Image from 'next/image';
import { SingleBannerProps } from '@/types/banner.types';
import { PaymentCards } from './PaymentCards';
import { cn } from '@/lib/utils';

export const SingleBanner: React.FC<SingleBannerProps> = ({
  images,
  style = 'full-width',
  showPaymentCards = true,
  onClick,
}) => {
  const [image] = images;

  const containerClasses = cn(
    'relative w-full overflow-hidden',
    style === 'rounded' && 'px-4 md:px-6 lg:px-8 py-4',
    onClick && 'cursor-pointer'
  );

  const imageWrapperClasses = cn(
    'relative w-full',
    'aspect-[1400/400]', // Maintain 1400x400 aspect ratio
    style === 'rounded' && 'rounded-xl overflow-hidden',
  );

  return (
    <div className={containerClasses}>
      <div className={imageWrapperClasses} onClick={onClick}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1400px"
          className="object-cover"
          quality={90}
        />
        {showPaymentCards && <PaymentCards />}
      </div>
    </div>
  );
};