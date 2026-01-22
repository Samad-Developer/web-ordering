import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { SocialLink } from '@/types/footer.types';

interface SocialLinksProps {
  links: SocialLink[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
};

export const SocialLinks: React.FC<SocialLinksProps> = ({ links }) => {
  return (
    <div className="space-y-4 flex flex-col justify-center items-center sm:items-start sm:justify-start">
      <h3 className="text-xl font-semibold text-footer-fg dark:text-white">
        Follow us
      </h3>
      <div className="flex gap-4">
        {links.map((link, index) => {
          const Icon = iconMap[link.platform.toLowerCase()];
          return (
             <Link
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.ariaLabel}
              className="w-5 h-5 rounded-full dark:bg-gray-800 flex items-center justify-center text-footer-fg"
            >
              {Icon && <Icon className="w-5 h-5 hover:text-red-500" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
