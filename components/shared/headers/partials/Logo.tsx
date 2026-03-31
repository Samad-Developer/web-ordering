'use client';

import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { selectAddressApiData } from "@/store/slices/addressSlice";
import { useMenu } from "@/hooks/useMenu";
import { Shimmer } from "@/components/skeletons/MenuSkeleton";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const Logo = () => {
  const { isLoading: isMenuLoading } = useMenu();
  const addressAndThemeData = useAppSelector(selectAddressApiData);
  const settings = addressAndThemeData?.dataPayload?.Theme?.Settings;
  const logoSrc = settings?.RESTAURANT_LOGO;

  return (
    <Link
      href="/"
      className="hover:opacity-80 transition"
    >
      <div
        className="relative 
          w-[70px] h-[70px]        
          sm:w-[100px] sm:h-[100px] 
          rounded-full
          overflow-hidden shadow"
      >
          {isMenuLoading ? (
          <div className="w-full h-full bg-gray-300/40 animate-pulse rounded-full" ><Shimmer /></div>
        ) : (
          logoSrc && (
            <Image
              src={`${API_BASE_URL}/${logoSrc}`}
              alt="Logo"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 640px) 70px, (max-width: 1024px) 130px, 150px"
            />
          )
        )}
      </div>
    </Link>
  );
};
