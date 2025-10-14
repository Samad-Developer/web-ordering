
export type BannerStyle = 'full-width' | 'rounded';

export interface BannerImage {
  src: string;
  alt: string;
  id: string;
}

export interface BannerConfig {
  images: BannerImage[];
  style?: BannerStyle;
  showPaymentCards?: boolean;
  onClick?: () => void;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export interface SingleBannerProps extends BannerConfig {
  images: [BannerImage]; // Exactly one image
}

export interface CarouselBannerProps extends BannerConfig {
  images: BannerImage[]; // 1-5 images
}