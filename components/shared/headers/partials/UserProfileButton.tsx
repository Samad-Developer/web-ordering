import React from 'react';

interface UserProfileProps {
  profileIcon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  profileIcon,
  href = '/profile',
  onClick,
}) => {
  return (
    <a
      href={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className="flex items-center justify-center p-1 md:p-2 rounded-lg transition bg-header-profile-bg text-header-profile-text hover:opacity-80"
    >
      {profileIcon}
    </a>
  );
};
