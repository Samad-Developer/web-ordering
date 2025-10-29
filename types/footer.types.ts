// types/footer.ts
export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  ariaLabel: string;
}

export interface AppDownload {
  platform: 'ios' | 'android';
  url: string;
  icon: string;
}

export interface ContactInfo {
  type: 'phone' | 'email' | 'address';
  value: string;
  href?: string;
  icon?: string;
}

export interface FooterContent {
  about: {
    title: string;
    description: string;
  };
  contact: ContactInfo[];
  social: SocialLink[];
  appDownload: {
    title: string;
    subtitle: string;
    apps: AppDownload[];
    image?: string;
  };
  footerLogo?: {
    src: string;
  };

}