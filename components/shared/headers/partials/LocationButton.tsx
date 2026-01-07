import React from "react";
import { openAddressModal } from "@/store/slices/addressSlice";
import { useAppDispatch } from "@/store/hooks";
import {useTranslations} from 'next-intl';

interface ChangeLocationProps {
  locationIcon: React.ReactNode;
}

export const ChangeLocation: React.FC<ChangeLocationProps> = ({ locationIcon }) => {
  const t = useTranslations('nav');
  const dispatch = useAppDispatch();

  const handleLocationChange = () => { 
    dispatch(openAddressModal());
    console.log("openAddressModalCalled////////////////////")
  };

  return (
    <button
      onClick={handleLocationChange}
      className="cursor-pointer flex items-center lg:gap-2 px-1 py-1 lg:px-2 rounded-lg transition bg-primary text-secondary hover:opacity-80"
    >
      <span className="">{locationIcon}</span>
      <div className="flex flex-col items-start">
        <span className="hidden lg:inline font-semibold">{t('changeLocation')}</span>
        <span className="hidden lg:inline text-sm">{t('selectedArea')}</span>
      </div>
    </button>
  );
};
