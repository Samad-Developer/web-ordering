import React from "react";

interface ChangeLocationProps {
  locationIcon: React.ReactNode;
}

export const ChangeLocation: React.FC<ChangeLocationProps> = ({
  locationIcon,
}) => {
  
  const handleLocationChange = () => {};

  return (
    <button
      onClick={handleLocationChange}
      className="flex items-center lg:gap-2 px-1 py-1 lg:px-2 rounded-lg transition bg-header-location-bg text-header-location-text hover:opacity-80"
    >
      <span className="text-header-location-icon">{locationIcon}</span>
      <div className="flex flex-col items-start">
        <span className="hidden lg:inline font-semibold">Change Location</span>
        {/* this will be dynamic based on user selected area */}
        <span className="hidden lg:inline text-sm">Selected Area</span>
      </div>
    </button>
  );
};
