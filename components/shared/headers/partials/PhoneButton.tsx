import React from "react";
import { Phone } from "lucide-react";

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
      className="flex items-center gap-2 lg:px-2 lg:py-2 rounded-lg text-gray-700 hover:opacity-90 transition-opacity"
    >
      <span className="rounded-lg bg-red-100 text-red-500 p-2">
        <Phone/>
      </span>

      <div className="hidden lg:flex flex-col items-start">
{/* Top Label */}
        <span className="text-xs font-medium text-gray-400 leading-none mb-0.5">
          CALL US
        </span>

      <span className="hidden lg:inline text-sm font-bold">{phoneNumber}</span>
      </div>
    </button>
  );
};
