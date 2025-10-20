import React from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  src: string;
  alt?: string;
  href?: string;
}

export const Logo: React.FC<LogoProps> = ({
  src,
  alt = "Logo",
  href = "/",
}) => {
  return (
    <Link
      href={href}
      className="flex items-center justify-center hover:opacity-80 transition"
    >
      <div
        className="
          relative 
          w-[70px] h-[70px]        
          sm:w-[100px] sm:h-[100px] 
          md:w-[130px] md:h-[130px] 
          lg:w-[150px] lg:h-[150px] 
        "
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          priority
          sizes="(max-width: 640px) 70px, (max-width: 1024px) 130px, 150px"
        />
      </div>
    </Link>
  );
};
