import React from 'react';

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
  return (
    <a
      href={href}
      target={openInNewTab ? '_blank' : '_self'}
      rel={openInNewTab ? 'noopener noreferrer' : ''}
      className="px-4 py-2 rounded-lg font-medium transition bg-header-button-bg text-header-button-text hover:opacity-90"
    >
      {text}
    </a>
  );
};