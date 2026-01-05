'use client'
import React from 'react';
import {useTranslations} from 'next-intl';


interface ActionButtonProps {
  text: string;
  href: string;
  openInNewTab?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  href,
  openInNewTab = false,
}) => {
  const t = useTranslations('nav');

  return (
    <a
      href={href}
      target={openInNewTab ? '_blank' : '_self'}
      rel={openInNewTab ? 'noopener noreferrer' : ''}
      className="px-4 py-2 rounded-lg font-medium transition bg-primary text-secondary hover:opacity-90"
    >
      {t('submitComplaint')}
    </a>
  );
};