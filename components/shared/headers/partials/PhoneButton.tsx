import React from "react";

interface PhoneNumberProps {
  phoneIcon: React.ReactNode;
  phoneNumber: string;
}

export const PhoneNumber: React.FC<PhoneNumberProps> = ({
  phoneIcon,
  phoneNumber,
}) => {
  
  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <button
      onClick={handleCall}
      className="flex items-center gap-2 lg:px-4 lg:py-2 rounded-lg transition bg-header-phone-bg text-header-phone-text hover:opacity-80"
    >
      <span className="">{phoneIcon}</span>
      <span className="hidden lg:inline text-sm font-bold">{phoneNumber}</span>
    </button>
  );
};
