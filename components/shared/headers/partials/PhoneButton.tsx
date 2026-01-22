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
      className="flex items-center gap-2 px-2 sm:px-3 py-2 sm:py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 hover:opacity-90 transition-opacity"
    >
      <span className="">{phoneIcon}</span>
      <span className="hidden lg:inline text-sm font-bold">{phoneNumber}</span>
    </button>
  );
};
