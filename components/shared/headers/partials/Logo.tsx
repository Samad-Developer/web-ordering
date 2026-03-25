'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { selectAddressApiData } from "@/store/slices/addressSlice";

export const Logo = () => {
  const addressAndThemeData = useAppSelector(selectAddressApiData);
  const settings = addressAndThemeData?.dataPayload?.Theme?.Settings;
  const logoSrc = settings?.RESTAURANT_LOGO || "/assets/images/logo/ygen.png";

  return (
    <Link
      href="/"
      className=" hover:opacity-80 transition"
    >
      <div
        className="
          relative 
          w-[70px] h-[70px]        
          sm:w-[100px] sm:h-[100px] 
          rounded-full
          overflow-hidden
        "
      >
        <Image
          src={logoSrc}
          alt="Logo"
          fill
          className="object-contain"
          priority
          sizes="(max-width: 640px) 70px, (max-width: 1024px) 130px, 150px"
        />
      </div>
    </Link>
  );
};
