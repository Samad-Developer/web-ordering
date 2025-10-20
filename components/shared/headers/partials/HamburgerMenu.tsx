import React from 'react';

interface HamburgerMenuProps {
  menuIcon: React.ReactNode;
  isOpen?: boolean;
  onToggle: (isOpen: boolean) => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  menuIcon,
  isOpen = false,
  onToggle,
}) => {
  return (
    <button
      onClick={() => onToggle(!isOpen)}
      className="flex items-center justify-center md:p-2 rounded-lg transition hover:bg-header-hamburger-bg text-header-hamburger-text"
      aria-label="Toggle menu"
    >
      {menuIcon}
    </button>
  );
};
