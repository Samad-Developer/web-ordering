import React, { useEffect } from "react";
import { openAddressModal } from "@/store/slices/addressSlice";
import { useAppDispatch } from "@/store/hooks";
import addressData from "@/data/address.json"
import { setOrderModesData } from "@/store/slices/addressSlice";
import {useTranslations} from 'next-intl';

interface ChangeLocationProps {
  locationIcon: React.ReactNode;
}

export const ChangeLocation: React.FC<ChangeLocationProps> = ({
  locationIcon,
}) => {
  const dispatch = useAppDispatch();
  const t = useTranslations('nav');
  const handleLocationChange = () => { 
    dispatch(openAddressModal());
  };

  useEffect(() => {
    dispatch(setOrderModesData(addressData));
  }, [dispatch]);

  return (
    <button
      onClick={handleLocationChange}
      className="cursor-pointer flex items-center lg:gap-2 px-1 py-1 lg:px-2 rounded-lg transition bg-primary text-secondary hover:opacity-80"
    >
      <span className="">{locationIcon}</span>
      <div className="flex flex-col items-start">
        <span className="hidden lg:inline font-semibold">{t('changeLocation')}</span>
        {/* this will be dynamic based on user selected area */}
        <span className="hidden lg:inline text-sm">{t('selectedArea')}</span>
      </div>
    </button>
  );
};
